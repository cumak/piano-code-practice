import type { FC } from "react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "src/auth/AuthProvider";

import { getAllCate } from "@/assets/js/GetFromDB";

type Props = {
  disabled?: boolean;
  defaultLable?: string;
  onChange?: () => void;
  setSelectedCateId?: React.Dispatch<React.SetStateAction<string>>;
};

export const CategoryOption: FC<Props> = ({
  disabled = false,
  defaultLable = "選択してください",
  onChange,
  setSelectedCateId,
}) => {
  const [cateData, setCateData] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const dispData = await getAllCate(currentUser);
      setCateData(dispData);
      setSelectedCateId("default");
    })();
  }, []);

  function onChangeSelect(event) {
    onChange && onChange();
    setSelectedCateId(event.target.value);
  }

  return (
    <select id="categorySelect" defaultValue={"default"} onChange={onChangeSelect}>
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
