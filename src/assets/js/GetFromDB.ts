import type { DocumentData, Firestore } from "firebase/firestore";
import { collection, deleteDoc, doc, getDocs, getFirestore, orderBy, query } from "firebase/firestore";

const db: Firestore = getFirestore();
import { auth } from "@/utils/firebase";

export type GetWaonGroupDataWithId = {
  waonGroupData?: DocumentData;
  waonGid?: string;
}[];

export type WaonGroup = {
  category: string;
  createdAt: any;
  modifiedAt: any;
  waons: Waons;
};

// categoryなどを含まない和音だけの配列
export type Waons = TheWaon[];

export type TheWaon =
  | {
      code: string;
      index: number;
      notes: {
        num: number;
        flat: boolean;
        sharp: boolean;
      }[];
    }
  | DocumentData;

export type GetAllCate = {
  cateName: string;
  docId: string;
}[];

export const getWaonGroupDataWithId = async (targetUser?): Promise<GetWaonGroupDataWithId> => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return false;
      }
      const currentUser = targetUser || user.email;
      const userWaonGroupField: GetWaonGroupDataWithId = [];
      const wgRef = collection(db, "user", currentUser, "waonGroup");
      const sortedWgRef = query(wgRef, orderBy("createdAt", "asc"));
      const wg = await getDocs(sortedWgRef);
      for (let i = 0; i < wg.docs.length; i++) {
        userWaonGroupField[i] = {
          waonGid: wg.docs[i].id, //IDも配列に加える
          waonGroupData: wg.docs[i].data(),
        };
      }
      resolve(userWaonGroupField);
    });
  });
};

export async function getAllCate(targetUser?): Promise<GetAllCate> {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      const currentUser = targetUser || auth.currentUser.email;
      const categoryDocs = await getDocs(collection(db, "user", currentUser, "category"));
      const dispData = categoryDocs.docs.map((doc) => {
        const data = doc.data();
        return {
          cateName: data.name,
          docId: doc.id,
        };
      });
      resolve(dispData);
    });
  });
}

export async function deleteCate(cateId) {
  if (!cateId) {
    return false;
  }
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      deleteDoc(doc(db, "user", user.email, "category", cateId)).then((data) => {
        resolve(data);
      });
    });
  });
}
