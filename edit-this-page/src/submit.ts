import { API_URL } from './constants'

export type SubmitArgs = {
    githubUrl: string
    filePath: string
    baseBranch: string
    title: string
    body: string
    changedCode: string
}

export const submitCode = async (data: SubmitArgs & { apiUrl: string }) => {
    // return console.log(JSON.stringify(data, null, 4))
    const r = await fetch(data.apiUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!r.ok) {
        const res = await r.json().catch(() => null)
        throw new Error(res?.error ? res?.error : r.statusText)
    }
    return await r.json()
}
