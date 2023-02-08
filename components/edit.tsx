import { CategoryOption } from "components/categoryOption";
import { ModalNewGroup } from "components/modalNewGroup";
import type { Firestore } from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { auth } from "src/utils/firebase";

import { createWaonArea } from "@/assets/js/CreateWaonArea";
import { onpuSlide } from "@/assets/js/OnpuSlide";
import { ADD_ONPU_HEONKIGOU, ADD_ONPU_TOONKIGOU } from "@/constants";

// Firestore のインスタンスを初期化
const db: Firestore = getFirestore();

type Props = {
  isEditMode?: boolean;
};

export const Edit: FC<Props> = ({ isEditMode = false }) => {
  const router = useRouter();
  const routeId = router.query.id;
  const categorySelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    onpuSlide();
  }, []);

  // 「和音追加」押下
  function addWaonArea() {
    // コード4つ以上になってないか
    const items = document.querySelectorAll(".onpuContainer-item");
    if (items.length >= 4) {
      alert("登録できるのは4つまでです。");
      return false;
    }
    // コンテナ取得
    const onpuContainer = document.querySelector(".onpuContainer");
    createWaonArea({
      onpuContainer: onpuContainer,
      addEdit: true,
      addPlay: true,
    });
  }

  // 上の音符を選んだとき
  function onpuSelected(target) {
    // 追加する音符を作成
    const html = target.closest(".selectOnpuTama-one").cloneNode(true);
    const targetnum = parseInt(html.dataset.num);
    const c = target.closest(".selectOnpuContainer-item-main-parts").classList;
    const lrClass = c.contains("is-righthand")
      ? ".is-righthand"
      : ".is-lefthand";

    // 追加先の要素を取得作成
    let selectedItem = document.querySelector(".onpuContainer-item.is-select");
    // 追加先が選択されてなかったら終了
    if (!selectedItem) {
      const onpuContainer = document.querySelector(".onpuContainer");
      if (onpuContainer.hasChildNodes()) {
        alert("追加先のエリアを選択してください。");
        return false;
      } else {
        // 和音が何も追加されてなかったら、和音エリア追加
        addWaonArea();
        selectedItem = document.querySelector(".onpuContainer-item.is-select");
      }
    }

    // 既存の音符を取得
    const onpuTama = selectedItem.querySelector(lrClass + " .onpuTama");
    const onpuTamaOne = selectedItem.querySelectorAll(
      lrClass + " .onpuTama-one"
    );

    html.classList.remove("selectOnpuTama-one");
    html.classList.add("onpuTama-one", "js-onpuslide-one", "is-select");
    html.addEventListener("click", (e) => {
      onpuCurrent(e.target);
    });
    // 最初の一つ目の音符を追加
    if (!onpuTamaOne.length) {
      removeSelectClass();
      onpuTama.appendChild(html);
    } else {
      // 同じものをクリックしたら追加しない
      const isExistTama = [...onpuTamaOne].some((e: HTMLElement) => {
        const num = parseInt(e.dataset.num);
        return num === targetnum;
      });
      if (isExistTama) {
        return;
      }
      removeSelectClass();
      // data-numを見て、現在のnumと次の要素のnumを取得して順番になるように追加する
      for (let i = 0; i < onpuTamaOne.length; i++) {
        const thisHtml: any = onpuTamaOne[i];
        const thisHtmlnum = parseInt(thisHtml.dataset.num);
        const thisnexthtml: any = onpuTamaOne[i + 1];
        if (thisHtmlnum > targetnum) {
          thisHtml.before(html);
          break;
        }
        if (!thisnexthtml) {
          thisHtml.after(html);
          break;
        }
        const thisNextHtmlnum = parseInt(thisnexthtml.dataset.num);
        if (thisHtmlnum < targetnum && thisNextHtmlnum > targetnum) {
          thisHtml.after(html);
          break;
        }
      }
    }
    onpuSlide();
  }

  // addMainスペースの全てのis-selectクラスを削除（連続してシャープやフラットを付与するために直帰で追加した音符のみis-selectにし、他はis-selectを削除するため）
  function removeSelectClass() {
    const allOnpuTamaOne = document.querySelectorAll(".addMain .onpuTama-one");
    [...allOnpuTamaOne].forEach((e) => {
      e.classList.remove("is-select");
    });
  }

  // 音符を選択したときにis-selectクラスを付与/削除
  function onpuCurrent(target) {
    const e = target.closest(".onpuTama-one");
    e.classList.toggle("select");
  }

  // 和音削除ボタン押下
  function eraseWaon() {
    const itemSelect = document.querySelectorAll(
      ".onpuContainer-item.is-select"
    );
    if (itemSelect.length) {
      [...itemSelect].forEach((e) => {
        e.remove();
      });
    } else {
      alert("削除したい和音を選択してください");
    }
  }

  // 音符削除ボタン押下
  function eraseOnpu() {
    const onpuTamaSelect = document.querySelectorAll(".onpuTama .is-select");
    onpuTamaSelect.forEach((e) => {
      e.remove();
    });
    eraseOnpuLine();
    onpuSlide();
  }

  // シャープ追加ボタン押下
  function addSharp() {
    const onpuTamaSelect = document.querySelectorAll(".onpuTama .is-select");
    onpuTamaSelect.forEach((e) => {
      e.classList.toggle("is-sharp");
      e.classList.remove("is-flat");
    });
  }
  // フラット追加ボタン押下
  function addFlat() {
    const onpuTamaSelect = document.querySelectorAll(".onpuTama .is-select");
    onpuTamaSelect.forEach((e) => {
      e.classList.toggle("is-flat");
      e.classList.remove("is-sharp");
    });
  }

  function eraseOnpuLine() {
    const onpuLine = document.querySelectorAll(".addMain .onpuLine-item");
    onpuLine.forEach((e: any) => {
      e.style.opacity = 0;
    });
  }

  // 登録ボタン押した時の入力チェック
  function checkInput(items, codeInput, onpuTamas) {
    // コード名の確認
    const codeVal = codeInput.value;
    if (!codeVal) {
      alert("コード名を全て入力してください。");
      return false;
    }
    // 音符が入力されているか
    const isExist = [...onpuTamas].every((e) => {
      return e.hasChildNodes();
    });
    if (!isExist) {
      alert("両手分の音符を入力してください。");
      return false;
    }
  }

  // 登録ボタン押下
  function register(e) {
    // 登録するものがあるかチェック
    const onpuContainer = document.querySelector(".addMain .onpuContainer");
    if (!onpuContainer.hasChildNodes()) {
      alert("和音を入力してください。");
      e.preventDefault();
      return false;
    }

    const addMain = document.querySelector(".addMain .onpuContainer");
    const items = addMain.childNodes;
    const isCheckNG = [...items].some((item: HTMLElement) => {
      const onpuTamas = item.querySelectorAll(".onpuTama");
      const codeInput = item.querySelector(
        ".onpuContainer-item-opt-code input"
      );
      // 入力チェック
      return checkInput(items, codeInput, onpuTamas) === false;
    });
    if (isCheckNG) {
      e.preventDefault();
      return false;
    } else {
      if (window.confirm("登録しますか？")) {
        addWaonToDb();
      } else {
        e.preventDefault();
        return false;
      }
    }
  }

  // DBに登録する
  async function addWaonToDb() {
    const items = document.querySelectorAll(".addMain .onpuContainer-item");

    const user = auth.currentUser;
    const cateId = categorySelectRef.current.value;

    // TODO:いるかもしれない。編集モードの時は、waonコレクションの和音をDeleteしておく
    // if (isEditMode) {
    //   const waonCollection = waonGroupRef.collection("waon");
    //   const deletePs = await deleteCollection(waonCollection, 4);
    //   waonAdded.push(deletePs);
    // }

    const waonObj = [];
    items.forEach((item, index) => {
      const notes = [];
      const one = item.querySelectorAll(".onpuTama-one");
      const code: HTMLInputElement = item.querySelector(
        ".onpuContainer-item-opt-code input"
      );
      one.forEach((tama: HTMLElement) => {
        const dataNumber = parseInt(tama.dataset.num);
        const isSharp = tama.classList.contains("is-sharp") ? true : false;
        const isFlat = tama.classList.contains("is-flat") ? true : false;
        notes.push({
          num: dataNumber,
          sharp: isSharp,
          flat: isFlat,
        });
      });
      waonObj.push({
        index: index,
        code: code.value,
        notes,
      });
    });
    const newWaonGroup = {
      waons: [...waonObj],
      modifiedAt: serverTimestamp(),
      category: cateId,
    };
    if (!isEditMode) {
      newWaonGroup["createdAt"] = serverTimestamp();
    }
    const wgCollection = collection(db, "user", user.email, "waonGroup");
    if (isEditMode) {
      await updateDoc(doc(wgCollection, routeId as string), {
        waons: waonObj,
        modifiedAt: serverTimestamp(),
        category: cateId,
      });
    } else {
      await addDoc(wgCollection, {
        waons: waonObj,
        modifiedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        category: cateId,
      });
    }
    alert("和音を追加しました。");
    // 新規追加モードなら登録後クリアする
    if (!isEditMode) {
      initContainer();
    }
  }

  function initContainer() {
    const items = document.querySelectorAll(".onpuContainer-item");
    [...items].forEach((e) => {
      e.remove();
    });
  }

  return (
    <main className="main">
      <form action="">
        <div className="mainWrapper">
          <h1 className="title-l">問題登録</h1>
          <div className="selectGosenContainer">
            <div className="selectGosenContainer-gosen">
              <Image src="/img/gosen-long.svg" alt="" fill />
            </div>
            <div className="selectOnpuContainer">
              <div className="selectOnpuContainer-item">
                <div className="selectOnpuContainer-item-main">
                  <div className="selectOnpuContainer-item-main-parts is-righthand">
                    <div className="selectOnpuTama">
                      {ADD_ONPU_TOONKIGOU.map((onpu, index) => {
                        return (
                          <span
                            key={onpu.dataNum}
                            className="selectOnpuTama-one"
                            role="button"
                            tabIndex={index as number}
                            data-num={onpu.dataNum}
                            onClick={(e) => {
                              return onpuSelected(e.target);
                            }}
                            onKeyDown={(e) => {
                              return onpuSelected(e.target);
                            }}
                          >
                            <Image
                              src="/img/onpu.svg"
                              alt={onpu.onpuName}
                              fill
                            />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="selectOnpuContainer-item-main-parts is-lefthand">
                    <div className="selectOnpuTama">
                      {ADD_ONPU_HEONKIGOU.map((onpu, index) => {
                        return (
                          <span
                            key={onpu.dataNum}
                            className="selectOnpuTama-one"
                            role="button"
                            tabIndex={index as number}
                            data-num={onpu.dataNum}
                            onClick={(e) => {
                              return onpuSelected(e.target);
                            }}
                            onKeyDown={(e) => {
                              return onpuSelected(e.target);
                            }}
                          >
                            <Image
                              src="/img/onpu.svg"
                              alt={onpu.onpuName}
                              fill
                            />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottomArea">
            <div className="bottomArea-l">
              <div className="addMain">
                <div className="addMain-inner">
                  <div className="addMain-gosen">
                    <Image src="/img/gosen-add.svg" alt="" fill />
                  </div>
                  {/* 決定した和音 */}
                  <div className="onpuContainer"></div>
                </div>
              </div>
            </div>
            <div className="actionArea">
              <div className="actionBtns">
                <div className="actionBtns-row is-waon">
                  <button className="btn-grad is-yellow" onClick={addWaonArea}>
                    和音追加
                  </button>
                  <button className="btn-grad is-green" onClick={eraseWaon}>
                    和音削除
                  </button>
                  <button className="btn-grad is-green" onClick={eraseOnpu}>
                    音符削除
                  </button>
                </div>
                <div className="actionBtns-row is-kigou">
                  <span
                    className="actionBtns-row-kigonBtn btn-grad is-gray"
                    role="button"
                    tabIndex={10 as number}
                    onClick={addSharp}
                    onKeyDown={addSharp}
                  >
                    <span className="actionBtns-row-kigonBtn-imgWrap">
                      <Image src="/img/sharp.svg" alt="シャープ" fill />
                    </span>
                  </span>
                  <span
                    className="actionBtns-row-kigonBtn btn-grad is-gray"
                    role="button"
                    tabIndex={11 as number}
                    onClick={addFlat}
                    onKeyDown={addFlat}
                  >
                    <span className="actionBtns-row-kigonBtn-imgWrap">
                      <Image src="/img/flat.svg" alt="フラット" fill />
                    </span>
                  </span>
                </div>
                <div className="actionBtns-row is-group">
                  <section className="actionBtns-row-group">
                    <h2 className="actionBtns-row-group-title">カテゴリー</h2>
                    <CategoryOption selectRef={categorySelectRef} />
                    <div className="actionBtns-row-group-newBtn">
                      <span
                        className="btn-plus"
                        data-micromodal-trigger="modal-1"
                      >
                        +
                      </span>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
          <div className="registerBtn">
            <input
              className="btn-big is-blue"
              type="button"
              value="登録する"
              onClick={register}
            />
          </div>
        </div>
      </form>
      <ModalNewGroup />
    </main>
  );
};
