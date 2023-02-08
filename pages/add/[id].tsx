import { Edit } from "components/Edit";
import { Layout } from "components/layout";
import { onAuthStateChanged } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import type { FC } from "react";
import { useEffect } from "react";

import { appendWaon } from "@/assets/js/AppendWaon";
import { createWaonArea } from "@/assets/js/CreateWaonArea";
import type { WaonGroup } from "@/assets/js/GetFromDB";
import { onpuSlide } from "@/assets/js/OnpuSlide";
import { auth } from "@/utils/firebase";

const db: Firestore = getFirestore();

export const Id: FC = (props: any) => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const pathArr = url.pathname.split("/");
    const waonGroupId = pathArr[pathArr.length - 1];

    // ユーザーをここでチェックしないと、doc(currentUser.email)がnullになる
    onAuthStateChanged(auth, (user) => {
      if (user) {
        loadEditTargetWaon(waonGroupId);
      }
    });
  }, []);

  // 編集モードの時、対象の和音をロード
  async function loadEditTargetWaon(waonGroupId) {
    const waonGroup = await getDoc(
      doc(db, "user", auth.currentUser.email, "waonGroup", waonGroupId)
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
      <Edit isEditMode />
    </Layout>
  );
};
