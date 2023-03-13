import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/auth/AuthProvider";
import { auth } from "@/utils/firebase";

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

  const logOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleAccountMenu = () => {
    const accountMenu = document.querySelector(".headerAccountMenu");
    if (accountMenu.classList.contains("is-show")) {
      accountMenu.classList.remove("is-show");
    } else {
      accountMenu.classList.add("is-show");
    }
  };

  return (
    isShowPage && (
      <div className="container">
        <header className="header">
          <div className="logo">
            <Link className="logo-img" href="/">
              <Image src="/img/logo.svg" fill alt="ロゴ" />
            </Link>
          </div>
          <div className="header-info">
            {currentUser && <div className="header-info-user">{currentUser.email}</div>}
            <div className="header-info-btns">
              {currentUser && (
                <>
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
                      マイ和音
                    </Link>
                  </div>
                  <div className="header-info-btns-btn">
                    <Link className="btn-s is-red" href="/add/">
                      和音登録
                    </Link>
                  </div>
                </>
              )}
              {currentUser ? (
                <div className="header-info-btns-btn">
                  <div className="headerAccount">
                    <button className="headerAccount-icon" onClick={toggleAccountMenu}>
                      <img src="/img/icon-user-circle.svg" alt="ユーザーアカウント" />
                    </button>
                    <ul className="headerAccountMenu">
                      <li className="headerAccountMenu-item">
                        <span className="headerAccountMenu-item-link">
                          <Link href="/signup/">新規ユーザー登録</Link>
                        </span>
                      </li>
                      <li className="headerAccountMenu-item">
                        <span
                          className="headerAccountMenu-item-link"
                          role="button"
                          tabIndex={0}
                          onClick={logOut}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              return logOut;
                            }
                          }}
                        >
                          ログアウト
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <div className="header-info-btns-btn">
                    <Link className="btn-s is-pink" href="/signup/">
                      新規登録
                    </Link>
                  </div>
                </>
              )}
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
