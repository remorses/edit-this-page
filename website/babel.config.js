const { babelPlugin } = require('edit-this-page')

module.exports = {
    presets: ['next/babel'],
    plugins: [[babelPlugin, {}]],
}
