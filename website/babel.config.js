const { babelPlugin, TAG_NAME } = require('edit-this-page/dist/babel-plugin')
const { CodeGenerator } = require('@babel/generator')
const inspect = (babel) => {
    return {
        visitor: {
            Program: {
                enter(path, state) {
                    const code = state.file.code
                    const filePath = state.file.opts.filename || ''
                    if (code.search(TAG_NAME) !== -1) {
                        const g = new CodeGenerator(path.node).generate()
                        console.log(g.code)
                    }
                },
            },
        },
    }
}

module.exports = {
    presets: ['next/babel'],
    plugins: [babelPlugin, inspect],
}
