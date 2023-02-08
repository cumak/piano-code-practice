// 「問題登録」で和音追加ボタンを押した時
// 「Mypage」で登録している和音をロードする時

import Image from "next/image";
import type { FC } from "react";
import { useRef } from "react";

import { playWaon } from "@/assets/js/playWaon";

// canEdit＝>和音を選択できるようにする
// canPlay=>playボタンを作る
// waonAreaSelect=>和音を追加した後に、和音エリアをselectにするかどうか

export type CreateWaonAreaProps = {
  canEdit?: boolean;
  canPlay?: boolean;
  waonAreaSelect?: boolean;
  currentWaon: SelectedWaon;
  selectedWaons?: SelectedWaon[]; //State書き換えのため
  setSelectedWaons?; //State書き換えのため
  eraseOnpu?;
};

export type SelectedWaon = {
  code?: string;
  index: number;
  isSelected?: boolean;
  notes?: {
    num: number;
    flat: boolean;
    sharp: boolean;
    isSelected?: boolean;
  }[];
};

export const CreateWaonArea: FC<CreateWaonAreaProps> = ({
  canEdit = false,
  canPlay = false,
  waonAreaSelect = true,
  currentWaon,
  selectedWaons,
  setSelectedWaons,
  eraseOnpu,
}) => {
  const containerItemMain = useRef<HTMLDivElement>(null);

  return (
    <div
      className={`onpuContainer-item ${currentWaon.isSelected && "is-select"}`}
      ref={containerItemMain}
    >
      <button
        type="button"
        className="onpuContainer-item-main"
        onClick={selectToggleWaonArea}
      >
        <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
          <div className="onpuTama">
            {currentWaon.notes?.map((onpu, noteIndex) => {
              return (
                onpu.num <= 18 && (
                  <span
                    key={onpu.num}
                    className={`onpuTama-one js-onpuslide-one ${
                      onpu.isSelected ? "is-select" : ""
                    } ${onpu.sharp ? "is-sharp" : ""} ${
                      onpu.flat ? "is-flat" : ""
                    }`}
                    role="button"
                    tabIndex={noteIndex as number}
                    data-num={onpu.num}
                    onClick={(e) => {
                      canEdit && toggleNoteSelect(e, noteIndex);
                    }}
                    onKeyDown={(e) => {
                      if (canEdit) {
                        toggleNoteSelect(e, noteIndex);
                        if (e.key === "Backspace") {
                          eraseOnpu();
                        }
                      }
                    }}
                  >
                    <Image src="/img/onpu.svg" alt="" fill />
                  </span>
                )
              );
            })}
          </div>
          <div className="onpuLine">
            <span className="onpuLine-item is-top1"></span>
            <span className="onpuLine-item is-top2"></span>
            <span className="onpuLine-item is-bottom1"></span>
            <span className="onpuLine-item is-bottom2"></span>
          </div>
        </div>
        <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
          <div className="onpuTama">
            {currentWaon.notes?.map((onpu, noteIndex) => {
              return (
                onpu.num >= 19 && (
                  <span
                    key={onpu.num}
                    className={`onpuTama-one js-onpuslide-one ${
                      onpu.isSelected ? "is-select" : ""
                    } ${onpu.sharp ? "is-sharp" : ""} ${
                      onpu.flat ? "is-flat" : ""
                    }`}
                    role="button"
                    tabIndex={noteIndex as number}
                    data-num={onpu.num}
                    onClick={(e) => {
                      canEdit && toggleNoteSelect(e, noteIndex);
                    }}
                    onKeyDown={(e) => {
                      if (canEdit) {
                        toggleNoteSelect(e, noteIndex);
                        if (e.key === "Backspace") {
                          eraseOnpu();
                        }
                      }
                    }}
                  >
                    <Image src="/img/onpu.svg" alt="" fill />
                  </span>
                )
              );
            })}
          </div>
          <div className="onpuLine">
            <span className="onpuLine-item is-top1"></span>
            <span className="onpuLine-item is-top2"></span>
            <span className="onpuLine-item is-bottom1"></span>
            <span className="onpuLine-item is-bottom2"></span>
          </div>
        </div>
      </button>
      {canPlay && (
        <div className="onpuContainer-item-opt">
          <div className="onpuContainer-item-opt-code">
            <input type="text" name="code" defaultValue={currentWaon.code} />
          </div>
          <button
            type="button"
            className="onpuContainer-item-opt-sound"
            onClick={playWaon}
          >
            <span className="onpuContainer-item-opt-sound-btn">♪</span>
          </button>
        </div>
      )}
    </div>
  );
};
