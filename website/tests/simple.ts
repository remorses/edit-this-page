import {
    parseGithubUrl,
    createPr,
    getMyUsername,
    commitFiles,
    getPrsCount,
    existsRepo,
    createBranch,
} from '../pages/api/submit'
import assert from 'assert'
import { Octokit } from '@octokit/rest'
import { GITHUB_TOKEN } from '../constants'
import * as uuid from 'uuid'
import dayjs from 'dayjs'

const githubUrl = `https://github.com/remorses/testing-github-api`

const botOwnedGithubUrl = `https://github.com/edit-this-page/testing-github-api`

describe('bot github operations', () => {
    const octokit = new Octokit({ auth: GITHUB_TOKEN })
    // it('fork createForkAndBranch', async () => {
    //     const newBranchName = uuid.v4()
    //     const forkRes = await createForkAndBranch(octokit, {
    //         githubUrl,
    //         newBranchName,
    //     })
    //     console.log(forkRes)
    //     await octokit.git.deleteRef({
    //         ...parseGithubUrl(forkRes.html_url),
    //         ref: `heads/${newBranchName}`,
    //     })
    // })
    it('existsRepo', async () => {
        var exists = await existsRepo(octokit, { githubUrl })
        assert(exists)
        var exists = await existsRepo(octokit, { githubUrl: 'xxxxxxxxxx' })
        assert(!exists)
    })
    it('commitFiles', async () => {
        let commitRes = await commitFiles(octokit, {
            githubUrl: botOwnedGithubUrl,
            message: 'another test',
            branch: 'master',
            tree: [
                {
                    path: 'example.js',
                    mode: '100644',
                    content: '// pushed for testing',
                },
            ],
        })
        console.log(commitRes)
    })
    it('getPrsCount', async () => {
        const { count } = await getPrsCount(octokit, {
            githubUrl,
            since: dayjs().subtract(1, 'week').toDate(),
            author: await getMyUsername(octokit),
        })
        console.log(count)
    })
    it('getMyUsername', async () => {
        var x = await getMyUsername(octokit)
        assert(x)
        var x = await getMyUsername(octokit)
        assert(x)
        console.log(x)
    })
    it('pull request createPr', async () => {
        const newBranchName = uuid.v4()
        await createBranch(octokit, {
            githubUrl: botOwnedGithubUrl,
            fromBranch: 'master',
            name: newBranchName,
        })
        // console.log(forkRes.branchRef)
        try {
            let commitRes = await commitFiles(octokit, {
                githubUrl: botOwnedGithubUrl,
                message: 'should be on pr',
                branch: newBranchName,
                tree: [
                    {
                        path: 'another.js',
                        mode: '100644',
                        content: '// pushed for testing ' + uuid.v4(),
                    },
                ],
            })
            const prRes = await createPr(octokit, {
                githubUrl: botOwnedGithubUrl,
                branch: newBranchName,
                prCreator: await getMyUsername(octokit),
                title: `Still Testing pr creation`,
                baseBranch: 'master',
            })
            console.log(prRes.prUrl)
            // console.log(prRes)
        } finally {
            // depleting the branch also deletes the pr
            await octokit.git.deleteRef({
                ...parseGithubUrl(botOwnedGithubUrl),
                ref: `heads/${newBranchName}`,
            })
        }
    })
})
