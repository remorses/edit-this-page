import {
    createForkAndBranch,
    parseGithubUrl,
    createPr,
    getMyLogin,
    commitFiles,
} from '../pages/api/submit'
import assert from 'assert'
import { Octokit } from '@octokit/rest'
import { GITHUB_TOKEN } from '../constants'
import * as uuid from 'uuid'

const githubUrl = `https://github.com/remorses/testing-github-api`

describe('github', () => {
    const octokit = new Octokit({ auth: GITHUB_TOKEN })
    it('createForkAndBranch', async () => {
        const newBranchName = uuid.v4()
        const forkRes = await createForkAndBranch(octokit, {
            githubUrl,
            newBranchName,
        })
        console.log(forkRes)
        await octokit.git.deleteRef({
            ...parseGithubUrl(githubUrl),
            ref: `heads/${newBranchName}`,
        })
    })
    it('commitFiles', async () => {
        let commitRes = await commitFiles(octokit, {
            githubUrl,
            message: 'test',
            fromBranch: 'master',
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
    it('pull request', async () => {
        const newBranchName = uuid.v4()
        const forkRes = await createForkAndBranch(octokit, {
            githubUrl,
            newBranchName,
        })
        console.log(forkRes.branchRef)
        try {
            let commitRes = await commitFiles(octokit, {
                githubUrl,
                message: 'test',
                fromBranch: 'master',
                tree: [
                    { path: 'example.js', content: '// pushed for testing' },
                ],
            })
            console.log(commitRes)
            const prRes = await createPr(octokit, {
                githubUrl,
                branchRef: newBranchName,
                // prCreator: await getMyLogin(octokit),
                title: `Testing pr creation`,
                baseBranch: 'master',
            })
            console.log(prRes)
        } finally {
            // await octokit.git.deleteRef({
            //     ...parseGithubUrl(githubUrl),
            //     ref: `heads/${newBranchName}`,
            // })
        }
    })
})
