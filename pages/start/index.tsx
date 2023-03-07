import { Layout } from "@components/Layout";
import { CategoryOption } from "components/CategoryOption";
import { ToggleBtn } from "components/Togglebtn";
import Image from "next/image";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

import type { GetWaonGroupDataWithId, WaonGroup } from "@/assets/js/GetFromDB";
import { getWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import { onpuSlide } from "@/assets/js/OnpuSlide";

const Start: FC = () => {
  const codeRef = useRef<HTMLDivElement>(null);
  const onpuContainerRef = useRef<HTMLDivElement>(null);

  const [isShuffle, setIsShuffle] = useState(false);
  //ロードした和音グループ(カテゴリフィルター前を記憶)
  const [waonsGroupMoto, setWaonsGroupMoto] = useState<GetWaonGroupDataWithId>();
  //ロードした和音とコード(シャッフル前を記憶)
  const [waonsArrMoto, setWaonsArrMoto] = useState<GetWaonGroupDataWithId>();
  //ロードした和音とコード
  const [waonsArr, setWaonsArr] = useState<GetWaonGroupDataWithId>();
  // アニメーションで表示されている和音とコード
  const [currentWaonGroup, setCurrentWaonGroup] = useState<WaonGroup>();

  const [btnStartOrStop, setbtnStartOrStop] = useState<"start" | "stop">("start");
  const [selectedCateId, setSelectedCateId] = useState<string>("default");
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [qaTimer, setQaTimer] = useState<NodeJS.Timer>();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    categoryChange();
  }, [selectedCateId]);

  useEffect(() => {
    if (isShuffle) {
      const shufflewaon = shuffle(waonsArr);
      setWaonsArr(shufflewaon);
    } else {
      setWaonsArr(waonsArrMoto);
    }
  }, [isShuffle]);

  async function init() {
    const waonInfo = await loadWaon();
    setWaonsArr(waonInfo);
    setWaonsArrMoto(waonInfo);
    setCurrentWaonGroup(waonInfo?.[0]?.waonGroupData.waons);
  }

  async function loadWaon() {
    const waonGroupDataWithId = await getWaonGroupDataWithId();
    setWaonsGroupMoto(waonGroupDataWithId);
    const filterdWaonGroupData = getCateFilteredWaon(waonGroupDataWithId);
    return filterdWaonGroupData;
  }

  function shuffle([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function play() {
    if (!waonsArr) {
      return;
    }
    if (!waonsArr.length) {
      alert("このカテゴリーの和音は登録されていません。");
      return;
    }
    const qEl = document.getElementById("qTime") as HTMLInputElement;
    const aEl = document.getElementById("aTime") as HTMLInputElement;
    const qTime = qEl.value;
    const aTime = aEl.value;
    const allTime = parseInt(qTime) + parseInt(aTime);
    scrollToCenter();

    let i = 0;

    setbtnStartOrStop("stop");
    // メッセージをだす
    msgShow("Start!", 1000);

    const timer = setInterval(() => {
      start(qTime, aTime);
    }, allTime);
    setTimer(timer);

    start(qTime, aTime);

    function start(qTime, aTime) {
      if (!codeRef.current) {
        return false;
      }
      codeRef.current.style.opacity = "1";
      onpuContainerRef.current.style.opacity = "0";
      setCurrentWaonGroup(waonsArr[i].waonGroupData as WaonGroup);
      const qaTimer = setTimeout(() => {
        i++;
        onpuSlide();
        onpuContainerRef.current.style.opacity = "1";
        // 最後のループ
        if (i === waonsArr.length) {
          clearInterval(timer);
          clearInterval(qaTimer);
          setTimeout(() => {
            stop();
          }, aTime);
        }
      }, qTime);
      setQaTimer(qaTimer);
    }
  }

  function msgShow(msg, time) {
    const msgBox = document.querySelector(".msgBox");
    msgBox.innerHTML = msg;
    msgBox.classList.add("is-show");
    setTimeout(() => {
      msgBox.classList.remove("is-show");
    }, time);
  }

  function stop() {
    clearInterval(timer);
    clearInterval(qaTimer);
    codeRef.current.style.opacity = "0";
    onpuContainerRef.current.style.opacity = "0";
    setbtnStartOrStop("start");
  }

  async function categoryChange() {
    if (!waonsGroupMoto) {
      return;
    }
    const filterdWaonGroupData = getCateFilteredWaon(waonsGroupMoto);

    const shuffleWaonGroupData = isShuffle ? shuffle(filterdWaonGroupData) : filterdWaonGroupData;
    setWaonsArr([...shuffleWaonGroupData]);
  }

  function getCateFilteredWaon(arr: GetWaonGroupDataWithId) {
    if (selectedCateId === "default") {
      return arr;
    }
    const filterdWg = arr?.filter((wg) => {
      return wg.waonGroupData.category === selectedCateId;
    });
    return filterdWg;
  }

  function scrollToCenter() {
    const rect = codeRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const position = rect.top + scrollTop - 20;
    window.scrollTo(0, position);
  }

  return (
    <Layout>
      <main className="main startPage">
        <div className="mainWrapper">
          <div className="userSetting">
            <div className="userSetting-one">
              <div className="userSetting-one-label">Q：</div>
              <select id="qTime">
                <option value="2000">2秒</option>
                <option value="4000">4秒</option>
                <option value="6000">6秒</option>
                <option value="8000">8秒</option>
                <option value="10000">10秒</option>
              </select>
            </div>
            <div className="userSetting-one">
              <div className="userSetting-one-label">A：</div>
              <select id="aTime">
                <option value="2000">2秒</option>
                <option value="4000">4秒</option>
                <option value="6000">6秒</option>
                <option value="8000">8秒</option>
                <option value="10000">10秒</option>
              </select>
            </div>
            <div className="userSetting-one">
              <div className="userSetting-one-label">シャッフル</div>
              <div className="shuffleBtn">
                <ToggleBtn action={setIsShuffle} />
              </div>
            </div>
            <div className="userSetting-one">
              <div className="userSetting-one-label">カテゴリー</div>
              <CategoryOption
                disabled={false}
                firstLabel="すべて"
                setSelectedCateId={setSelectedCateId}
                defaultId={selectedCateId}
              />
            </div>
          </div>
          <div className="code" ref={codeRef}>
            {currentWaonGroup?.waons?.map((waon) => {
              return (
                <span key={waon.index} className="code-one">
                  {waon.code}
                </span>
              );
            })}
          </div>
          <div className="gosenContainer">
            <div className="gosenContainer-gosen">
              <Image src="/img/gosen.svg" alt="" fill />
            </div>
            <div className="onpuContainer" ref={onpuContainerRef}>
              {currentWaonGroup?.waons?.map((waon) => {
                return (
                  <div key={waon.index} className="onpuContainer-item">
                    <div className="onpuContainer-item-main">
                      <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                        <div className="onpuTama">
                          {waon.notes?.map((onpu, noteIndex) => {
                            return (
                              onpu.num <= 18 && (
                                <span
                                  key={onpu.num}
                                  className={`onpuTama-one js-onpuslide-one ${onpu.sharp ? "is-sharp" : ""} ${
                                    onpu.flat ? "is-flat" : ""
                                  }`}
                                  role="button"
                                  tabIndex={noteIndex as number}
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
                          {waon.notes?.map((onpu, noteIndex) => {
                            return (
                              onpu.num >= 19 && (
                                <span
                                  key={onpu.num}
                                  className={`onpuTama-one js-onpuslide-one ${onpu.sharp ? "is-sharp" : ""} ${
                                    onpu.flat ? "is-flat" : ""
                                  }`}
                                  role="button"
                                  tabIndex={noteIndex as number}
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
                  </div>
                );
              })}
            </div>
          </div>
          <div className="startBtn">
            {btnStartOrStop === "start" && (
              <button id="startbtn" className="btn-big is-blue" onClick={play}>
                スタート
              </button>
            )}
            {btnStartOrStop === "stop" && (
              <button id="stopbtn" className="btn-big is-green" onClick={stop}>
                ストップ
              </button>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Start;
