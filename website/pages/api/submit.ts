import { Octokit } from '@octokit/rest'
import { SubmitArgs } from 'edit-this-page/src/submit'
import { NextApiHandler } from 'next/types'
import _parseGithubUrl from 'parse-github-url'
import * as uuid from 'uuid'
import { GITHUB_TOKEN, MAX_WEEKLY_PR_COUNT } from '../../constants'
import { pretty, cors } from '../../support'
import dayjs from 'dayjs'
import memoize from 'memoizee'

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
        }: SubmitArgs = req.body

        const octokit = new Octokit({ auth: GITHUB_TOKEN })

        const { count } = await getPrsCount(octokit, {
            githubUrl,
            since: dayjs().subtract(1, 'week').toDate(),
            author: await getMyUsername(octokit),
        })

        if (count > MAX_WEEKLY_PR_COUNT) {
            throw new Error(
                'max number of prs opened already reached in this week,\nlimit is set to ${MAX_WEEKLY_PR_COUNT}, value is ${count}',
            )
        }

        const newBranchName = uuid.v4()

        const { branchRef, ...forkRes } = await createForkAndBranch(octokit, {
            githubUrl,
            newBranchName,
        })

        let commitRes = await commitFiles(octokit, {
            githubUrl,
            message: `Edited '${filePath}' via 'edit-this-page'`,
            branch: newBranchName,
            tree: [
                {
                    path: filePath,
                    mode: '100644',
                    content: changedCode,
                },
            ],
        })

        const { prUrl, ...prRes } = await createPr(octokit, {
            githubUrl,
            branch: branchRef,
            prCreator: await getMyUsername(octokit),
            title: title || `Changes for '${filePath}'`,
            // TODO get the current branch or use babel config
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
        res.json({
            error: e?.message || String(e),
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

export async function createForkAndBranch(
    octokit: Octokit,
    { githubUrl, newBranchName },
) {
    const { owner, repo } = parseGithubUrl(githubUrl)

    console.log(`creating fork`)
    const forkRes = await octokit.repos.createFork({
        owner,
        repo,
    })
    pretty(forkRes.data)

    console.log(`getting last commits`)
    let response = await octokit.repos.listCommits({
        owner,
        repo,
        // sha: fromBranch,
        per_page: 1,
    })
    const latestCommitSha = response.data[0].sha

    console.log(`creating branch`)
    const branchRes = await octokit.git.createRef({
        owner: forkRes.data.owner.login,
        repo: forkRes.data.name,
        ref: `refs/heads/${newBranchName}`,
        sha: latestCommitSha,
    })

    return { ...forkRes.data, branchRef: branchRes.data.ref }
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
        branch
        tree: { path; mode: '100644'; content }[] // mode '100644',
        message
    },
) {
    const { owner, repo } = parseGithubUrl(githubUrl)
    console.log('getting latest commit sha & treeSha')
    let response = await octokit.repos.listCommits({
        owner,
        repo,
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
        since: Date
    },
) {
    const q = [`type:pr+author:${author}`]
    if (author) {
        q.push(`created:>=${since.toISOString().split('T')[0]}`)
    }
    const res = await octokit.search.issuesAndPullRequests({
        ...parseGithubUrl(githubUrl),
        q: q.join('+'),
        per_page: 40,
    })
    return { count: res.data.total_count, ...res.data }
}
