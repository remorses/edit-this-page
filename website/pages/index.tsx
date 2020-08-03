/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import { Link, Button, useColorMode } from '@chakra-ui/core'
import { Wrapper } from 'dokz/dist'
import { EditThisPageButton } from 'edit-this-page/src'
import { API_URL } from '../constants'

jsx

export default function Page(props) {
    const { colorMode } = useColorMode()
    return (
        <Wrapper>
            {/* <EditThisPageButton /> */}
            <EditThisPageButton dark={true} apiUrl={API_URL} unstyled>
                <Button>Edit</Button>
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
