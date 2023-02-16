import { default as Document, Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content={"コードを登録して、スライドショーで流す単純なアプリです。"} />
          <link rel="shortcut icon" href={"/img/favicon.ico"} />
          <link rel="apple-touch-icon" href={"/img/apple-touch-icon.png"} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
