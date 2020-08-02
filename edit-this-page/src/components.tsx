/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core'
import { Box, Stack } from 'layout-kit-react'
import pick from 'lodash/pick'
import {
    Fragment,
    ReactNode,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react'
import {
    ThemeProvider,
    IconButton,
    Input,
    Button,
    Link,
    LightMode,
} from '@chakra-ui/core'
import Modal from 'react-overlays/Modal'
import { InjectedParams } from 'babel-plugin-edit-this-page'
import { Code } from './Code'
import { submitCode } from './submit'
import { API_URL, GITHUB_REPO, HANDLE_EDITS_GUIDE_URL } from './constants'

jsx

// we use some pseudo random coords so nested modals
// don't sit right on top of each other.

export type EditThisPageButtonProps = {
    unstyled?: boolean
    children?: ReactNode
}

const X_PADDING = '40px'

export function EditThisPageButton({
    unstyled,
    children = 'Edit This Page',
    ...rest
}: EditThisPageButtonProps) {
    const [params, setParams] = useState<InjectedParams>({})
    useEffect(() => {
        const params = getParams()
        if (!params) {
            setSubmitState((x) => ({
                ...x,
                error: new Error(
                    `The repository is not configured to handle edits\nThe developer needs to follow the guide at\n${HANDLE_EDITS_GUIDE_URL}`,
                ),
            }))
            return
        }
        setParams(params)
    }, [])
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')
    const [code, setCode] = useState(params?.editThisPageSourceCode || '')
    const [submitState, setSubmitState] = useState({
        loading: false,
        error: null,
    })
    const [prUrl, setPrUrl] = useState('')
    useEffect(() => {
        setCode(params?.editThisPageSourceCode)
        setTitle(`Changes to ${params?.editThisPageFilePath}`)
    }, [params])

    const onSubmit = useCallback(() => {
        setSubmitState((x) => ({ ...x, loading: true }))
        return submitCode({
            githubUrl: params.editThisPageGitRemote,
            filePath: params.editThisPageFilePath,
            changedCode: code,
            title,
            baseBranch: params.editThisPageBranch,
        })
            .then((r) => {
                setSubmitState((x) => ({ ...x, loading: false }))
                setPrUrl(r?.url || '')
            })
            .catch((error) =>
                setSubmitState((x) => ({ ...x, error, loading: false })),
            )
    }, [code, params, title])

    const filePathParts = useMemo(() => {
        const parts = (params.editThisPageFilePath || '').split('/')
        return parts
    }, [params])

    return (
        <ThemeProvider>
            <LightMode>
                {!unstyled && (
                    <Button onClick={() => setShow(true)} {...rest}>
                        {children}
                    </Button>
                )}
                {unstyled && (
                    <Box onClick={() => setShow(true)} {...rest}>
                        {children}
                    </Box>
                )}
                <Modal
                    css={css`
                        position: fixed;
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        top: 40px;
                        left: 20px;
                        right: 20px;
                        bottom: 20px;
                        /* height: 100vh; */
                        /* padding-bottom: 20px; */
                        /* bottom: 20px; */
                        z-index: 1040;
                        border-radius: 10px;
                        /* overflow: visible; */
                        border: none;
                        outline: none;
                        -webkit-box-shadow: none;
                        -moz-box-shadow: none;
                        box-shadow: none;

                        /* overflow: hidden; */
                    `}
                    show={show}
                    onHide={() => setShow(false)}
                    renderBackdrop={Backdrop}
                    aria-labelledby='modal-label'
                >
                    <Stack
                        color='gray.800'
                        maxWidth='1000px'
                        overflowY='auto'
                        // minWidth='100%
                        width={['100%', null, null, '80%']}
                        alignSelf='center'
                        bg='white'
                        borderRadius='10px'
                        align='stretch'
                        // p='20px'
                        spacing='20px'
                        position='relative'
                    >
                        {!prUrl && !submitState.error && (
                            <Fragment>
                                <Stack flex='0 0' align='stretch'>
                                    <Stack
                                        align='center'
                                        direction='row'
                                        py='10px'
                                        px={X_PADDING}
                                    >
                                        <Stack
                                            direction='row'
                                            fontSize='1.2em'
                                            fontWeight='500'
                                            spacing='8px'
                                        >
                                            {filePathParts
                                                .slice(0, -1)
                                                .map((s) => (
                                                    <Fragment>
                                                        <Box opacity={0.5}>
                                                            {s}
                                                        </Box>
                                                        <Box opacity={0.5}>
                                                            /
                                                        </Box>
                                                    </Fragment>
                                                ))}
                                            <Box>
                                                {
                                                    filePathParts[
                                                        filePathParts.length - 1
                                                    ]
                                                }
                                            </Box>
                                        </Stack>
                                        <Box flex='1' />
                                        <IconButton
                                            aria-label='close'
                                            icon='close'
                                            onClick={() => setShow(false)}
                                        />
                                    </Stack>

                                    <Code
                                        zIndex={0}
                                        value={code}
                                        onChange={setCode}
                                    />
                                </Stack>

                                <Stack flex='0 0' spacing='40px' px={X_PADDING}>
                                    <Stack
                                        width='100%'
                                        spacing='10px'
                                        align='stretch'
                                    >
                                        <Box fontWeight='500'>Title</Box>
                                        <Input
                                            shadow='sm'
                                            minWidth='200px'
                                            maxWidth='600px'
                                            w='auto'
                                            value={title}
                                            onChange={(e) => setTitle(e.value)}
                                        />
                                    </Stack>
                                    {/* <Box flex='1' /> */}
                                    <Box>
                                        A bot will open a pull request on github
                                        with the changes made <br />
                                        You can{' '}
                                        <Box
                                            cursor='pointer'
                                            color='blue.500'
                                            d='inline'
                                            mx='0.2em'
                                        >
                                            login with your github profile
                                        </Box>
                                        if you want to open the pr with your
                                        account
                                    </Box>
                                    <Button
                                        fontWeight='600'
                                        isLoading={submitState.loading}
                                        leftIcon='edit'
                                        // shadow='sm'
                                        // px='10px'
                                        // py='8px'
                                        // bg='#eee'
                                        display='inline-block'
                                        // borderRadius='6px'
                                        onClick={onSubmit}
                                    >
                                        Open Pull Request
                                    </Button>
                                    <Box h='30px' />
                                </Stack>
                            </Fragment>
                        )}
                        {prUrl && (
                            <Stack
                                align='center'
                                justify='center'
                                minHeight='400px'
                                fontWeight='500'
                                spacing='40px'
                                flex='0 0'
                            >
                                <Box fontSize='2em' fontWeight='600'>
                                    Changes submitted!
                                </Box>
                                <Box>
                                    You can find your pull request{' '}
                                    <MyLink href={prUrl}>here</MyLink>
                                </Box>
                                <Box>
                                    If you want to integrate Edit This Page on
                                    your own website check out the{' '}
                                    <MyLink href={GITHUB_REPO}>
                                        github repo
                                    </MyLink>
                                </Box>
                            </Stack>
                        )}
                        {submitState.error && (
                            <Stack
                                align='center'
                                justify='center'
                                minHeight='400px'
                                fontWeight='500'
                                spacing='40px'
                                flex='0 0'
                            >
                                <Box
                                    color='red.500'
                                    fontSize='2em'
                                    fontWeight='600'
                                >
                                    Got an error
                                </Box>
                                <Box lineHeight='2em' textAlign='center' as='pre' maxW='500px'>
                                    {submitState.error?.message}
                                </Box>
                                <Button onClick={() => setShow(false)}>
                                    Close
                                </Button>
                            </Stack>
                        )}
                        {/* <EditOverly /> */}
                    </Stack>
                </Modal>
            </LightMode>
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
        return
    } else {
        const keys: Array<keyof InjectedParams> = [
            'editThisPageFilePath',
            'editThisPageGitRemote',
            'editThisPageBranch',
            'editThisPageSourceCode',
        ]
        const picked = pick(window as {}, keys)
        if (Object.keys(picked).length === 0) {
            return
        }
        return picked
    }
}

export const MyLink = (props) => {
    return (
        <Link color='blue.500' as='a' d='inline' target='_blank' {...props} />
    )
}
