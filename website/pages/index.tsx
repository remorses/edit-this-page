/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import { Link, Button } from '@chakra-ui/core'
import { Wrapper } from 'dokz/dist'
import { EditThisPageButton } from 'edit-this-page/src'
import { API_URL } from '../constants'

jsx

export default function Page(props) {
    return (
        <Wrapper>
            {/* <EditThisPageButton /> */}
            <EditThisPageButton
                apiUrl={
                    API_URL
                }
                unstyled
            >
                <Button variant='outline'>Edit</Button>
            </EditThisPageButton>
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

// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
// jsx
