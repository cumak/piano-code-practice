import { useEffect, FC, useState } from "react";
import "src/utils/firebase";
import { auth } from "src/utils/firebase";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
const db: Firestore = getFirestore();

type Props = {
  disabled?: boolean;
  defaultLable?: string;
  selectRef: React.Ref<HTMLSelectElement>;
  onChange?: () => void;
};

export async function getAllCate() {
  const currentUser = auth.currentUser;
  const categoryDocs = await getDocs(
    collection(db, "user", currentUser.email, "category")
  );
  const dispData = categoryDocs.docs.map((doc) => {
    const data = doc.data();
    return {
      cateName: data.name,
      docId: doc.id,
    };
  });
  dispData.push({
    cateName: "未設定",
    docId: "default",
  });
  return dispData;
}

const cateogoryOption: FC<Props> = ({
  disabled = true,
  defaultLable = "選択してください",
  selectRef,
  onChange,
}) => {
  const [cateData, setCateData] = useState([]);

  useEffect(() => {
    (async () => {
      const dispData = await getAllCate();
      setCateData(dispData);
    })();
  }, []);

  return (
    <select
      id="categorySelect"
      defaultValue={"default"}
      ref={selectRef}
      onChange={onChange}
    >
      <option value="default" disabled={disabled}>
        {defaultLable}
      </option>
      {cateData.map((name) => {
        return (
          <option value={name.docId} key={name.docId}>
            {name.cateName}
          </option>
        );
      })}
    </select>
  );
};

export default cateogoryOption;
