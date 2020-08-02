const { plugin } = require('babel-plugin-edit-this-page')



module.exports = {
    presets: ['next/babel'],
    plugins: [[plugin, { editableFiles: 'pages/**' }]],
}



// const { CodeGenerator } = require('@babel/generator')
// const inspect = (babel) => {
//     return {
//         visitor: {
//             Program: {
//                 enter(path, state) {
//                     const code = state.file.code
//                     const filePath = state.file.opts.filename || ''
//                     if (code.search(TAG_NAME) !== -1) {
//                         const g = new CodeGenerator(path.node).generate()
//                         console.log(g.code)
//                     }
//                 },
//             },
//         },
//     }
// }
