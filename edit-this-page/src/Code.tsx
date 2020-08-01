import { Box, useClipboard, useColorMode } from '@chakra-ui/core'

import React, { useEffect, Component, Fragment, useCallback } from 'react'
import Editor from 'react-simple-code-editor'
import Highlight, { Prism, defaultProps } from 'prism-react-renderer'

import { FiCheck, FiCopy } from 'react-icons/fi'
import prismTheme from 'prism-react-renderer/themes/nightOwlLight'

class CodeEditor extends Component<any, any> {
    static getDerivedStateFromProps(props, state) {
        if (props.code !== state.prevCodeProp) {
            return { code: props.code, prevCodeProp: props.code }
        }

        return null
    }

    state = {
        code: '',
    }

    updateContent = (code) => {
        this.setState({ code }, () => {
            if (this.props.onChange) {
                this.props.onChange(this.state.code)
            }
        })
    }

    highlightCode = (code) => (
        <Highlight
            Prism={Prism}
            code={code}
            theme={prismTheme}
            language={this.props.language}
        >
            {({ tokens, getLineProps, getTokenProps }) => (
                <Fragment>
                    {tokens.map((line, i) => (
                        // eslint-disable-next-line react/jsx-key
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                // eslint-disable-next-line react/jsx-key
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </Fragment>
            )}
        </Highlight>
    )

    render() {
        // eslint-disable-next-line no-unused-vars
        const {
            style,
            code: _code,
            onChange,
            language,
            theme,
            ...rest
        } = this.props
        const { code } = this.state

        const baseTheme =
            theme && typeof theme.plain === 'object' ? theme.plain : {}

        return (
            <Editor
                value={code}
                padding={10}
                highlight={this.highlightCode}
                onValueChange={this.updateContent}
                style={{
                    whiteSpace: 'pre',
                    fontFamily: 'monospace',
                    ...baseTheme,
                    ...style,
                }}
                {...rest}
            />
        )
    }
}

export const Code = ({
    value = '',
    onChange = (x) => x,
    style = {},
    ...rest
}) => {
    // console.log({rest, live})
    const language = 'tsx'
    const { onCopy, hasCopied } = useClipboard(value)

    useOldPlaygroundWarning(rest)

    const highlightCode = useCallback(
        (code) => {
            return (
                <Highlight
                    {...defaultProps}
                    theme={prismTheme}
                    code={code}
                    language={language}
                >
                    {({
                        className,
                        style,
                        tokens,
                        getLineProps,
                        getTokenProps,
                    }) => (
                        <Box
                            // p='20px'
                            // pt='30px'
                            borderRadius='8px'
                            as='pre'
                            fontFamily={'monospace'}
                            // fontSize='0.9em'
                            // style={{ ...style }}
                            overflowX='auto'
                            className={className}
                            // style={style}
                        >
                            {tokens.map((line, i) => (
                                <div
                                    key={i}
                                    {...getLineProps({ line, key: i })}
                                >
                                    {line.map((token, key) => (
                                        <span
                                            key={key}
                                            {...getTokenProps({ token, key })}
                                        />
                                    ))}
                                </div>
                            ))}
                        </Box>
                    )}
                </Highlight>
            )
        },
        [value, onChange],
    )

    return (
        <Editor
            value={value}
            padding={10}
            highlight={highlightCode}
            onValueChange={onChange}
            style={{
                whiteSpace: 'pre',
                fontFamily: 'monospace',
                ...style,
            }}
            {...rest}
        />
    )
}

export const CopyButton = (props) => {
    const { hasCopied } = props
    return (
        <Box
            cursor='pointer'
            m='0'
            style={{
                strokeWidth: '2px',
            }}
            opacity={0.7}
            size='1.1em'
            as={hasCopied ? FiCheck : FiCopy}
            {...props}
        />
    )
}

function useOldPlaygroundWarning(rest) {
    useEffect(() => {
        if (!!rest.live) {
            console.warn(
                'To use the playground now you must import the explicitly playground component!\nread more at http://localhost:3000/docs/general/preview-react-components',
            )
        }
    }, [])
}
