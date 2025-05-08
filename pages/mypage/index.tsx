import { Layout } from "@components/Layout";
import type { Firestore } from "firebase/firestore";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useContext, useEffect, useState } from "react";

import type { GetAllCate, GetWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { getAllCate, getWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { onpuSlide } from "@/assets/js/OnpuSlide";
import { playWaon } from "@/assets/js/playWaon";
import { AuthContext } from "@/auth/AuthProvider";
import { GUEST_ID } from "@/constants";

const db: Firestore = getFirestore();

const Mypage: FC = () => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [waonGroupDataWithId, setWaonGroupDataWithId] = useState<GetWaonGroupDataWithId>([]);
  const [allCate, setAllCate] = useState<GetAllCate>();

  useEffect(() => {
    (async () => {
      const data = await getWaonGroupDataWithId();
      if (!data) {
        return;
      }
      setWaonGroupDataWithId(data);
    })();
    (async () => {
      const data = await getAllCate();
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

  // 削除ボタン
  function pushDeleteBtn(waonGroupId) {
    if (window.confirm("この和音グループを削除しますか？")) {
      deleteDoc(doc(db, "user", currentUser.email, "waonGroup", waonGroupId))
        .then(() => {
          alert("削除しました");
          refresh();
        })
        .catch((err) => {
          console.error(err);
          alert("削除に失敗しました");
        });
    }
  }

  async function refresh() {
    const newWaonGroupDataWithId = await getWaonGroupDataWithId();
    setWaonGroupDataWithId([...newWaonGroupDataWithId]);
  }

  // 編集ボタン
  function editGroup(id) {
    router.push("./add/" + id);
  }

  return (
    <Layout pageTitle="マイ和音">
      <main className="main">
        <div className="mainWrapper">
          <div className="wrapper">
            {waonGroupDataWithId.length === 0 && currentUser?.email !== GUEST_ID && (
              <p>画面右上の「和音登録」から和音を登録できます。</p>
            )}
            {currentUser?.email === GUEST_ID && (
              <p>
                ゲストログインではマイ和音の登録はできません。
                <br />
                プリセット再生のみとなります。
              </p>
            )}
            <div className="myWaonHeadBtns">
              <button
                className="btn-s"
                onClick={() => {
                  return router.push("preset");
                }}
              >
                プリセットの和音一覧
              </button>
              <button
                className="btn-s"
                onClick={() => {
                  return router.push("add");
                }}
              >
                新規登録
              </button>
            </div>
            <div className="myWaon">
              {waonGroupDataWithId.map((waonGroup) => {
                return (
                  <div key={waonGroup.waonGid} className="myWaon-gosen" data-containernum="${i}" data-id="${waonGid}">
                    <div className="myWaonBtns">
                      <div className="myWaonBtns-l">
                        <div className="myWaonBtns-btn">
                          <button
                            type="button"
                            className="btn-grad is-gray deleteBtn"
                            onClick={() => {
                              return pushDeleteBtn(waonGroup.waonGid);
                            }}
                          >
                            削除
                          </button>
                        </div>
                        <div className="myWaonBtns-btn">
                          <button
                            type="button"
                            className="btn-grad is-green editBtn"
                            onClick={() => {
                              return editGroup(waonGroup.waonGid);
                            }}
                          >
                            編集
                          </button>
                        </div>
                      </div>
                      <div className="myWaonBtns-r">
                        <div className="categoryIcon">{`${getTargetCateName(waonGroup.waonGroupData.category)}`}</div>
                      </div>
                    </div>
                    <div className="addMain">
                      <div className="addMain-inner">
                        <div className="addMain-gosen">
                          <Image src="/img/gosen-add.svg" fill alt="" />
                        </div>
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
                                  <button type="button" className="onpuContainer-item-opt-sound" onClick={playWaon}>
                                    <span className="onpuContainer-item-opt-sound-btn">♪</span>
                                  </button>
                                  <div className="onpuContainer-item-opt-code">{waon.code}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
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

export default Mypage;
