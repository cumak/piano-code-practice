import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

export type GetWaonGroupFields = {
  field?: { category: string } | firebase.firestore.DocumentData;
  main?: firebase.firestore.DocumentData;
  waonGid?: string;
}[];

export const getWaonGroupFields = (currentUser) => {
  let userWaonGroupField: GetWaonGroupFields = [];
  return db
    .collection("user")
    .doc(currentUser.email)
    .collection("waonGroup")
    .orderBy("createdAt")
    .get()
    .then((querySnapshot) => {
      // ドキュメント取得時に、ドキュメントIDも追加しておく
      for (let i = 0; i < querySnapshot.docs.length; i++) {
        userWaonGroupField[i] = {
          main: querySnapshot.docs[i],
          waonGid: querySnapshot.docs[i].id, //IDも配列に加える
          field: querySnapshot.docs[i].data(),
        };
      }
      return userWaonGroupField;
    });
};

export type GetWaonFields =
  | {
      code: string;
      index: number;
      waons: {
        num: number;
        flat: boolean;
        sharp: boolean;
      }[];
    }[]
  | firebase.firestore.DocumentData[];

export function getWaonFields(currentUser, waonGroupDoc) {
  let waonFields: GetWaonFields;
  // waonGroupDocが、ドキュメントそのものならそのidを取得
  let docId = waonGroupDoc;
  if ("id" in waonGroupDoc) {
    docId = waonGroupDoc.id;
  }
  return db
    .collection("user")
    .doc(currentUser.email)
    .collection("waonGroup")
    .doc(docId)
    .collection("waon")
    .orderBy("index")
    .get()
    .then((querySnapshot) => {
      waonFields = querySnapshot.docs.map((e) => {
        return e.data();
      });
      return waonFields;
    });
}
