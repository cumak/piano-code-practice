import {
  getFirestore,
  getDocs,
  collection,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import type { Firestore, DocumentData } from "firebase/firestore";
const db: Firestore = getFirestore();

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

export const getWaonGroupDataWithId = async (currentUser) => {
  let userWaonGroupField: GetWaonGroupDataWithId = [];
  const wgRef = collection(db, "user", currentUser.email, "waonGroup");
  const sortedWgRef = query(wgRef, orderBy("createdAt", "asc"));
  const wg = await getDocs(sortedWgRef);
  for (let i = 0; i < wg.docs.length; i++) {
    userWaonGroupField[i] = {
      waonGid: wg.docs[i].id, //IDも配列に加える
      waonGroupData: wg.docs[i].data(),
    };
  }
  return userWaonGroupField;
};
