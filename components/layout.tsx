import Link from "next/link";
import LoginBtn from "components/loginBtn";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "src/utils/firebase";

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // useEffectクリーンアップのために必要（詳しくわからん。そういうもんやと）
    let isMounted = true;
    // ログインしてなかったら、loginページに飛ばす。ログインしてたらstateにuserをセット
    auth.onAuthStateChanged((user) => {
      if (pathname != "/signup") {
        user ? setCurrentUser(user) : router.push("/login");
      }
      if (isMounted) {
        user ? setCurrentUser(user) : "";
      }
      return () => {
        isMounted = false;
      };
    });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <Link className="logo-img" href="/">
            <img src="/img/logo.svg" alt="ロゴ" />
          </Link>
        </div>
        <div className="header-info">
          <div className="header-info-btns">
            <div className="header-info-btns-btn">
              <Link className="btn-s is-blue" href="/start/">
                Play
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <Link className="btn-s is-red" href="/category/">
                カテゴリー
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <Link className="btn-s is-red" href="/mypage/">
                My 和音
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <Link className="btn-s is-red" href="/add/">
                和音登録
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <LoginBtn />
            </div>
            <div className="header-info-btns-btn">
              <Link className="btn-s is-pink" href="/signup/">
                新規登録
              </Link>
            </div>
          </div>
        </div>
      </header>
      {currentUser || pathname === "/login" || pathname === "/signup"
        ? children
        : "...loading"}
      <div className="msgBox"></div>
      <footer id="footer"></footer>
    </div>
  );
}
