import Link from "next/link";
import { useRouter } from "next/router";
import type { FC } from "react";
import * as React from "react";
import { useEffect, useState } from "react";
import { auth } from "src/utils/firebase";

export const LoginBtn: FC = (props: any) => {
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
        <button className="btn-s is-orange" onClick={logOut}>
          ログアウト
        </button>
      ) : (
        <Link className="btn-s is-orange" href="/login/">
          ログイン
        </Link>
      )}
    </>
  );
};
