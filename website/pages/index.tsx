import { Wrapper } from 'dokz/dist'
import React, { Fragment } from 'react'
import Head from 'next/head'
import { EditThisPageButton } from 'edit-this-page/src'

export default function Page(props) {
    return (
        <Wrapper>
            <EditThisPageButton />
        </Wrapper>
    )
}
