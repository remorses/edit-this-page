import { transformFromAstSync, parse } from '@babel/core'
import { Visitor } from '@babel/traverse'
import minimatch from 'minimatch'
import path from 'path'
import * as BabelTypes from '@babel/types'
import { getGitConfigSync, getRepoRoot } from 'get-git-config'

export type PluginOptions = {
    values: { value: string; newValue: string; literal?: boolean }[]
}

const debug = console.log

export type InjectedParams = {
    editThisPageFilePath?: string
    editThisPageGitRemote?: string
    editThisPageSourceCode?: string
}

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
                    const root = getRepoRoot()
                    if (!root) {
                        throw new Error(
                            `cannot find the .git directory, edit-this-page plugin only works with git repos`,
                        )
                    }
                    const relativePathToRepo = path.relative(root, filePath)
                    const relativePathToBabel = path.relative(
                        process.cwd(),
                        filePath,
                    )
                    // console.log({ relativePath })
                    if (!minimatch(relativePathToBabel, editableFiles)) {
                        // debug('skipping')
                        return
                    }

                    const remote = getGitConfigSync('.')?.remote
                    const gitRemote =
                        remote?.origin?.url ||
                        remote?.[Object.keys(remote)[0]]?.url ||
                        ''
                    // TODO add additional attributes to the button props taken from a config file, like target branch ...
                    const toInject: InjectedParams = {
                        editThisPageFilePath: relativePathToRepo,
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
                    // console.log(codeToInsert)
                    p.unshiftContainer('body', parsed.program.body[0])
                },
            },
        },
    }
}
