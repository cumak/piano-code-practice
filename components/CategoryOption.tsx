import type { FC } from "react";
import { useEffect, useState } from "react";

import { getAllCate } from "@/assets/js/GetFromDB";
import { PRESET_ID } from "@/constants";

type Props = {
  disabled?: boolean;
  firstLabel?: string;
  onChange?: () => void;
  defaultId?: string;
  setSelectedCateId?: React.Dispatch<React.SetStateAction<string>>;
  addPresetOption?: boolean;
};

export const CategoryOption: FC<Props> = ({
  disabled = false,
  firstLabel = "選択してください",
  onChange,
  defaultId = "default",
  setSelectedCateId,
  addPresetOption = true,
}) => {
  const [cateData, setCateData] = useState([]);
  const [presetCateData, setPresetCateData] = useState([]);

  useEffect(() => {
    (async () => {
      const dispData = await getAllCate();
      setCateData(dispData);
      setSelectedCateId(defaultId);
    })();
  }, [defaultId]);

  useEffect(() => {
    if (!addPresetOption) {
      return;
    }
    (async () => {
      const presetDispData = await getAllCate(PRESET_ID);
      setPresetCateData(presetDispData);
    })();
  }, [addPresetOption]);

  function onChangeSelect(event) {
    onChange && onChange();
    setSelectedCateId(event.target.value);
  }

  return (
    <select id="categorySelect" onChange={onChangeSelect} value={defaultId}>
      <option value="default" disabled={disabled}>
        {firstLabel}
      </option>
      {cateData.map((cate) => {
        return (
          <option value={cate.docId} key={cate.docId}>
            {cate.cateName}
          </option>
        );
      })}
      {addPresetOption &&
        presetCateData.map((cate) => {
          return (
            <option key={cate.docId} value={`preset-${cate.docId}`}>
              プリセット({cate.cateName})
            </option>
          );
        })}
    </select>
  );
};
