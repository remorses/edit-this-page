const { babelPlugin } = require('edit-this-page/dist/babel-plugin')

module.exports = {
    presets: ['next/babel'],
    plugins: [babelPlugin],
}
