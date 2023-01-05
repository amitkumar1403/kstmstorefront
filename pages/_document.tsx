import { /*NextScript,*/ FeaturePolyfills } from '@engineerapart/nextscript';
import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default class MyDocument extends NextDocument /*Document*/ {
   static async getInitialProps(ctx: any) {
      const initialProps = await NextDocument.getInitialProps(ctx);
      return { ...initialProps };
    }

  render() {
    return (
      <html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}