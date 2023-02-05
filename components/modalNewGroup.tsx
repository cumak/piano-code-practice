import { useEffect, FC } from "react";
import MicroModal from "micromodal";
import { auth } from "src/utils/firebase";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
const db: Firestore = getFirestore();

const modalNewGroup: FC = (props: any) => {
  useEffect(() => {
    MicroModal.init({
      disableScroll: true,
      awaitCloseAnimation: true,
    });
  }, []);

  // カテゴリーを登録
  function addCategory() {
    const input = document.getElementById("newGroupName") as HTMLInputElement;
    const newGroupName = input.value;

    const user = auth.currentUser;
    addDoc(collection(db, "user", user.email, "category"), {
      name: newGroupName,
    }).then(() => {
      alert("カテゴリーを追加しました");
      MicroModal.close("modal-1");
    });
  }

  return (
    <div id="modal-1" aria-hidden="true" className="modal micromodal-slide">
      <div tabIndex={-1} className="modal__overlay">
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
              type="button"
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
