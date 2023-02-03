import Head from "next/head";

interface Props {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
}

export default ({
  title,
  description,
  image,
  type,
  url,
}: Props): JSX.Element => {
  return (
    <Head>
      <title>{title ?? "コード練習アプリ"}</title>
      <meta
        name="description"
        content={
          description ??
          "コードを登録して、スライドショーで流す単純なアプリです。"
        }
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={
          description ??
          "コードを登録して、スライドショーで流す単純なアプリです。"
        }
      />
      <meta property="og:type" content={type ?? "article"} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image ?? "/img/og-images.jpg"} />
      <meta property="og:site_name" content={title ?? "コード練習アプリ"} />
      <meta property="og:locale" content="ja_JP" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@tcr_jp" />
      <meta name="twitter:url" content={image} />
      <meta name="twitter:title" content={title ?? "コード練習アプリ"} />
      <meta
        name="twitter:description"
        content="コードを登録して、スライドショーで流す単純なアプリです。"
      />
      <meta name="twitter:image" content={image ?? "/img/og-images.jpg"} />
      <link rel="canonical" href={url} />
      <link rel="shortcut icon" href={"/img/favicon.ico"} />
      <link rel="apple-touch-icon" href={"/img/apple-touch-icon.png"} />
    </Head>
  );
};
