import { LoginBtn } from "components/loginBtn";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "src/auth/AuthProvider";

export function Layout({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { currentUser } = useContext(AuthContext);

  const [isShowPage, setIsShowPage] = useState<boolean>(false);
  useEffect(() => {
    if (currentUser === undefined) {
      return;
    }
    if (currentUser === null) {
      if (pathname !== "/signup" && pathname !== "/login") {
        router.push("/login");
      } else {
        setIsShowPage(true);
      }
    } else {
      setIsShowPage(true);
    }
  }, [currentUser]);

  return (
    isShowPage && (
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
        {isShowPage || pathname === "/login" || pathname === "/signup" ? children : "...loading"}
        <div className="msgBox"></div>
        <footer id="footer"></footer>
      </div>
    )
  );
}
