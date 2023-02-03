import { useEffect, FC } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

const modalNewGroup: FC = (props: any) => {
  useEffect(() => {
    require("micromodal");
    MicroModal.init({
      disableScroll: true,
      awaitCloseAnimation: true,
    });
  }, []);

  // カテゴリーを登録
  function addCategory() {
    const input = document.getElementById("newGroupName") as HTMLInputElement;
    const newGroupName = input.value;

    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user.email)
      .collection("category")
      .add({ name: newGroupName })
      .then(() => {
        alert("カテゴリーを追加しました");
      });
  }

  return (
    <div id="modal-1" aria-hidden="true" className="modal micromodal-slide">
      <div tabIndex={-1} data-micromodal-close className="modal__overlay">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-1-title"
          className="modal__container"
        >
          <section className="modalContents newGroupAdd">
            <h2 className="newGroupAdd-title">新しいカテゴリーを追加</h2>
            <p>カテゴリー名を入れてください。</p>
            <div className="newGroupAdd-inputArea">
              <input
                id="newGroupName"
                className="newGroupAdd-inputArea-input"
                type="text"
              />
            </div>
          </section>
          <div className="modalBtn">
            <button
              className="btn-grad is-blue"
              aria-label="登録する"
              data-micromodal-close
              onClick={addCategory}
            >
              新規作成
            </button>
          </div>
          <button
            className="modalBtn-close btn-s"
            aria-label="モーダルを閉じる"
            data-micromodal-close
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default modalNewGroup;
