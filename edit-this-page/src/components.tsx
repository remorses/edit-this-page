/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { Box, Stack } from 'layout-kit-react'
import pick from 'lodash/pick'
import { Fragment, ReactNode, useEffect, useState, useCallback } from 'react'
import { ThemeProvider } from '@chakra-ui/core'
import Modal from 'react-overlays/Modal'
import { InjectedParams } from './babel-plugin'
import { Code } from './Code'
import { submitCode } from './submit'
import { API_URL } from './constants'

jsx

// we use some pseudo random coords so nested modals
// don't sit right on top of each other.

export type EditThisPageButtonProps = { children?: ReactNode }

export function EditThisPageButton(props: EditThisPageButtonProps) {
    const [params, setParams] = useState<InjectedParams>({})
    useEffect(() => {
        setParams(getParams())
    }, [])
    const [show, setShow] = useState(false)
    const [code, setCode] = useState(params?.editThisPageSourceCode || '')
    const [submitState, setSubmitState] = useState({
        loading: false,
        error: null,
    })
    const [prUrl, setPrUrl] = useState('')
    useEffect(() => {
        setCode(params?.editThisPageSourceCode)
    }, [params])

    const onSubmit = useCallback(() => {
        setSubmitState((x) => ({ ...x, loading: true }))
        return submitCode({
            githubUrl: params.editThisPageGitRemote,
            filePath: params.editThisPageFilePath,
            changedCode: code,
            baseBranch: params.editThisPageBranch,
        })
            .then((r) => {
                setSubmitState((x) => ({ ...x, loading: false }))
                setPrUrl(r?.url || '')
            })
            .catch((error) => setSubmitState((x) => ({ ...x, error })))
    }, [code, params])

    return (
        <ThemeProvider>
            {/* <Global styles={emotionNormalize} /> */}

            <Box
                as='button'
                className='btn btn-primary mb-4'
                onClick={() => setShow(true)}
            >
                Open Modal
            </Box>
            <Modal
                css={css`
                    position: fixed;
                    height: auto;
                    top: 40px;
                    left: 20px;
                    right: 20px;
                    bottom: 20px;
                    /* padding-bottom: 20px; */
                    /* bottom: 20px; */
                    z-index: 1040;
                    background-color: white;
                    min-height: 200px;
                    max-height: 100%;
                    border-radius: 6px;
                    overflow-y: auto;
                    /* overflow: hidden; */
                    box-shadow: 0 0px 15px rgba(0, 0, 0, 0.1);
                `}
                show={show}
                onHide={() => setShow(false)}
                renderBackdrop={Backdrop}
                aria-labelledby='modal-label'
            >
                <Stack
                    align='stretch'
                    // p='20px'
                    spacing='40px'
                    position='relative'
                >
                    <Stack
                        // shadow='sm'
                        overflowX='auto'
                        bg='gray.50'
                        borderRadius='8px'
                    >
                        <Code value={code} onChange={setCode} />
                    </Stack>
                    <Stack direction='row'>
                        {/* <Box flex='1' /> */}
                        <Box
                            fontWeight='500'
                            px='10px'
                            py='8px'
                            bg='#eee'
                            display='inline-block'
                            borderRadius='6px'
                            as='button'
                            onClick={onSubmit}
                        >
                            {submitState.loading
                                ? 'Loading'
                                : 'Open Pull Request'}
                        </Box>
                    </Stack>
                    <Box>{prUrl}</Box>
                    {/* <EditOverly /> */}
                </Stack>
            </Modal>
        </ThemeProvider>
    )
}

const Backdrop = (props) => (
    <div
        css={css`
            position: fixed;
            z-index: 1040;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #000;
            opacity: 0.5;
        `}
        {...props}
    />
)

function getParams(): InjectedParams {
    if (typeof window === undefined) {
        return {}
    } else {
        const keys: Array<keyof InjectedParams> = [
            'editThisPageFilePath',
            'editThisPageGitRemote',
            'editThisPageBranch',
            'editThisPageSourceCode',
        ]
        return pick(window as {}, keys)
    }
}
