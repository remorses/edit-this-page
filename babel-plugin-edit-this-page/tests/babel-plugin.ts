import { transform } from '@babel/core'
import { babelPlugin, getCurrentBranch } from '../src/babel-plugin'
import { assert } from 'console'

const OPTIONS = {
    plugins: [[babelPlugin, {}]],
}

describe('babel plugin', () => {
    afterEach(() => {})

    describe('source code', () => {
        it('should extract source code', () => {
            const res = transform(`const x = <div id="Hello World!"/>`, OPTIONS)
            console.log(res.code)
        })
    })
    describe('branch', () => {
        it('works', () => {
            const res = getCurrentBranch()
            assert(res)
            assert(!res.includes('\n'))
        })
    })
})
