import * as React from "react";
import { useEffect, FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "src/utils/firebase";

const loginBtn: FC = (props: any) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<null | boolean>(null);
  useEffect(() => {
    let isMounted = true;
    auth.onAuthStateChanged((user) => {
      if (isMounted) {
        user ? setIsLogin(true) : setIsLogin(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const logOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      {isLogin ? (
        <span className="btn-s is-orange" onClick={logOut}>
          ログアウト
        </span>
      ) : (
        <Link href="/login/">
          <a className="btn-s is-orange">ログイン</a>
        </Link>
      )}
    </>
  );
};

export default loginBtn;
