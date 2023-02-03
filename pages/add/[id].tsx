import { useEffect, FC } from "react";
import Head from "components/head";
import Layout from "components/layout";
import { onpuSlide } from "assets/js/OnpuSlide";
import { createWaonArea } from "assets/js/CreateWaonArea";
import { appendWaon } from "assets/js/AppendWaon";
import { getWaonFields } from "assets/js/GetFromDB";
import Edit from "components/edit";

import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

const Id: FC = (props: any) => {
  let currentUser;

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathArr = url.pathname.split("/");
    const waonGroupId = pathArr[pathArr.length - 1];

    // ユーザーをここでチェックしないと、doc(currentUser.email)がnullになる
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        currentUser = firebase.auth().currentUser;
        loadEditTargetWaon(waonGroupId);
      }
    });
  }, []);

  // 編集モードの時、対象の和音をロード
  async function loadEditTargetWaon(waonGroupId) {
    let waonInfo = [];

    db.collection("user")
      .doc(currentUser.email)
      .collection("waonGroup")
      .doc(waonGroupId)
      .get()
      .then(async (e) => {
        waonInfo = await getWaonFields(currentUser, e);

        // カテゴリーをセット
        const waonGdata = e.data();
        const categoryId = waonGdata.category;
        const categorySelect = document.getElementById(
          "categorySelect"
        ) as HTMLInputElement;
        categorySelect.value = categoryId;

        // 和音itemを作る (htmlを丸ごと挿入しただけなので、containerやitemはiとかjを使って個別に取得)
        const onpuContainer = document.querySelector(".onpuContainer");
        // 音符Itemごとの処理 waonInfo->[{code:,waons:},{code:,waons:}]
        for (let j = 0; j < waonInfo.length; j++) {
          createWaonArea({
            onpuContainer: onpuContainer,
            addEdit: true,
            addPlay: true,
            waonAreaSelect: false,
          });
          const items = onpuContainer.querySelectorAll(".onpuContainer-item");
          const item = items[j];
          appendWaon(item, waonInfo[j]);
          // コードネームを挿入
          const code = waonInfo[j].code;
          const codeinput: HTMLInputElement = item.querySelector(
            ".onpuContainer-item-opt-code input"
          );
          codeinput.value = code;
        }
        onpuSlide();
      });
  }

  return (
    <Layout>
      <Head title={"登録画面|コード練習アプリ"} />
      <Edit />
    </Layout>
  );
};

export default Id;
