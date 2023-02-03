import { useEffect, useState, FC } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import { auth } from "src/utils/firebase";
import firebaseError from "assets/js/errMsg";

const Login: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && router.push("/");
    });
  }, []);

  const logIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push("/");
    } catch (err) {
      alert(firebaseError(err, "signin"));
    }
  };

  return (
    <Layout>
      <main className="main">
        <div className="wrapper">
          <div className="formWrapper">
            <form action="" className="loginForm" onSubmit={logIn}>
              <label className="formItem">
                <span className="formItem-label">メールアドレス</span>
                <span className="formItem-input">
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </span>
              </label>
              <label className="formItem">
                <span className="formItem-label">パスワード</span>
                <span className="formItem-input">
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </span>
              </label>
              <div className="formBtn">
                <button className="btn-s is-orange" type="submit">
                  ログイン
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;
