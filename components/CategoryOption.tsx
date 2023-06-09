import type { FC } from "react";
import { useEffect, useState } from "react";

import { getAllCate } from "@/assets/js/GetFromDB";

type Props = {
  disabled?: boolean;
  firstLabel?: string;
  onChange?: () => void;
  defaultId?: string;
  setSelectedCateId?: React.Dispatch<React.SetStateAction<string>>;
};

export const CategoryOption: FC<Props> = ({
  disabled = false,
  firstLabel = "選択してください",
  onChange,
  defaultId = "default",
  setSelectedCateId,
}) => {
  const [cateData, setCateData] = useState([]);

  useEffect(() => {
    (async () => {
      const dispData = await getAllCate();
      setCateData(dispData);
      setSelectedCateId(defaultId);
    })();
  }, [defaultId]);

  function onChangeSelect(event) {
    onChange && onChange();
    setSelectedCateId(event.target.value);
  }

  return (
    <select id="categorySelect" onChange={onChangeSelect} value={defaultId}>
      <option value="default" disabled={disabled}>
        {firstLabel}
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
