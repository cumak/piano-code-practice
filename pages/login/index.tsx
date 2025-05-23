import { Layout } from "@components/Layout";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";

import { firebaseError } from "@/assets/js/firebaseError";
import { auth } from "@/utils/firebase";

const Login: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && router.push("/");
    });
  }, [isLogin]);

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLogin(true);
    } catch (err) {
      alert(firebaseError(err, "signin"));
    }
  };

  const onGuestLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, "info.pcpguest@cumak.net", "guest876");
      setIsLogin(true);
    } catch (err) {
      alert(firebaseError(err, "signin"));
    }
  };

  return (
    <Layout>
      <main className="main">
        <div className="wrapper">
          <div className="formWrapper">
            <form action="" className="loginForm">
              <label className="formItem">
                <span className="formItem-label">メールアドレス</span>
                <span className="formItem-input">
                  <input
                    type="email"
                    name="email"
                    onChange={(e) => {
                      return setEmail(e.target.value);
                    }}
                  />
                </span>
              </label>
              <label className="formItem">
                <span className="formItem-label">パスワード</span>
                <span className="formItem-input">
                  <input
                    type="password"
                    onChange={(e) => {
                      return setPassword(e.target.value);
                    }}
                  />
                </span>
              </label>
              <div className="formBtn">
                <button className="btn-s is-orange" type="button" onClick={logIn} aria-label="ログイン">
                  ログイン
                </button>
              </div>
            </form>
            <div className="guestLogin">
              <button className="btn-s" onClick={onGuestLogin}>
                ゲストユーザーとしてログインする
              </button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;
