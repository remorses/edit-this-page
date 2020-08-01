import {
    createForkAndBranch,
    parseGithubUrl,
    createPr,
    getMyUsername,
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
    it('pull request', async () => {
        const newBranchName = uuid.v4()
        const forkRes = await createForkAndBranch(octokit, {
            githubUrl,
            newBranchName,
        })
        // console.log(forkRes.branchRef)
        try {
            let commitRes = await commitFiles(octokit, {
                githubUrl,
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
                githubUrl,
                branch: newBranchName,
                // prCreator: await getMyLogin(octokit),
                title: `Still Testing pr creation`,
                baseBranch: 'master',
            })
            console.log(prRes)
        } finally {
            // depleting the branch also deletes the pr
            await octokit.git.deleteRef({
                ...parseGithubUrl(githubUrl),
                ref: `heads/${newBranchName}`,
            })
        }
    })
})
