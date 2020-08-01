import { createForkAndBranch } from '../pages/api/submit'
import assert from 'assert'
import { Octokit } from '@octokit/rest'
import { GITHUB_TOKEN } from '../constants'
import * as uuid from 'uuid'

const githubUrl = `https://github.com/remorses/edit-this-page`

describe('github', () => {
    const octokit = new Octokit({ auth: GITHUB_TOKEN })
    it('createForkAndBranch', async () => {
        const forkRes = await createForkAndBranch(octokit, {
            githubUrl,
            newBranchName: uuid.v4(),
        })
        console.log(forkRes)
    })
})
