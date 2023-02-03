import { FC } from 'react'
import Layout from '../components/layout';
import Link from 'next/link'

const Home: FC = (props: any) => {

  return (
    <Layout>
      <main className="main">
        <div className="topContainer">
          <div className="topContainer-inner">
            <div className="mainCopy">コード練習しよう！</div>
            <div className="openBtn">
              <Link href="/start/">
                <a className="btn-big is-green">Let's START!</a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home