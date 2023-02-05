import { useEffect, FC } from "react";
import Head from "components/head";
import Layout from "components/layout";
import { onpuSlide } from "assets/js/OnpuSlide";
import { createWaonArea } from "assets/js/CreateWaonArea";
import { appendWaon } from "assets/js/AppendWaon";
import type { WaonGroup } from "assets/js/GetFromDB";
import Edit from "components/edit";
import { auth } from "src/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { getFirestore, doc, getDoc } from "firebase/firestore";
import type { Firestore, QueryDocumentSnapshot } from "firebase/firestore";

const db: Firestore = getFirestore();

const Id: FC = (props: any) => {
  let currentUser;

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathArr = url.pathname.split("/");
    const waonGroupId = pathArr[pathArr.length - 1];

    // ユーザーをここでチェックしないと、doc(currentUser.email)がnullになる
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = auth.currentUser;
        loadEditTargetWaon(waonGroupId);
      }
    });
  }, []);

  // 編集モードの時、対象の和音をロード
  async function loadEditTargetWaon(waonGroupId) {
    const waonGroup = await getDoc(
      doc(db, "user", currentUser.email, "waonGroup", waonGroupId)
    ).then((querySnapshot) => {
      return querySnapshot.data() as WaonGroup;
    });

    // 和音itemを作る (htmlを丸ごと挿入しただけなので、containerやitemはiとかjを使って個別に取得)
    const onpuContainer = document.querySelector(".onpuContainer");
    // 音符Itemごとの処理 waonInfo->[{code:,waons:},{code:,waons:}]
    for (let j = 0; j < waonGroup.waons.length; j++) {
      createWaonArea({
        onpuContainer: onpuContainer,
        addEdit: true,
        addPlay: true,
        waonAreaSelect: false,
      });
      const items = onpuContainer.querySelectorAll(".onpuContainer-item");
      const item = items[j];
      const waon = waonGroup.waons[j];
      appendWaon(item, waon.notes);
      // コードネームを挿入
      const code = waon.code;
      const codeinput: HTMLInputElement = item.querySelector(
        ".onpuContainer-item-opt-code input"
      );
      codeinput.value = code;
    }
    onpuSlide();
  }

  return (
    <Layout>
      <Head title={"登録画面|コード練習アプリ"} />
      <Edit />
    </Layout>
  );
};

export default Id;
