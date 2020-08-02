export const API_URL = isTesting()
    ? `http://localhost:3000/api/submit`
    : 'https://edit-this-page.now.sh/api/submit'

    
export const HANDLE_EDITS_GUIDE_URL = `http://edit-this-page.now.sh/docs`
export const GITHUB_REPO = `https://github.com/remorses/edit-this-page`

function isTesting() {
    if (typeof process !== 'undefined' && !process?.env?.TESTING) {
        return true
    }
    return false
}
