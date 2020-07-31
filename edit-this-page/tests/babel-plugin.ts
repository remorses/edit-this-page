import { transform } from '@babel/core'
import {
    plugin,
    TAG_NAMES
} from '../src/babel-plugin'

const OPTIONS = {
    plugins: ['@babel/plugin-syntax-jsx', [plugin, {}]],
}

describe('babel plugin', () => {
    afterEach(() => {})

    describe('source code', () => {
        it('should extract source code', () => {
            const res = transform(
                `const x = <${TAG_NAMES[0]} id="Hello World!"/>`,
                OPTIONS,
            )
            console.log(res.code)
        })
    })
})
