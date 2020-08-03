import { Octokit } from '@octokit/rest'
import jsonwebtoken from 'jsonwebtoken'
import { parseGithubUrl } from './pages/api/submit'
import { APP_ID, PRIVATE_KEY } from './constants'
import memoizee from 'memoizee'
const { createAppAuth } = require('@octokit/auth-app')

export const getAppOctokit = memoizee(
    () =>
        new Octokit({
            authStrategy: createAppAuth,
            auth: {
                id: APP_ID,
                privateKey: PRIVATE_KEY,
            },
        }),
)

export async function authenticateApp({ githubUrl }): Promise<Octokit> {
    const appOctokit = getAppOctokit()
    const installationRes = await appOctokit.apps.getRepoInstallation({
        ...parseGithubUrl(githubUrl),
    })
    const installationId = installationRes.data.id
    const { token = '' } = (await appOctokit.auth({
        type: 'installation',
        installationId,
    })) as any
    return new Octokit({ auth: token })
}

export async function deleteBranch(octokit: Octokit, { githubUrl, name }) {
    console.log('deleting branch ' + name)
    return await octokit.git.deleteRef({
        ...parseGithubUrl(githubUrl),
        ref: `heads/${name}`,
    })
}

export const getGithubAppName = memoizee(
    async () => {
        const octokit = getAppOctokit()
        // console.log(octokit.auth)
        const res = await octokit.apps.getAuthenticated({})
        // console.log(res.data)
        return res.data.slug
    },
    { promise: true },
)
