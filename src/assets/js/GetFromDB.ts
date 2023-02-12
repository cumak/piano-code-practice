import type { DocumentData, Firestore } from "firebase/firestore";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";

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
export type Waons = theWaon[];

export type theWaon =
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

export const getWaonGroupDataWithId = async (): Promise<GetWaonGroupDataWithId> => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      const userWaonGroupField: GetWaonGroupDataWithId = [];
      const wgRef = collection(db, "user", user.email, "waonGroup");
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

export async function getAllCate(): Promise<GetAllCate> {
  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      const categoryDocs = await getDocs(collection(db, "user", user.email, "category"));
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
