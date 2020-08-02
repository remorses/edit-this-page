/** @jsx jsx */

import { css, jsx } from '@emotion/core'
import { Link, Button } from '@chakra-ui/core'
import { Wrapper } from 'dokz/dist'
import { EditThisPageButton } from 'edit-this-page/src'

jsx

export default function Page(props) {
    return (
        <Wrapper>
            {/* <EditThisPageButton /> */}
            <EditThisPageButton
                apiUrl='http://localhost:3000/api/submit'
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
