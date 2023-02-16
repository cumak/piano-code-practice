import type { Firestore } from "firebase/firestore";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import MicroModal from "micromodal";
import type { FC } from "react";
import { useEffect } from "react";
import { auth } from "src/utils/firebase";

const db: Firestore = getFirestore();

type Props = {
  callbackAfterCreate?: (string?) => void;
};

export const ModalNewGroup: FC<Props> = ({ callbackAfterCreate }) => {
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
    }).then((e) => {
      alert("カテゴリーを追加しました");
      MicroModal.close("modal-1");
      callbackAfterCreate && callbackAfterCreate(e.id);
    });
  }

  return (
    <div id="modal-1" aria-hidden="true" className="modal micromodal-slide">
      <div tabIndex={-1} className="modal__overlay">
        <div role="dialog" aria-modal="true" aria-labelledby="modal-1-title" className="modal__container">
          <section className="modalContents newGroupAdd">
            <h2 className="newGroupAdd-title">新しいカテゴリーを追加</h2>
            <p>カテゴリー名を入れてください。</p>
            <div className="newGroupAdd-inputArea">
              <input id="newGroupName" className="newGroupAdd-inputArea-input" type="text" />
            </div>
          </section>
          <div className="modalBtn">
            <button className="btn-grad is-blue" aria-label="登録する" type="button" onClick={addCategory}>
              新規作成
            </button>
          </div>
          <button className="modalBtn-close btn-s" aria-label="モーダルを閉じる" data-micromodal-close>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};
