/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import { Wrapper } from 'dokz/dist'
import { EditThisPageButton } from 'edit-this-page/src'

jsx

export default function Page(props) {
    return (
        <Wrapper>
            <EditThisPageButton />
            <div
                css={css`
                    width: 100px;
                    height: 100px;
                    background: red;
                `}
            />
        </Wrapper>
    )
}

ciao xxx

