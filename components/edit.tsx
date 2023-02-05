import { onpuSlide } from "assets/js/OnpuSlide";
import { createWaonArea } from "assets/js/CreateWaonArea";
import ModalNewGroup from "components/modalNewGroup";
import CategoryOption from "components/categoryOption";
import { auth } from "src/utils/firebase";

import { useEffect, FC, useRef } from "react";
import { useRouter } from "next/router";

import {
  getFirestore,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  collection,
  doc,
  deleteDoc,
} from "firebase/firestore";
import type { Firestore, QueryDocumentSnapshot } from "firebase/firestore";

// Firestore のインスタンスを初期化
const db: Firestore = getFirestore();

const edit: FC = (props: any) => {
  const router = useRouter();
  const routeId = router.query.id;
  const editMode = routeId ? true : false;
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
    let html = target.closest(".selectOnpuTama-one").cloneNode(true);
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
    html.addEventListener("click", function (e) {
      onpuCurrent(e.target);
    });
    // 最初の一つ目の音符を追加
    if (!onpuTamaOne.length) {
      removeSelectClass();
      onpuTama.appendChild(html);
    } else {
      // 同じものをクリックしたら追加しない
      const checkExistNumber = [...onpuTamaOne].some((e: HTMLElement) => {
        const num = parseInt(e.dataset.num);
        return num === targetnum;
      });
      if (checkExistNumber) {
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
    const test = [...onpuTamas].every((e) => e.hasChildNodes());
    if (!test) {
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
    const checkFlase = [...items].some((item: HTMLElement) => {
      const onpuTamas = item.querySelectorAll(".onpuTama");
      const codeInput = item.querySelector(
        ".onpuContainer-item-opt-code input"
      );
      // 入力チェック
      return checkInput(items, codeInput, onpuTamas) === false;
    });
    if (checkFlase) {
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

    // TODO:いるかもしれない　編集モードの時は、waonコレクションの和音をDeleteしておく
    // if (editMode) {
    //   const waonCollection = waonGroupRef.collection("waon");
    //   const deletePs = await deleteCollection(waonCollection, 4);
    //   waonAdded.push(deletePs);
    // }

    let waonObj = [];
    items.forEach((item, index) => {
      let notes = [];
      const one = item.querySelectorAll(".onpuTama-one");
      const code: HTMLInputElement = item.querySelector(
        ".onpuContainer-item-opt-code input"
      );
      one.forEach((tama: HTMLElement) => {
        const dataNumber = parseInt(tama.dataset.num);
        let sharp = tama.classList.contains("is-sharp") ? true : false;
        let flat = tama.classList.contains("is-flat") ? true : false;
        notes.push({
          num: dataNumber,
          sharp: sharp,
          flat: flat,
        });
      });
      waonObj.push({
        index: index,
        code: code.value,
        notes,
      });
    });
    let newWaonGroup = {
      waons: [...waonObj],
      modifiedAt: serverTimestamp(),
      category: cateId,
    };
    if (!editMode) {
      newWaonGroup["createdAt"] = serverTimestamp();
    }
    const wgCollection = collection(db, "user", user.email, "waonGroup");
    if (editMode) {
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
    if (!editMode) {
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
              <img src="/img/gosen-long.svg" alt="" />
            </div>
            <div className="selectOnpuContainer">
              <div className="selectOnpuContainer-item">
                <div className="selectOnpuContainer-item-main">
                  <div className="selectOnpuContainer-item-main-parts is-righthand">
                    <div className="selectOnpuTama">
                      <span
                        className="selectOnpuTama-one"
                        data-num="1"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="2"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="3"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="4"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="5"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="6"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="7"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="8"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="9"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="10"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="11"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="12"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="13"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="14"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="15"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="16"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="17"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="18"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                    </div>
                  </div>
                  <div className="selectOnpuContainer-item-main-parts is-lefthand">
                    <div className="selectOnpuTama">
                      <span
                        className="selectOnpuTama-one"
                        data-num="19"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="20"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="21"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="22"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="23"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="24"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="25"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="26"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="27"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="28"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="29"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="30"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="31"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span
                        className="selectOnpuTama-one"
                        data-num="32"
                        onClick={(e) => onpuSelected(e.target)}
                      >
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
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
                    <img src="/img/gosen-add.svg" alt="" />
                  </div>
                  {/* 決定した和音 */}
                  <div className="onpuContainer"></div>
                </div>
              </div>
            </div>
            <div className="actionArea">
              <div className="actionBtns">
                <div className="actionBtns-row is-waon">
                  <div className="btn-grad is-yellow" onClick={addWaonArea}>
                    和音追加
                  </div>
                  <div className="btn-grad is-green" onClick={eraseWaon}>
                    和音削除
                  </div>
                  <div className="btn-grad is-green" onClick={eraseOnpu}>
                    音符削除
                  </div>
                </div>
                <div className="actionBtns-row is-kigou">
                  <div className="btn-grad is-gray" onClick={addSharp}>
                    <img src="/img/sharp.svg" alt="" />
                  </div>
                  <div className="btn-grad is-gray" onClick={addFlat}>
                    <img src="/img/flat.svg" alt="" />
                  </div>
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

export default edit;
