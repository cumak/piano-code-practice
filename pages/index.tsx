import { Layout } from "components/Layout";
import Link from "next/link";
import type { FC } from "react";

const Home: FC = () => {
  return (
    <Layout>
      <main className="main">
        <div className="topContainer">
          <div className="topContainer-inner">
            <div className="topCopy">
              <div className="topCopy-main">コードを練習しよう！</div>
              <div className="topCopy-sub">
                <p>
                  このアプリは、タブレットを横置きにした状態で使いましょう。
                  <br />
                  音符登録はパソコンでもできます。
                </p>
              </div>
            </div>
            <div className="openBtn">
              <Link className="btn-big is-green" href="/start/">
                START!
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
