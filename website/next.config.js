const compose = require('compose-function')
const images = require('next-images')
const transpile = require('next-transpile-modules')([
    'edit-this-page',
    'landing-blocks',
])
const { withDokz } = require('dokz/dist/plugin')

const composed = compose(withDokz, transpile, images)

module.exports = composed({
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
})
