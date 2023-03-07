import { Layout } from "@components/Layout";
import type { FetchedWGProps } from "components/Edit";
import { Edit } from "components/Edit";
import { onAuthStateChanged } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type { WaonGroup } from "@/assets/js/GetFromDB";
import { auth } from "@/utils/firebase";

const db: Firestore = getFirestore();

const Id: FC = () => {
  const [data, setData] = useState<WaonGroup>();
  const [fetchedWGProps, setFetchedWGProps] = useState<FetchedWGProps>();

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathArr = url.pathname.split("/");
    const waonGroupId = pathArr[pathArr.length - 1];

    onAuthStateChanged(auth, (user) => {
      if (user) {
        loadEditTargetWaon(waonGroupId);
      }
    });
  }, []);

  useEffect(() => {
    setFetchedWGProps({
      canEdit: true,
      canPlay: true,
      waonAreaSelect: true,
      waonGroup: data,
    });
  }, [data]);

  // 編集モードの時、対象の和音をロード
  async function loadEditTargetWaon(waonGroupId) {
    const waonGroup = await getDoc(doc(db, "user", auth.currentUser.email, "waonGroup", waonGroupId)).then(
      (querySnapshot) => {
        return querySnapshot.data() as WaonGroup;
      }
    );

    setData(waonGroup);
  }

  return <Layout>{fetchedWGProps?.waonGroup && <Edit isEditMode fetchedWGProps={fetchedWGProps} />}</Layout>;
};

export default Id;
