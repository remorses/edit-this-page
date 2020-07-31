const compose = require('compose-function')
const transpile = require('next-transpile-modules')(['edit-this-page'])
const { withDokz } = require('dokz/dist/plugin')

const composed = compose(withDokz, transpile)

module.exports = composed({
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
})
