import * as React from "react";
import { useEffect, FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "src/utils/firebase";

const loginBtn: FC = (props: any) => {
  const router = useRouter();

  const logOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      {auth.currentUser ? (
        <span className="btn-s is-orange" onClick={logOut}>
          ログアウト
        </span>
      ) : (
        <Link className="btn-s is-orange" href="/login/">
          ログイン
        </Link>
      )}
    </>
  );
};

export default loginBtn;
