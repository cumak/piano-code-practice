import { CategoryOption } from "components/categoryOption";
import { Layout } from "components/layout";
import ToggleBtn from "components/togglebtn";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { auth } from "src/utils/firebase";

import { appendWaon } from "@/assets/js/AppendWaon";
import { createWaonArea } from "@/assets/js/CreateWaonArea";
import type { GetWaonGroupDataWithId, WaonGroup } from "@/assets/js/GetFromDB";
import { getWaonGroupDataWithId } from "@/assets/js/GetFromDB";
import msgBox from "@/assets/js/MsgBox";
import { onpuSlide } from "@/assets/js/OnpuSlide";

const Start: FC = () => {
  const router = useRouter();
  let timer, qaTimer;

  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const [isShuffle, setIsShuffle] = useState(false);
  const [waonsGroupMoto, setWaonsGroupMoto] =
    useState<GetWaonGroupDataWithId>(); //ロードした和音グループ(カテゴリフィルター前を記憶)
  const [waonsArrMoto, setWaonsArrMoto] = useState<GetWaonGroupDataWithId>(); //ロードした和音とコード(シャッフル前を記憶)
  const [waonsArr, setWaonsArr] = useState<GetWaonGroupDataWithId>(); //ロードした和音とコード

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login/");
      } else {
        if (!categorySelectRef) {
          return false;
        }
        init();
      }
    });
  }, [categorySelectRef]);
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
  }

  function shuffle([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function play() {
    if (!waonsArr.length) {
      alert("このカテゴリーの和音は登録されていません。");
      return false;
    }
    const qEl = document.getElementById("qTime") as HTMLInputElement;
    const aEl = document.getElementById("aTime") as HTMLInputElement;
    const qTime = qEl.value;
    const aTime = aEl.value;
    const allTime = parseInt(qTime) + parseInt(aTime);
    scrollToCenter();

    let i = 0;

    // スタートボタンをストップに
    const startbtn = document.getElementById("startbtn");
    const stopbtn = document.getElementById("stopbtn");
    startbtn.style.display = "none";
    stopbtn.style.display = "flex";
    // メッセージをだす
    msgBox("Start!", 1000);

    timer = setInterval(() => {
      start(qTime);
    }, allTime);

    start(qTime);

    function start(qTime) {
      containerReset();
      const waonGroup = waonsArr[i].waonGroupData as WaonGroup;
      loadTheCode(waonGroup);
      qaTimer = setTimeout(() => {
        loadTheWaon(waonGroup);
        i++;
        // 最後のループ
        if (i === waonsArr.length) {
          clearInterval(timer);
          clearInterval(qaTimer);
          setTimeout(() => {
            stop();
          }, qTime);
        }
      }, qTime);
    }
  }

  function stop() {
    clearInterval(timer);
    clearInterval(qaTimer);
    containerReset();
    // ストップボタンをスタートに
    const startbtn = document.getElementById("startbtn");
    const stopbtn = document.getElementById("stopbtn");
    startbtn.style.display = "flex";
    stopbtn.style.display = "none";
  }

  async function loadWaon() {
    const currentUser = auth.currentUser;
    const waonGroupDataWithId = await getWaonGroupDataWithId(currentUser);
    setWaonsGroupMoto(waonGroupDataWithId);
    const filterdWaonGroupData = getCateFilteredWaon(waonGroupDataWithId);
    return filterdWaonGroupData;
  }

  async function categoryChange() {
    let filterdWaonGroupData = getCateFilteredWaon(waonsGroupMoto);
    filterdWaonGroupData = isShuffle
      ? shuffle(filterdWaonGroupData)
      : filterdWaonGroupData;
    setWaonsArr(filterdWaonGroupData);
  }

  function getCateFilteredWaon(waonGroupDataWithId: GetWaonGroupDataWithId) {
    const cateId = categorySelectRef.current.value;

    if (cateId === "default") {
      return waonGroupDataWithId;
    }
    const filterdWg = waonGroupDataWithId.filter((wg) => {
      return wg.waonGroupData.category === cateId;
    });
    return filterdWg;
  }

  function containerReset() {
    const onpuContainer = document.querySelector(
      ".onpuContainer"
    ) as HTMLElement;
    const codeWrap = document.querySelector(".code") as HTMLElement;
    if (onpuContainer?.hasChildNodes()) {
      while (onpuContainer.firstChild) {
        onpuContainer.removeChild(onpuContainer.firstChild);
      }
    }
    if (codeWrap?.hasChildNodes()) {
      while (codeWrap.firstChild) {
        codeWrap.removeChild(codeWrap.firstChild);
      }
    }
  }

  // スタート後に和音を描画
  function loadTheWaon(waonGroup: WaonGroup) {
    const onpuContainer = document.querySelector(".onpuContainer");
    // 音符Itemごとの処理 waonsG->[{code:,waons:},{code:,waons:}]
    for (let j = 0; j < waonGroup.waons.length; j++) {
      createWaonArea({ onpuContainer: onpuContainer });
      const items = onpuContainer.querySelectorAll(".onpuContainer-item");
      const item = items[j];
      const notes = waonGroup.waons[j].notes;
      appendWaon(item, notes);
    }
    onpuSlide();
  }

  // スタート後にコードを描画
  function loadTheCode(waonGroup: WaonGroup) {
    const codeWrap = document.querySelector(".code");
    for (let j = 0; j < waonGroup.waons.length; j++) {
      const codeDiv = document.createElement("div");
      codeDiv.classList.add("code-one");
      codeDiv.innerHTML = waonGroup.waons[j].code;
      codeWrap.append(codeDiv);
    }
  }

  function scrollToCenter() {
    const rect = codeRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const position = rect.top + scrollTop;
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
                <ToggleBtn propsFunc={setIsShuffle} />
              </div>
            </div>
            <div className="userSetting-one">
              <div className="userSetting-one-label">カテゴリー</div>
              <CategoryOption
                disabled={false}
                defaultLable="すべて"
                selectRef={categorySelectRef}
                onChange={categoryChange}
              />
            </div>
          </div>
          <div className="code" ref={codeRef}></div>
          <div className="gosenContainer">
            <div className="gosenContainer-gosen">
              <img src="/img/gosen.svg" alt="" />
            </div>
            <div className="onpuContainer"></div>
          </div>
          <div className="startBtn">
            <button id="startbtn" className="btn-big is-blue" onClick={play}>
              スタート
            </button>
            <button id="stopbtn" className="btn-big is-green" onClick={stop}>
              ストップ
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Start;
