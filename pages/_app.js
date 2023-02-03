import '../assets/styles/style.scss'
import React, { useEffect } from 'react'
import nprogress from 'nprogress'

// プログレスバーの設定(出ないけど)
nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.25 })

export default function App({ Component, pageProps }) {
  if (process.browser) {
    // バーの表示開始
    nprogress.start()
  }
  useEffect(() => {
    // バーの表示終了
    nprogress.done()
  })
  return <Component {...pageProps} />
}