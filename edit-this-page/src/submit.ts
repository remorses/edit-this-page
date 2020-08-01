import { API_URL } from './constants'

export type SubmitArgs = {
    githubUrl: string
    filePath: string
    baseBranch: string
    changedCode: string
}

export const submitCode = async (data: SubmitArgs) => {
    // return alert(JSON.stringify(data, null, 4))
    const r = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!r.ok) {
        throw new Error(r.statusText)
    }
    return await r.json()
}
