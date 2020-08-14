import {AppProps} from 'next/app'
import StylesProvider from '@material-ui/styles/StylesProvider'
import {useEffect} from 'react'
import Head from 'next/head'
import {CssBaseline} from '@material-ui/core'
import {theme} from "../config/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

const App = ({Component, pageProps}: AppProps) => {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles)
        }
    }, [])

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
                    key="viewport"
                />
                <title>I'm a little leek</title>
            </Head>
            <StylesProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <Component {...pageProps} />
                </ThemeProvider>
            </StylesProvider>
        </>
    )
}

export default App
