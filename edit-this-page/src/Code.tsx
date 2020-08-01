import { Box } from 'layout-kit-react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import prismTheme from 'prism-react-renderer/themes/nightOwlLight'
import React, { useCallback } from 'react'
import Editor from 'react-simple-code-editor'



export const Code = ({
    value = '',
    onChange = (x) => x,
    style = {},
    ...rest
}) => {
    // console.log({rest, live})
    const language = 'tsx'

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
