import assert from 'assert'
import * as uuid from 'uuid'
import {
    authenticateApp,
    deleteBranch,
    getAppOctokit,
    getGithubAppName,
} from '../github'
import {
    commitFiles,
    createBranch,
    createPr,
    getPrsCount,
} from '../pages/api/submit'

const githubUrl = `https://github.com/remorses/testing-github-api`

describe('github app', () => {
    it('app authenticates', async () => {
        const octokit = await authenticateApp({ githubUrl })
    })
    it('app prs count', async () => {
        const octokit = await authenticateApp({ githubUrl })
        const { count } = await getPrsCount(octokit, {
            githubUrl,
            author: `app/${await getGithubAppName()}`,
        })
        assert(typeof count === 'number')
    })
    it('app gets its name', async () => {
        console.log(await getGithubAppName())
        assert(await getGithubAppName())
    })
    it('app creates pr', async () => {
        const octokit = await authenticateApp({ githubUrl })
        assert(await getPrsCount(octokit, { githubUrl, author: 'remorses' }))
        const branchName = `edit-this-page/${uuid.v4().slice(0, 7)}`
        const branchRes = await createBranch(octokit, {
            githubUrl,
            name: branchName,
        })
        let commitRes = await commitFiles(octokit, {
            githubUrl,
            message: 'should be on pr',
            branch: branchName,
            tree: [
                {
                    path: 'another.js',
                    mode: '100644',
                    content: '// pushed for testing ' + uuid.v4(),
                },
            ],
        })
        await createPr(octokit, {
            githubUrl,
            baseBranch: 'master',
            branch: branchName,
            title: 'Testing the api',
        })
        await deleteBranch(octokit, {
            githubUrl,
            name: branchName,
        })
    })
})
