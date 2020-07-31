/** @jsx jsx */
import Modal from 'react-overlays/Modal'

import React, { useState, ReactNode, Fragment } from 'react'
import { jsx, css, Global } from '@emotion/core'

import emotionNormalize from 'emotion-normalize'

jsx

// we use some pseudo random coords so nested modals
// don't sit right on top of each other.

export type HiddenProps = {
    filePath: string
    gitRemote: string
    sourceCode: string
}

export type EditThisPageButtonProps = { children?: ReactNode }

export function EditThisPageButton(props: EditThisPageButtonProps) {
    console.log(props)

    let extendedProps: HiddenProps = props as any

    const [show, setShow] = useState(false)

    const renderBackdrop = (props) => (
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
    return (
        <Fragment>
            {/* <Global styles={emotionNormalize} /> */}
            <div className='modal-example'>
                <button
                    type='button'
                    className='btn btn-primary mb-4'
                    onClick={() => setShow(true)}
                >
                    Open Modal
                </button>
                <p>Click to get the full Modal experience!</p>

                <Modal
                    css={css`
                        position: fixed;
                        height: auto;
                        top: 40px;
                        left: 20px;
                        right: 20px;
                        z-index: 1040;
                        border: 1px solid #e5e5e5;
                        background-color: white;
                        min-height: 200px;
                        /* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); */
                    `}
                    show={show}
                    onHide={() => setShow(false)}
                    renderBackdrop={renderBackdrop}
                    aria-labelledby='modal-label'
                >
                    <div>
                        <h4 id='modal-label'>Text in a modal</h4>
                        <pre>{extendedProps.sourceCode}</pre>
                        {/* <EditOverly /> */}
                    </div>
                </Modal>
            </div>
        </Fragment>
    )
}
