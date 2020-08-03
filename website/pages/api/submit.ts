import { Octokit } from '@octokit/rest'
import { SubmitArgs } from 'edit-this-page/src/submit'
import { NextApiHandler } from 'next/types'
import _parseGithubUrl from 'parse-github-url'
import * as uuid from 'uuid'
import {
    GITHUB_TOKEN,
    MAX_WEEKLY_PR_COUNT,
    APP_NAME,
    PR_BODY,
} from '../../constants'
import { pretty, cors } from '../../support'
import dayjs from 'dayjs'
import memoize from 'memoizee'
import { authenticateApp, getGithubAppName } from '../../github'

const handler: NextApiHandler = async (req, res) => {
    // TODO only certain hosts can make more than N edits, people can pay to get more edits
    try {
        await cors(req, res)
        // throw new Error('unexpected error\n ai ai')
        const {
            filePath,
            changedCode,
            githubUrl,
            baseBranch,
            title,
            body,
        }: SubmitArgs = req.body

        const octokit = await authenticateApp({ githubUrl })

        const { count } = await getPrsCount(octokit, {
            githubUrl,
            since: dayjs().subtract(1, 'week').toDate(),
            author: `app/${await getGithubAppName()}`,
        })

        if (count > MAX_WEEKLY_PR_COUNT) {
            throw new Error(
                'max number of prs opened already reached in this week,\nlimit is set to ${MAX_WEEKLY_PR_COUNT}, value is ${count}',
            )
        }

        const newBranchName = `${APP_NAME}/${uuid.v4().slice(0, 8)}`

        const branchRes = await createBranch(octokit, {
            githubUrl,
            name: newBranchName,
        })

        let commitRes = await commitFiles(octokit, {
            githubUrl,
            message: title || `Changes by ${APP_NAME}`,
            branch: newBranchName,
            tree: [
                {
                    path: filePath,
                    mode: '100644',
                    content: changedCode,
                },
            ],
        })

        // TODO the pr tries to merge inside the last commit branch, 
        const { prUrl, ...prRes } = await createPr(octokit, {
            githubUrl,
            branch: branchRes.data.ref,
            body: `${body || ''}\n\n${PR_BODY}`,
            // prCreator: await getGithubAppName(),
            title: title || `Changes for '${filePath}'`,
            baseBranch,
        })

        // console.log(data)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({
            url: prUrl,
        })
    } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        const error = 'Error creating pull request ' + e?.message || String(e)
        console.error(error)
        res.json({
            error,
        })
    }
}

export const getMyUsername = memoize(
    async (octokit: Octokit) => {
        const { data } = await octokit.users.getAuthenticated()
        return data.login
    },
    {
        promise: true,
        normalizer: () => '',
    },
)

// export async function createForkAndBranch(
//     octokit: Octokit,
//     { githubUrl, newBracnhName },
// ) {
//     const forkRes = await createFork(octokit, { githubUrl })
//     return await createBranch(octokit, {
//         githubUrl: forkRes.data.html_url,
//         name: newBracnhName,
//     })
// }

export async function createFork(octokit: Octokit, { githubUrl }) {
    const { owner, repo } = parseGithubUrl(githubUrl)

    console.log(`creating fork`)
    const forkRes = await octokit.repos.createFork({
        owner,
        repo,
    })
    // pretty(forkRes.data)

    let toSleep = 1400
    while (!(await existsRepo(octokit, { githubUrl: forkRes.data.html_url }))) {
        console.log(`waiting fork creation`)
        await sleep(toSleep)
        toSleep += 1000
    }

    return forkRes
}

export async function createBranch(octokit: Octokit, { githubUrl, name }) {
    console.log(`getting last commits`)
    let response = await octokit.repos.listCommits({
        ...parseGithubUrl(githubUrl),
        // sha: fromBranch,
        per_page: 1,
    })
    const latestCommitSha = response.data[0].sha

    console.log(`creating branch`)
    const branchRes = await octokit.git.createRef({
        ...parseGithubUrl(githubUrl),
        ref: `refs/heads/${name}`,
        sha: latestCommitSha,
    })
    return branchRes
}

export async function createPr(
    octokit: Octokit,
    { githubUrl, title, body = '', branch, prCreator = '', baseBranch },
) {
    const { owner, repo } = parseGithubUrl(githubUrl)

    console.log(`opening pull request at '${githubUrl}'`)
    const res = await octokit.pulls.create({
        owner,
        repo,
        title,
        /**
         * The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace `head` with a user like this: `username:branch`.
         */
        head:
            prCreator && prCreator !== owner
                ? `${prCreator}:${branch}`
                : branch,
        /**
         * The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
         */

        base: baseBranch,
        body,
        maintainer_can_modify: true,
    })
    return {
        ...res,
        prUrl: `https://github.com/${owner}/${repo}/pull/${res.data.number}`,
    }
}

export default handler

export function parseGithubUrl(githubUrl): { repo; owner } {
    if (!githubUrl) {
        throw new Error(`cannot parse null github url `)
    }
    const parsedUrl = _parseGithubUrl(githubUrl)
    if (!parsedUrl) {
        throw new Error('cannot parse github url ' + githubUrl)
    }
    const { owner, name: repo } = parsedUrl
    if (!owner || !repo) {
        throw new Error('cannot parse github url ' + githubUrl)
    }
    return { repo, owner }
}

export async function commitFiles(
    octokit: Octokit,
    {
        githubUrl,
        tree,
        branch,
        message,
    }: {
        githubUrl
        // baseBranch?: string
        branch
        // lastCommitFromGithubUrl?: string
        tree: { path; mode: '100644'; content }[] // mode '100644',
        message
    },
) {
    const { owner, repo } = parseGithubUrl(githubUrl)
    console.log('getting latest commit sha & treeSha')
    let response = await octokit.repos.listCommits({
        // TODO not sure all this is necessary, maybe github handle this
        ...parseGithubUrl(githubUrl),
        sha: branch,
        per_page: 1,
    })
    const latestCommitSha = response.data[0].sha
    const treeSha = response.data[0].commit.tree.sha
    // console.log(`commit sha: ${latestCommitSha}, tree sha: ${treeSha}`)

    console.log('creating tree')
    const treeResponse = await octokit.git.createTree({
        owner,
        repo,
        base_tree: treeSha,
        tree,
    })
    const newTreeSha = treeResponse.data.sha

    // console.log(`new tree sha: ${newTreeSha}`)

    console.log('creating commit')
    const commitRes = await octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: newTreeSha,
        parents: [latestCommitSha],
        // author: {
        //     name: 'containerful',
        //     email: 'apu@martynus.net',
        // },
    })
    const newCommitSha = commitRes.data.sha
    console.log('updating commit ref')
    await octokit.git.updateRef({
        owner,
        repo,
        force: true,
        sha: newCommitSha,
        ref: `heads/${branch}`, // sometimes is refs/
    })
    // console.log(`new commit sha: ${newCommitSha}`)
    console.log(
        `new commit available at 'https://github.com/${owner}/${repo}/commit/${newCommitSha}'`,
    )
}

export async function getPrsCount(
    octokit: Octokit,
    {
        githubUrl,
        author,
        since,
    }: {
        githubUrl: string
        author?: string
        since?: Date
    },
) {
    const qParts = [`is:pr`]
    if (since) {
        qParts.push(`created:>=${since.toISOString().split('T')[0]}`)
    }
    if (author) {
        qParts.push(`author:${author}`)
    }
    const q = qParts.join('+')
    // console.log(q)
    console.log(`getting prs count for ${githubUrl}`)
    const res = await octokit.search.issuesAndPullRequests({
        ...parseGithubUrl(githubUrl),
        q,
        per_page: 40,
    })
    return { count: res.data.total_count, ...res.data }
}

export async function existsRepo(octokit: Octokit, { githubUrl }) {
    try {
        const res = await octokit.repos.get({
            ...parseGithubUrl(githubUrl),
        })
        // console.log('existsRepo', res.data)
        return !!res.data.url
    } catch {
        return false
    }
}

export const sleep = (t) => new Promise((res) => setTimeout(res, t))
