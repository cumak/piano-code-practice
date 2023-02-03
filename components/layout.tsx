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
          <Link href="/">
            <a className="logo-img">ろご</a>
          </Link>
        </div>
        <div className="header-info">
          <div className="header-info-btns">
            <div className="header-info-btns-btn">
              <Link href="/start/">
                <a className="btn-s is-blue">Play</a>
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <Link href="/category/">
                <a className="btn-s is-red">カテゴリー</a>
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <Link href="/mypage/">
                <a className="btn-s is-red">My 和音</a>
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <Link href="/add/">
                <a className="btn-s is-red">和音登録</a>
              </Link>
            </div>
            <div className="header-info-btns-btn">
              <LoginBtn />
            </div>
            <div className="header-info-btns-btn">
              <Link href="/signup/">
                <a className="btn-s is-pink">新規登録</a>
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
