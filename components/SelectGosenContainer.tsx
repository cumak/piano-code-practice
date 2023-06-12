import Image from "next/image";

import { ADD_ONPU_HEONKIGOU, ADD_ONPU_TOONKIGOU } from "@/constants";

type Props = {
  onpuSelected?: (string?) => void;
};

export const SelectGosenContainer = ({ onpuSelected }: Props) => {
  return (
    <div className="selectGosenContainer">
      <div className="selectGosenContainer-gosen">
        <Image src="/img/gosen-long.svg" alt="" fill />
      </div>
      <div className="selectOnpuContainer">
        <div className="selectOnpuContainer-item">
          <div className="selectOnpuContainer-item-main">
            <div className="selectOnpuContainer-item-main-parts is-righthand">
              <div className="selectOnpuTama">
                {ADD_ONPU_TOONKIGOU.map((onpu) => {
                  return (
                    <button
                      key={onpu.dataNum}
                      className="selectOnpuTama-one"
                      data-num={onpu.dataNum}
                      type="button"
                      onClick={(e) => {
                        return onpuSelected(e.target);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          return onpuSelected(e.target);
                        }
                      }}
                    >
                      <Image src="/img/onpu.svg" alt={onpu.onpuName} fill />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="selectOnpuContainer-item-main-parts is-lefthand">
              <div className="selectOnpuTama">
                {ADD_ONPU_HEONKIGOU.map((onpu) => {
                  return (
                    <button
                      key={onpu.dataNum}
                      className="selectOnpuTama-one"
                      type="button"
                      data-num={onpu.dataNum}
                      onClick={(e) => {
                        return onpuSelected(e.target);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          return onpuSelected(e.target);
                        }
                      }}
                    >
                      <Image src="/img/onpu.svg" alt={onpu.onpuName} fill />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
