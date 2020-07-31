import { transformFromAstSync } from '@babel/core'
import { Visitor } from '@babel/traverse'
import * as BabelTypes from '@babel/types'
import addJsxAttrs from '@svgr/babel-plugin-add-jsx-attribute'
import { getGitConfigSync } from 'get-git-config'

export const SOURCE_CODE_VARIABLE = 'SOURCE_CODE_FOR_EDIT_BUTTON'
export const TAG_NAMES = ['EditThisPage']

export type PluginOptions = {
    values: { value: string; newValue: string; literal?: boolean }[]
}

export const plugin = (
    babel: { types: typeof BabelTypes; template; parse },
    { values = [] }: PluginOptions,
): { visitor: Visitor<any> } => {
    const { types: t, template } = babel

    return {
        visitor: {
            Program: {
                enter(path, state) {
                    const code: string = this.file.code
                    const codeToInsert = `var ${SOURCE_CODE_VARIABLE} = ${JSON.stringify(
                        code,
                    )};`
                    // this.file.code = codeToInsert + '\n' + this.file.code
                    path.unshiftContainer(
                        'body',
                        babel.parse(codeToInsert).program.body[0],
                    )

                    // path.node.body.unshift(
                    //     babel.parse(codeToInsert).program.body[0],
                    // )
                    // console.log(code)
                    //path.node
                    //path.parent
                    //state.opts
                },
                exit(path, state) {
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
                        {
                            name: 'sourceCode',
                            value: SOURCE_CODE_VARIABLE,
                            spread: false,
                            literal: true,
                            position: 'end',
                        },
                    ]
                    const res = transformFromAstSync(
                        path.node,
                        this.file.code,
                        {
                            ast: true,
                            plugins: [
                                // '@babel/plugin-syntax-jsx',
                                [
                                    addJsxAttrs,
                                    {
                                        elements: TAG_NAMES,
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
