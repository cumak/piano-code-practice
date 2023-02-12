import { Layout } from "components/layout";
import { ModalNewGroup } from "components/modalNewGroup";
import { onAuthStateChanged } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { auth } from "src/utils/firebase";

import { deleteCate, getAllCate } from "@/assets/js/GetFromDB";

const db: Firestore = getFirestore();

type FormProps = {
  category: {
    cateName: string;
    docId: string;
  }[];
};

const Category: FC = (props: any) => {
  const [targetId, setTargetId] = useState<string>("");
  const { handleSubmit, setValue, register, control } = useForm<FormProps>();

  const { fields } = useFieldArray({
    name: "category",
    control,
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getCate();
      }
    });
  }, []);

  async function getCate() {
    const cate = await getAllCate();
    setValue("category", cate);
  }

  async function deleteCategory(id) {
    if (window.confirm("削除しますか？")) {
      await deleteCate(id)
        .then(() => {
          alert("カテゴリーを削除しました");
          getCate();
        })
        .catch((err) => {
          alert("カテゴリーを削除できませんでした");
          console.error(err);
          return;
        });
    }
  }

  async function onSubmit(data) {
    const cateObj = data.category.find((cate) => {
      return cate.docId === targetId;
    });
    await updateDoc(doc(db, "user", auth.currentUser.email, "category", targetId), { name: cateObj.cateName });
    alert("カテゴリ名を更新しました。");
  }

  return (
    <Layout>
      <main className="main">
        <div className="mainWrapper">
          <div className="titleArea">
            <h1 className="title-m">カテゴリー</h1>
            <div className="titleArea-r">
              <button type="button" className="btn-s is-blue" data-micromodal-trigger="modal-1">
                新規作成
              </button>
            </div>
          </div>
          <form className="categoryArea" onSubmit={handleSubmit(onSubmit)}>
            {fields.map((fields, index) => {
              return (
                <div className="categorySection" key={fields.id}>
                  <input type="hidden" name="docId" />
                  <input
                    className="categorySection-name"
                    type="text"
                    name={`category.${index}.cateName`}
                    {...register(`category.${index}.cateName` as const, {
                      required: true,
                    })}
                  />
                  <input
                    className="categorySection-submit btn-s is-orange"
                    type="submit"
                    value="カテゴリ名更新"
                    onClick={() => {
                      return setTargetId(fields.docId);
                    }}
                  />
                  <button
                    className="categorySection-trash"
                    type="button"
                    onClick={() => {
                      deleteCategory(fields.docId);
                    }}
                  >
                    <img src="/img/icon-trash.svg" alt="" />
                  </button>
                </div>
              );
            })}
          </form>
        </div>
      </main>
      <ModalNewGroup callbackAfterCreate={getCate} />
    </Layout>
  );
};

export default Category;
