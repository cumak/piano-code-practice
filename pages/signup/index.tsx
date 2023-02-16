import { Layout } from "components/Layout";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useState } from "react";
import { auth } from "src/utils/firebase";

import firebaseError from "@/assets/js/errMsg";

const SignUp: FC = () => {
  // useRouterでrouterオブジェクトを取得
  const router = useRouter();
  // stateにemailを作り、setEmail関数を作る。passwordも同じ
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 登録ボタンを押した時の処理
  const createUser = async (e) => {
    e.preventDefault();
    try {
      // createUserWithEmailAndPasswordで、メルアドとパスワードをいれてユーザーを作る → リダイレクト
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      alert(firebaseError(err, "signup"));
    }
  };

  return (
    <Layout>
      <main className="main">
        <div className="wrapper">
          <div className="formWrapper">
            <form action="" className="loginForm" onSubmit={createUser}>
              <label className="formItem">
                <span className="formItem-label">メールアドレス</span>
                <span className="formItem-input">
                  <input
                    type="email"
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
                <button className="btn-s is-pink" type="submit">
                  新規登録
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SignUp;
