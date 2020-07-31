import { transformFromAstSync, parse } from '@babel/core'
import { Visitor } from '@babel/traverse'
import * as BabelTypes from '@babel/types'
import addJsxAttrs from '@svgr/babel-plugin-add-jsx-attribute'
import { getGitConfigSync } from 'get-git-config'

export const SOURCE_CODE_VARIABLE = 'SOURCE_CODE_FOR_EDIT_BUTTON'
export const TAG_NAME = 'EditThisPageButton'

const ALREADY_CHECKED = '_ALREADY_CHECKED_'

export type PluginOptions = {
    values: { value: string; newValue: string; literal?: boolean }[]
}

const debug = console.log

export const babelPlugin = (
    babel: { types: typeof BabelTypes; template; parse; transformFromAstSync },
    { values = [] }: PluginOptions,
): { visitor: Visitor<any> } => {
    const { types: t, template } = babel

    return {
        visitor: {
            Program: {
                enter(path, state) {
                    const code: string = state.file.code
                    if (
                        path.node[ALREADY_CHECKED] ||
                        code.search(TAG_NAME) === -1
                    ) {
                        debug('skipping')
                        path.node[ALREADY_CHECKED] = true
                        return
                    }
                    path.node[ALREADY_CHECKED] = true
                    const codeToInsert = `var ${SOURCE_CODE_VARIABLE} = ${JSON.stringify(
                        code,
                    )};\n`
                    // this.file.code = codeToInsert + '\n' + this.file.code
                    debug('adding top level source code variable')
                    path.unshiftContainer(
                        'body',
                        parse(codeToInsert, {
                            filename: '',
                        }).program.body[0],
                    )

                    const filePath = state.file.opts.filename || ''
                    const remote = getGitConfigSync('.')?.remote
                    const gitRemote =
                        remote?.origin?.url ||
                        remote?.[Object.keys(remote)[0]]?.url ||
                        ''
                    // TODO add additional attributes to the button props taken from a config file, like target branch ...
                    const attributes = [
                        {
                            name: 'filePath',
                            value: filePath,
                            spread: false,
                            position: 'end',
                        },
                        {
                            name: 'gitRemote',
                            value: gitRemote,
                            spread: false,
                            position: 'end',
                        },
                        // TODO the source code should be imported dynamically to not increase bundle size, use an import() that returns a promise
                        {
                            name: 'sourceCode',
                            value: SOURCE_CODE_VARIABLE,
                            spread: false,
                            literal: true,
                            position: 'end',
                        },
                    ]
                    debug('running babel-plugin-add-jsx-attribute')
                    const res = babel.transformFromAstSync(
                        path.node,
                        this.file.code,
                        {
                            filename: state.file.opts.filename,
                            ast: true,
                            plugins: [
                                // '@babel/plugin-syntax-jsx',
                                [
                                    addJsxAttrs,
                                    {
                                        elements: [TAG_NAME],
                                        attributes,
                                    },
                                ],
                            ],
                        },
                    )
                    // console.log(res.ast)
                    path.node.body = res.ast.program.body
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
