import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document'
import { ServerStyleSheets } from '@material-ui/styles'

export default class Leek extends Document {
    render() {
        const { MuiStyle } = this.props as any;
        return (
            <Html lang={'zh'}>
                <Head>
                    <style
                        id="jss-server-side"
                        dangerouslySetInnerHTML={
                            MuiStyle.props.dangerouslySetInnerHTML
                        }
                    />
                    <meta httpEquiv="X-UA-Compatible" content="edge" />
                    <link rel={'shortcut icon'} href={'/favicon.svg'}/>
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}
Leek.getInitialProps = async (ctx: DocumentContext) => {
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        })

    const initialProps = await Document.getInitialProps(ctx)
    return {
        ...initialProps,
        styles: initialProps.styles,
        MuiStyle: sheets.getStyleElement(),
    }
}
