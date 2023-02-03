import React, { useEffect, FC } from "react";
import { useRouter } from "next/router";
import Layout from "components/layout";
import { auth } from "src/utils/firebase";
import { createWaonArea } from "assets/js/CreateWaonArea";
import { appendWaon } from "assets/js/AppendWaon";
import { onpuSlide } from "assets/js/OnpuSlide";
import { getWaonGroupFields, getWaonFields } from "assets/js/GetFromDB";
import { getAllCate } from "components/categoryOption";

import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

const Mypage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login/");
      } else {
        myWaonLoad();
      }
    });
  }, []);

  async function getUserhasWaonInfo() {
    // 全てのデータを格納するもの
    let waonInformations = [];

    const currentUser = firebase.auth().currentUser;

    // waonGroupFields =>
    // [0 => {
    //     main: {createdAt: timeStamp, {waonサブコレ}},
    //     waonGid: String
    //   ]
    // ]
    const waonGroupFields = await getWaonGroupFields(currentUser);

    // 和音グループごとに処理
    for (let i = 0; i < waonGroupFields.length; i++) {
      waonInformations[i] = {};
      waonInformations[i].createdAt = waonGroupFields[i].main.createdAt;
      waonInformations[i].waonGid = waonGroupFields[i].waonGid;
      waonInformations[i].field = waonGroupFields[i].field;

      const waonGroupDoc = waonGroupFields[i].main;
      // 和音を取得
      waonInformations[i].waons = await getWaonFields(
        currentUser,
        waonGroupDoc
      );
    }

    return waonInformations;
  }

  async function myWaonLoad() {
    const waonInformations: any = await getUserhasWaonInfo();

    // データを元に表示
    for (let i = 0; i < waonInformations.length; i++) {
      // 和音グループの数だけ5線を出力
      let waonInfo = waonInformations[i].waons;
      let waonGid = waonInformations[i].waonGid;
      const categoryId = waonInformations[i].field.category;
      const allCate = await getAllCate();
      const cateObj = allCate.find((cate) => {
        return cate.docId === categoryId;
      });

      const myWaonHtml = `
          <div class="myWaon-gosen" data-containernum="${i}" data-id="${waonGid}">
            <div class="myWaonBtns">
              <div class="myWaonBtns-l">
                <div class="myWaonBtns-btn">
                  <span class="btn-grad is-gray deleteBtn">削除</span>
                </div>
                <div class="myWaonBtns-btn">
                  <span class="btn-grad is-green editBtn">編集</span>
                </div>
              </div>
              <div class="myWaonBtns-r">
                <div class="categoryIcon">${cateObj.cateName}</div>
              </div>
            </div>
            <div class="addMain">
              <div class="addMain-inner">
                <div class="addMain-gosen"><img src="/img/gosen-add.svg" alt="" /></div>
                <div class="onpuContainer"></div>
              </div>
            </div>
            </div>
        </div>
      `;
      const wrapper = document.querySelector(".myWaon");
      wrapper.insertAdjacentHTML("beforeend", myWaonHtml);

      // 和音itemを作る (htmlを丸ごと挿入しただけなので、containerやitemはiとかjを使って個別に取得)
      const onpuContainers = document.querySelectorAll(".onpuContainer");
      const onpuContainer = onpuContainers[i];
      // 音符Itemごとの処理 waonInfo->[{code:,waons:},{code:,waons:}]
      for (let j = 0; j < waonInfo.length; j++) {
        createWaonArea({ onpuContainer, addPlay: true });
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
    }
    onpuSlide();

    // 削除ボタンイベントリスナ追加
    const deleteBtn = document.querySelectorAll(".deleteBtn");
    deleteBtn.forEach((e) => {
      e.addEventListener("click", pushDeleteBtn);
    });
    // 編集ボタンイベントリスナ追加
    const editBtn = document.querySelectorAll(".editBtn");
    editBtn.forEach((e) => {
      e.addEventListener("click", editGroup);
    });
  }

  // 削除ボタン
  function pushDeleteBtn(e) {
    if (window.confirm("この和音グループを削除しますか？")) {
      deleteGroup(e);
    }
  }

  async function deleteGroup(e) {
    const currentUser = firebase.auth().currentUser;
    const target = e.target;
    const myWaon = target.closest(".myWaon-gosen");
    const waonGroupId = myWaon.dataset.id;

    const waonGroupDoc = db
      .collection("user")
      .doc(currentUser.email)
      .collection("waonGroup")
      .doc(waonGroupId);
    let arr = [];
    waonGroupDoc
      .collection("waon")
      .get()
      // 対象の和音グループを消す
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          arr.push(waonGroupDoc.collection("waon").doc(doc.id).delete());
        });
        Promise.all(arr)
          // 和音サブコレクションを全部削除したあと
          .then(() => {
            // ドキュメントを削除
            waonGroupDoc.delete().then(() => {
              alert("削除しました");
              myWaon.remove();
            });
          });
      });
  }

  // 編集ボタン
  function editGroup(e) {
    const id = e.target.closest(".myWaon-gosen").dataset.id;
    router.push("./add/" + id);
  }

  return (
    <Layout>
      <main className="main">
        <div className="mainWrapper">
          <div className="wrapper">
            <div className="myWaon"></div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Mypage;
