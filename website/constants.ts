export const GITHUB_TOKEN = process.env.GITHUB_TOKEN
export const MAX_WEEKLY_PR_COUNT = 40
export const APP_NAME = 'edit-this-page'
export const APP_ID = process.env.APP_ID
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const APP_URL = 'https://edit-this-page.now.sh'

export const PR_BODY = `
This pull request has been automatically created with ${APP_URL}
`

export const API_URL =
    process.env.NODE_ENV === 'test'
        ? 'http://localhost:3000/api/submit'
        : undefined
