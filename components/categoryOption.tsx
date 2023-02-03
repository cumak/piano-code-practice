import { useEffect, FC, useState } from "react";
import "src/utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore();

type Props = {
  disabled?: boolean;
  defaultLable?: string;
  selectRef: React.Ref<HTMLSelectElement>;
  onChange?: () => void;
};

export async function getAllCate() {
  const currentUser = firebase.auth().currentUser;
  const querySnapshot = await db
    .collection("user")
    .doc(currentUser.email)
    .collection("category")
    .orderBy("name")
    .get();
  const dispData = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      cateName: data.name,
      docId: doc.id,
    };
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
