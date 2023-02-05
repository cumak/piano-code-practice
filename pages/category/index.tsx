import { useEffect, FC, useState } from "react";
import Head from "components/head";
import Layout from "components/layout";
import { auth } from "src/utils/firebase";
import { useForm, useFieldArray } from "react-hook-form";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
const db: Firestore = getFirestore();

type formProps = {
  category: {
    cateName: string;
    docId: string;
  }[];
};

const Category: FC = (props: any) => {
  let [cateName, setCateName] = useState([]);
  let [docIds, setDocIds] = useState([]);
  let [targetId, setTargetId] = useState<string>("");
  const { handleSubmit, setValue, register, control } = useForm<formProps>();

  const { fields, append, remove } = useFieldArray({
    name: "category",
    control,
  });

  useEffect(() => {
    let currentUser;
    // ユーザーをここでチェックしないと、doc(currentUser.email)がnullになる
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = auth.currentUser;
        getCate();
      }
    });
    async function getCate() {
      const categoryDocs = await getDocs(
        collection(db, "user", currentUser.email, "category")
      );
      const forSetValue = [];
      categoryDocs.forEach((doc) => {
        const data = doc.data();
        cateName = [...cateName, data.name];
        docIds = [...docIds, doc.id];
        forSetValue.push({ cateName: data.name, docId: doc.id });
      });
      setCateName(cateName);
      setDocIds(docIds);
      setValue("category", forSetValue);
    }
  }, []);

  async function onSubmit(data) {
    const cateObj = data.category.find((cate) => cate.docId === targetId);
    await updateDoc(
      doc(db, "user", auth.currentUser.email, "category", targetId),
      {
        name: cateObj.cateName,
      }
    );
    alert("カテゴリ名を更新しました。");
  }

  return (
    <Layout>
      <Head title={"カテゴリー|コード練習アプリ"} />
      <main className="main">
        <div className="mainWrapper">
          <h1 className="title-m">カテゴリー</h1>
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
                    onClick={() => setTargetId(fields.docId)}
                  />
                </div>
              );
            })}
          </form>
        </div>
      </main>
    </Layout>
  );
};

export default Category;
