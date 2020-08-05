import { Box, Image, Stack } from '@chakra-ui/core'
import { FiCode, FiFile, FiFileText } from 'react-icons/fi'
import {
    Button,
    Footer,
    // Hero,
    Link,
    Heading,
    HowItWorks,
    LandingProvider,
    NavBar,
    PageContainer,
    Section,
    Subheading,
    Hero,
    TestimonialsTweets,
    Bullet,
    FeaturesList,
} from 'landing-blocks/src'
import { GradientCurtains } from 'landing-blocks/src/decorations'
import React from 'react'
import NextLink from 'next/link'

import editorImage from '../public/editor.jpeg'
import siteImage from '../public/site.jpeg'
import prImage from '../public/pr.jpeg'

const Page = () => (
    <LandingProvider position='relative' bg='white' primary='#3884FF'>
        <Box
            bg='gray.100'
            left='50%'
            top='-200px'
            transform='translateZ(-1000px) translateX(-50%) skewY(-20deg)'
            width='6000px'
            height='2000px'
            transformOrigin='0px center'
            position='absolute'
            // zIndex={1}
        />
        <NavBar
            position='relative'
            logo={<Box width='30px' />}
            navs={[
                <a href='https://github.com/remorses/edit-this-page'>Github</a>,
                // <a href='/docs'>Demo</a>,
                <a href='/docs'>Docs</a>,
                <a href='/blog'>Blog</a>,
                <CtaButton px='10px' />,
            ]}
        />
        <Hero
            position='relative'
            // cta={<EmailForm />}
            heading='Make your website editable by everyone'
            subheading='Users suggested changes open a pull request on Github'

            // fingerprint='Already using Airtable? Sign in'
        />
        <Box
            position='relative'
            alignSelf='center'
            shadow='xl'
            overflow='hidden'
            borderRadius='6px'
        >
            <video
                autoPlay
                loop
                src={'edit-this-page-video.mp4'}
                width='700px'
            />
        </Box>
        <FeaturesList
            centerText
            // bg='gray.900'
            features={[
                {
                    heading: 'More contributions',
                    subheading: 'You can use your iwn react components',
                },
                {
                    heading: 'Github automatic PR',
                    subheading: 'follows the dircetory file system',
                },
                {
                    heading: 'Babel and React',
                    subheading: 'follows the dircetory file system',
                },
            ]}
        />

        <HowItWorks
            heading='Let your users write and edit your content'
            spacing='40'
            subheading='Users can open a pull request without leaving the site, pressing just one button'
            steps={[
                {
                    heading: 'Add the babel-plugin',
                    subheading:
                        'You can also include your own react components thanks to MDX',
                    image: (
                        <Image borderRadius='md' shadow='xl' src={siteImage} />
                    ),
                },
                {
                    heading: 'Authorize the Github App',
                    subheading:
                        'The website is based on Nextjs so you get all its niceties: live reloading, easy configuration and easy deploy',
                    image: (
                        <Image
                            borderRadius='md'
                            shadow='xl'
                            src={editorImage}
                        />
                    ),
                },
                {
                    heading: 'Let your users suggest edits',
                    subheading:
                        'Dokz export a completely static website you can deploy everywhere',
                    image: (
                        <Image borderRadius='md' shadow='xl' src={prImage} />
                    ),
                },
            ]}
        />
        {/* <TestimonialsTweets
                heading="Don't you trust me?"
                subheading='Trust them'
                tweets={[
                    '933354946111705097',
                    '1246480107604078592',
                    'https://twitter.com/naval/status/806034795658522624?s=21',
                    // '933354946111705097',
                    // '933354946111705097',
                ]}
            /> */}
        {/* <Section bg='rgba(186, 212, 255, .06)'>
                <TestimonialsTweets
                    heading='What people say about Dokz'
                    subheading='Tweet something mentioning @dokzsite to be listed here!'
                    tweets={[
                        'https://twitter.com/__morse/status/1266420689885630464?s=21',
                        'https://twitter.com/mrahmadawais/status/1266643258567950336?s=21',
                        'https://twitter.com/dokzsite/status/1250566800095444992?s=21',
                    ]}
                />
            </Section> */}
        <Footer
            businessName='Made by @morse__'
            columns={{
                'Where you can find me': [
                    <a href='https://twitter.com/__morse' target='_blank'>
                        Twitter
                    </a>,
                    <a href='https://github.com/remorses/' target='_blank'>
                        Github
                    </a>,
                ],
                Product: [
                    <a href='https://github.com/remorses/edit-this-page'>
                        Github
                    </a>,
                    <a href='/docs'>Docs</a>,
                ],
            }}
        />
    </LandingProvider>
)

const CtaButton = (props) => (
    <a href='/docs'>
        <Button {...props}>Quickstart</Button>
    </a>
)

// const Hero = (props) => {
//     return (
//         <PageContainer
//             floatingElement={
//                 <GradientCurtains
//                     primary='white'
//                     secondary='#48BB79'
//                     position='absolute'
//                     top='-200px'
//                 />
//             }
//             align='center'
//             {...props}
//         >
//             <Stack align='center' spacing='40px'>
//                 {/* <Box maxW='400px' minW='300px' as={LogoFull} /> */}
//                 <Stack align='center' spacing='10px' textAlign='center'>
//                     <Bullet>Dokz analytics coming soon</Bullet>
//                     <Heading fontSize='42px'>Effortless documentation</Heading>
//                     <Subheading lineHeight='2em' opacity={0.7}>
//                         Build awesome documentation websites using Nextjs and
//                         MDX
//                         <br />
//                         Soon with documentation analytics and management
//                         service!
//                     </Subheading>
//                 </Stack>

//                 <a
//                     href='https://beatsbymorse.typeform.com/to/jDgdeAbX'
//                     target='_blank'
//                 >
//                     <Button>Get the early release</Button>
//                 </a>
//                 {/* <CtaButton /> */}
//                 <br />
//                 <br />
//                 <Image
//                     borderRadius='lg'
//                     overflow='hidden'
//                     maxW='900px'
//                     w='100%'
//                     minW='300px'
//                     shadow='xl'
//                     src='/screen.jpg'
//                 />
//             </Stack>
//         </PageContainer>
//     )
// }

export default Page
