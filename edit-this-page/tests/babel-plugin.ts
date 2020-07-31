import { transform } from '@babel/core'
import {
    babelPlugin,
    TAG_NAME
} from '../src/babel-plugin'

const OPTIONS = {
    plugins: ['@babel/plugin-syntax-jsx', [babelPlugin, {}]],
}

describe('babel plugin', () => {
    afterEach(() => {})

    describe('source code', () => {
        it('should extract source code', () => {
            const res = transform(
                `const x = <${TAG_NAME} id="Hello World!"/>`,
                OPTIONS,
            )
            console.log(res.code)
        })
    })
})
