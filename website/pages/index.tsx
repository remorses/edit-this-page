import { Wrapper } from 'dokz/dist'
import React, { Fragment } from 'react'
import Head from 'next/head'
import { EditOverly } from 'edit-this-page/src'

export default function Page(props) {
    return (
        <Wrapper>
            <EditOverly />
        </Wrapper>
    )
}
