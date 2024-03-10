import Document, { Head, Html, Main, NextScript } from "next/document";

class WeathermanDocument extends Document {
  render() {
    return (
      <Html lang="en" className="m-0">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Azeret+Mono:wght@400;600;700;800;900&family=Unna:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="m-0 bg-neutral-1 text-neutral-12 scheme-neutral">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
export default WeathermanDocument;
