import { useEffect, FC, useState } from "react";
import Head from "components/head";
import Layout from "components/layout";

import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

const Category: FC = (props: any) => {
  let [cateName, setCateName] = useState([]);
  let [docId, setDocId] = useState([]);
  let index = -1;

  useEffect(() => {
    let currentUser;
    // ユーザーをここでチェックしないと、doc(currentUser.email)がnullになる
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        currentUser = firebase.auth().currentUser;
        getCate();
      }
    });
    async function getCate() {
      const querySnapshot = await db
        .collection("user")
        .doc(currentUser.email)
        .collection("category")
        .get();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cateName = [...cateName, data.name];
        docId = [...docId, doc.id];
      });
      setCateName(cateName);
      setDocId(docId);
    }
  }, []);

  async function changeCate(e) {
    const user = firebase.auth().currentUser;
    const targetId = e.target.dataset.id;
    const textInput = document.querySelector(
      "#" + targetId + " .categorySection-name"
    );
    const newVal = textInput.value;
    const targetDoc = db
      .collection("user")
      .doc(user.email)
      .collection("category")
      .doc(targetId);
    await targetDoc.update({
      name: newVal,
    });
    alert("カテゴリ名を更新しました。");
  }

  return (
    <Layout>
      <Head title={"カテゴリー|コード練習アプリ"} />
      <main className="main">
        <div className="mainWrapper">
          <h1 className="title-m">カテゴリー</h1>
          <div className="categoryArea">
            {cateName.map((name) => {
              index++;
              return (
                <div id={docId[index]} className="categorySection" key={name}>
                  <input
                    className="categorySection-name"
                    type="text"
                    defaultValue={name}
                  />
                  <input
                    className="categorySection-submit btn-s is-orange"
                    type="submit"
                    data-id={docId[index]}
                    value="カテゴリ名更新"
                    onClick={changeCate}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Category;
