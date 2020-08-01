import { transformFromAstSync, parse } from '@babel/core'
import { Visitor } from '@babel/traverse'
import minimatch from 'minimatch'
import path from 'path'
import * as BabelTypes from '@babel/types'
import { getGitConfigSync } from 'get-git-config'

export const SOURCE_CODE_VARIABLE = 'SOURCE_CODE_FOR_EDIT_BUTTON'
export const TAG_NAME = 'EditThisPageButton'

const ALREADY_CHECKED = '_ALREADY_CHECKED_'

export type PluginOptions = {
    values: { value: string; newValue: string; literal?: boolean }[]
}

const debug = console.log

function getBasePath() {
    return process.cwd()
}

export type InjectedParams = {
    editThisPageFilePath?: string
    editThisPageGitRemote?: string
    editThisPageSourceCode?: string
}

export const PREFIX = 'editThisPage'

export const babelPlugin = (
    babel: { types: typeof BabelTypes; template; parse; transformFromAstSync },
    { editableFiles = '' },
): { visitor: Visitor<any> } => {
    const { types: t, template } = babel

    return {
        visitor: {
            Program: {
                enter(p, state) {
                    const sourceCode: string = state.file.code
                    const filePath = state.file.opts.filename || ''
                    const relativePath = path.relative(getBasePath(), filePath)
                    if (!minimatch(relativePath, editableFiles)) {
                        debug('skipping')
                        return
                    }

                    const remote = getGitConfigSync('.')?.remote
                    const gitRemote =
                        remote?.origin?.url ||
                        remote?.[Object.keys(remote)[0]]?.url ||
                        ''
                    // TODO add additional attributes to the button props taken from a config file, like target branch ...
                    const toInject: InjectedParams = {
                        editThisPageFilePath: filePath,
                        editThisPageGitRemote: gitRemote,
                        editThisPageSourceCode: sourceCode,
                    }

                    const codeToInsert = `
                    if (typeof window !== 'undefined' ) {
                        const toInject = ${JSON.stringify(toInject)};
                        for (let k in toInject) {
                            window[k] = toInject[k];
                        }
                    }\n`
                    // this.file.code = codeToInsert + '\n' + this.file.code
                    debug('adding top level source code variable')
                    const parsed = babel.parse(codeToInsert, {
                        filename: '',
                    })
                    console.log(codeToInsert)
                    p.unshiftContainer('body', parsed.program.body[0])
                    // TODO running this plugin invalidates the css prop
                    // const res = babel.transformFromAstSync(
                    //     path.node,
                    //     this.file.code,
                    //     {
                    //         filename: state.file.opts.filename,
                    //         ast: true,
                    //         plugins: [
                    //             // '@babel/plugin-syntax-jsx',
                    //             [
                    //                 addJsxAttrs,
                    //                 {
                    //                     elements: [TAG_NAME],
                    //                     attributes,
                    //                 },
                    //             ],
                    //         ],
                    //     },
                    // )
                    // // console.log(res.ast)
                    // path.node.body = res.ast.program.body
                },
            },

            // JSXElement(path, stats) {
            //     const tagNames = TAG_NAMES
            //     const name: any = path.node.openingElement.name
            //     if (!tagNames.includes(name?.name)) {
            //         return
            //     }

            //     path.node.openingElement.attributes.forEach(
            //         (attr: JSXAttribute) => {
            //             console.log(attr.name.name)
            //             console.log(attr.value)
            //             attr
            //         },
            //     )
            // },
        },
    }
}
