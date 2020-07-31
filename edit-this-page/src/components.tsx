// @jsx jsx
import Modal from 'react-overlays/Modal'

import React, { useState } from 'react'
import { jsx, css } from '@emotion/core'

// we use some pseudo random coords so nested modals
// don't sit right on top of each other.

export function EditOverly() {
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
                    width: 400px;
                    z-index: 1040;
                    top: 50%;
                    left: 50%;
                    border: 1px solid #e5e5e5;
                    background-color: white;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                    padding: 20px;
                `}
                show={show}
                onHide={() => setShow(false)}
                renderBackdrop={renderBackdrop}
                aria-labelledby='modal-label'
            >
                <div>
                    <h4 id='modal-label'>Text in a modal</h4>
                    <p>
                        Duis mollis, est non commodo luctus, nisi erat porttitor
                        ligula.
                    </p>
                    {/* <EditOverly /> */}
                </div>
            </Modal>
        </div>
    )
}
