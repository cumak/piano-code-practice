import "@/assets/styles/global.scss";

import type { AppProps } from "next/app";
import Head from "next/head";

import { AuthProvider } from "@/auth/AuthProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>コード練習アプリ</title>
        <meta
          name="description"
          content={"コードを登録して、スライドショーで流す単純なアプリです。"}
        />
        <link rel="shortcut icon" href={"/img/favicon.ico"} />
        <link rel="apple-touch-icon" href={"/img/apple-touch-icon.png"} />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}
