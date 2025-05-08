import { Layout } from "@components/Layout";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WaonGroupLayout } from "@components/WaonGroupLayout";

import type { GetAllCate, GetWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { getAllCate, getWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { onpuSlide } from "@/assets/js/OnpuSlide";
import { AuthContext } from "@/auth/AuthProvider";
import { PRESET_ID } from "@/constants";

const PresetPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [waonGroupDataWithId, setWaonGroupDataWithId] = useState<GetWaonGroupDataWithId>([]);
  const [allCate, setAllCate] = useState<GetAllCate>();

  useEffect(() => {
    (async () => {
      const data = await getWaonGroupDataWithId(PRESET_ID);
      if (!data) {
        return;
      }
      setWaonGroupDataWithId(data);
    })();
    (async () => {
      const data = await getAllCate(PRESET_ID);
      data && setAllCate(data);
    })();
  }, [currentUser]);

  useEffect(() => {
    onpuSlide();
  }, [waonGroupDataWithId]);

  function getTargetCateName(cateId) {
    const cate = allCate?.find((cate) => {
      return cate.docId === cateId;
    });
    if (cate?.cateName) {
      return cate?.cateName;
    } else {
      return "未設定";
    }
  }

  return (
    <Layout>
      <main className="main">
        <div className="mainWrapper">
          <div className="wrapper">
            <p>プリセット登録されている和音の一覧です。</p>
            <div className="myWaon is-preset">
              {waonGroupDataWithId.map((waonGroup) => {
                return (
                  <div key={waonGroup.waonGid} className="myWaon-gosen" data-containernum="${i}" data-id="${waonGid}">
                    <div className="myWaonBtns">
                      <div className="myWaonBtns-l"></div>
                      <div className="myWaonBtns-r">
                        <div className="categoryIcon">{`${getTargetCateName(waonGroup.waonGroupData.category)}`}</div>
                      </div>
                    </div>
                    <WaonGroupLayout>
                      <div className="onpuContainer">
                        {waonGroup.waonGroupData.waons.map((waon) => {
                          return (
                            <div key={waon.index} className="onpuContainer-item">
                              <div className="onpuContainer-item-main">
                                <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                                  <div className="onpuTama">
                                    {waon.notes?.map((onpu) => {
                                      return (
                                        onpu.num <= 18 && (
                                          <span
                                            key={onpu.num}
                                            className={`onpuTama-one js-onpuslide-one ${
                                              onpu.isSelected ? "is-select" : ""
                                            } ${onpu.sharp ? "is-sharp" : ""} ${onpu.flat ? "is-flat" : ""}`}
                                            role="button"
                                            tabIndex={0}
                                            data-num={onpu.num}
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
                                    {waon.notes?.map((onpu) => {
                                      return (
                                        onpu.num >= 19 && (
                                          <span
                                            key={onpu.num}
                                            className={`onpuTama-one js-onpuslide-one ${
                                              onpu.isSelected ? "is-select" : ""
                                            } ${onpu.sharp ? "is-sharp" : ""} ${onpu.flat ? "is-flat" : ""}`}
                                            role="button"
                                            tabIndex={0}
                                            data-num={onpu.num}
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
                              </div>
                              <div className="onpuContainer-item-opt">
                                <div className="onpuContainer-item-opt-code">{waon.code}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </WaonGroupLayout>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default PresetPage;
