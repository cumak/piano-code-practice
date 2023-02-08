import { getAllCate } from "components/categoryOption";
import { Layout } from "components/layout";
import type { Firestore } from "firebase/firestore";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { auth } from "src/utils/firebase";

import { appendWaon } from "@/assets/js/AppendWaon";
import { createWaonArea } from "@/assets/js/CreateWaonArea";
import type { GetWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { getWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { onpuSlide } from "@/assets/js/OnpuSlide";

const db: Firestore = getFirestore();

const Mypage: FC = () => {
  const router = useRouter();
  const [waonGroupDataWithId, setWaonGroupDataWithId] =
    useState<GetWaonGroupDataWithId>([]);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login/");
      } else {
        const currentUser = auth.currentUser;
        const data = await getWaonGroupDataWithId(currentUser);
        setWaonGroupDataWithId(data);
      }
    });
  }, []);

  useEffect(() => {
    myWaonLoad();
  }, [waonGroupDataWithId]);

  async function myWaonLoad() {
    for (let i = 0; i < waonGroupDataWithId.length; i++) {
      // 和音グループの数だけ5線を出力
      const waonGroupData = waonGroupDataWithId[i].waonGroupData;
      const waonGid = waonGroupDataWithId[i].waonGid;
      const categoryId = waonGroupDataWithId[i].waonGroupData.category;

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

      for (let j = 0; j < waonGroupData.waons.length; j++) {
        createWaonArea({ onpuContainer, addPlay: true });
        const items = onpuContainer.querySelectorAll(".onpuContainer-item");
        const item = items[j];
        appendWaon(item, waonGroupData.waons[j].notes);
        // コードネームを挿入
        const code = waonGroupData.waons[j].code;
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
    const currentUser = auth.currentUser;
    const target = e.target;
    const myWaon = target.closest(".myWaon-gosen");
    const waonGroupId = myWaon.dataset.id;

    deleteDoc(doc(db, "user", currentUser.email, "waonGroup", waonGroupId))
      .then(() => {
        alert("削除しました");
        refresh();
      })
      .catch((err) => {
        console.error(err);
        alert("削除に失敗しました");
      });
  }

  async function refresh() {
    const currentUser = auth.currentUser;
    reset();
    const newWaonGroupDataWithId = await getWaonGroupDataWithId(currentUser);
    setWaonGroupDataWithId([...newWaonGroupDataWithId]);
  }

  function reset() {
    const myWaonEl = document.querySelector(".myWaon");
    while (myWaonEl.firstChild) {
      myWaonEl.removeChild(myWaonEl.firstChild);
    }
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
