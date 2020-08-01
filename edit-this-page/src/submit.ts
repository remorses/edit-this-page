import { API_URL } from './constants'

export type SubmitArgs = {
    githubUrl: string
    filePath: string
    baseBranch: string
    changedCode: string
}

export const submit = async (data: SubmitArgs) => {
    // return alert(JSON.stringify(data, null, 4))
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}
