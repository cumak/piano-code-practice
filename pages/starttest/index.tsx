import React, { useEffect, FC, useState, useRef } from "react";
import { useRouter } from "next/router";

import Head from "../../components/head";
import Layout from "../../components/layout";
import ToggleBtn from "../../components/togglebtn";
import { onpuSlide } from "../../assets/js/OnpuSlide";
import { createWaonArea } from "../../assets/js/CreateWaonArea";
import { appendWaon } from "../../assets/js/AppendWaon";
import msgBox from "../../assets/js/MsgBox";
import { getWaonGroupFields, getWaonFields } from "../../assets/js/GetFromDB";
import type {
  GetWaonGroupFields,
  GetWaonFields,
} from "../../assets/js/GetFromDB";
import CategoryOption from "../../components/categoryOption";

import { auth } from "../../src/utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const Start: FC = (props: any) => {
  const router = useRouter();
  let timer, qaTimer;

  const categorySelectRef = useRef<HTMLSelectElement>(null);

  const [shuffleBtnCheck, setShuffleBtnCheck] = useState(false);
  const [waonsGroupMoto, setWaonsGroupMoto] = useState<GetWaonGroupFields>(); //ロードした和音グループ(カテゴリフィルター前を記憶)
  const [waonsMoto, setwaonsMoto] = useState<GetWaonFields>(); //ロードした和音とコード(シャッフル前を記憶)
  const [waons, setwaons] = useState<GetWaonFields>(); //ロードした和音とコード

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login/");
      } else {
        init();
      }
    });
  }, []);
  useEffect(() => {
    if (shuffleBtnCheck) {
      const shufflewaon: any = shuffle(waons);
      setwaons(shufflewaon);
    } else {
      setwaons(waonsMoto);
    }
  }, [shuffleBtnCheck]);

  async function init() {
    const waonInfo: GetWaonFields = await loadWaon();
    setwaons(waonInfo);
    setwaonsMoto(waonInfo);
  }

  function shuffle([...array]) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function play() {
    const qEl = document.getElementById("qTime") as HTMLInputElement;
    const aEl = document.getElementById("aTime") as HTMLInputElement;
    const qTime = qEl.value;
    const aTime = aEl.value;
    const allTime = parseInt(qTime) + parseInt(aTime);
    scrollToFooter();

    let i = 0;

    // スタートボタンをストップに
    const startbtn = document.getElementById("startbtn");
    const stopbtn = document.getElementById("stopbtn");
    startbtn.style.display = "none";
    stopbtn.style.display = "flex";
    // メッセージをだす
    msgBox("Start!", 1000);

    timer = setInterval(function () {
      start(qTime);
    }, allTime);

    start(qTime);

    function start(qTime) {
      containerReset();
      loadTheCode(waons[i]);
      qaTimer = setTimeout(function () {
        loadTheWaon(waons[i]);
        i++;
        // 最後のループ
        if (i === waons.length) {
          clearInterval(timer);
          clearInterval(qaTimer);
          setTimeout(function () {
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

  function getCateFilteredWaon(userWaonGroupField: GetWaonGroupFields) {
    // カテゴリーvalue取得し、カテゴリーでフィルター
    // const cateEl = document.getElementById(
    //   "categorySelect"
    // ) as HTMLInputElement;
    const cateId = categorySelectRef?.current?.value;

    if (cateId === "default") {
      return userWaonGroupField;
    }
    const filterdWg = userWaonGroupField.filter((wg) => {
      return wg.field.category === cateId;
    });
    return filterdWg;
  }

  async function getWaonsFromWg(
    currentUser: firebase.User,
    waonGroup: GetWaonGroupFields
  ) {
    return Promise.all(
      waonGroup.map(async function (e) {
        // 各和音グループのコードと和音を取得
        const waonGroupDoc = e.main;

        return await getWaonFields(currentUser, waonGroupDoc);
      })
    ).then((waonInfo: GetWaonFields) => {
      return waonInfo;
    });
  }

  async function loadWaon() {
    const currentUser = firebase.auth().currentUser;
    const userWaonGroupField = await getWaonGroupFields(currentUser);
    setWaonsGroupMoto(userWaonGroupField);

    const waonGroup = getCateFilteredWaon(userWaonGroupField);
    const waonInfo = await getWaonsFromWg(currentUser, waonGroup);
    return waonInfo;
  }

  async function categoryChange() {
    const currentUser = firebase.auth().currentUser;
    const waonGroup = getCateFilteredWaon(waonsGroupMoto);
    const waonInfo = await getWaonsFromWg(currentUser, waonGroup);
    setwaons(waonInfo);
    setwaonsMoto(waonInfo);
  }

  function containerReset() {
    const onpuContainer = document.querySelector(".onpuContainer");
    const codeWrap = document.querySelector(".code");
    while (onpuContainer.firstChild) {
      onpuContainer.removeChild(onpuContainer.firstChild);
    }
    while (codeWrap.firstChild) {
      codeWrap.removeChild(codeWrap.firstChild);
    }
  }

  // スタート後に和音を描画
  function loadTheWaon(waonsG) {
    const onpuContainer = document.querySelector(".onpuContainer");
    // 音符Itemごとの処理 waonsG->[{code:,waons:},{code:,waons:}]
    for (let j = 0; j < waonsG.length; j++) {
      createWaonArea({ onpuContainer: onpuContainer });
      const items = onpuContainer.querySelectorAll(".onpuContainer-item");
      const item = items[j];
      appendWaon(item, waonsG[j]);
    }
    onpuSlide();
  }

  // スタート後にコードを描画
  function loadTheCode(waonsG) {
    const codeWrap = document.querySelector(".code");
    for (let j = 0; j < waonsG.length; j++) {
      const codeDiv = document.createElement("div");
      codeDiv.classList.add("code-one");
      codeDiv.innerHTML = waonsG[j].code;
      codeWrap.append(codeDiv);
    }
  }

  function scrollToFooter() {
    const footerEl = document.getElementById("footer");
    const rect = footerEl.getBoundingClientRect();
    const position = rect.top;
    scrollTo(0, position);
  }

  return (
    <Layout>
      <Head title={"コード練習アプリ"} />
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
                <ToggleBtn propsFunc={setShuffleBtnCheck} />
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
          <div className="code">
            <div className="code-one">Cm7</div>
            <div className="code-one">F7</div>
            <div className="code-one">Bb6</div>
          </div>
          <div className="gosenContainer">
            <div className="gosenContainer-gosen">
              <img src="/img/gosen.svg" alt="" />
            </div>
            <div className="onpuContainer">
              <div className="onpuContainer-item">
                <div className="onpuContainer-item-main">
                  <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                    <div className="onpuTama">
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="1"
                      >
                        <img src="/img/onpu.svg" alt="C" />
                      </span>
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="4"
                      >
                        <img src="/img/onpu.svg" alt="G" />
                      </span>
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="14"
                      >
                        <img src="/img/onpu.svg" alt="D" />
                      </span>
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="18"
                      >
                        <img src="/img/onpu.svg" alt="G" />
                      </span>
                    </div>
                    <div className="onpuLine">
                      <span
                        className="onpuLine-item is-top1"
                        style={{ opacity: 1 }}
                      ></span>
                      <span
                        className="onpuLine-item is-top2"
                        style={{ opacity: 1 }}
                      ></span>
                      <span
                        className="onpuLine-item is-bottom1"
                        style={{ opacity: 1 }}
                      ></span>
                      <span
                        className="onpuLine-item is-bottom2"
                        style={{ opacity: 1 }}
                      ></span>
                    </div>
                  </div>
                  <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
                    <div className="onpuTama">
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="32"
                      >
                        <img src="/img/onpu.svg" alt="E" />
                      </span>
                    </div>
                    <div className="onpuLine">
                      <span className="onpuLine-item is-top1"></span>
                      <span className="onpuLine-item is-top2"></span>
                      <span
                        className="onpuLine-item is-bottom1"
                        style={{ opacity: 1 }}
                      ></span>
                      <span className="onpuLine-item is-bottom2"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="onpuContainer-item">
                <div className="onpuContainer-item-main">
                  <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                    <div className="onpuTama">
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="1"
                      >
                        <img src="/img/onpu.svg" alt="C" />
                      </span>
                    </div>
                    <div className="onpuLine">
                      <span
                        className="onpuLine-item is-top1"
                        style={{ opacity: 1 }}
                      ></span>
                      <span
                        className="onpuLine-item is-top2"
                        style={{ opacity: 1 }}
                      ></span>
                      <span className="onpuLine-item is-bottom1"></span>
                      <span className="onpuLine-item is-bottom2"></span>
                    </div>
                  </div>
                  <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
                    <div className="onpuTama">
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="19"
                      >
                        <img src="/img/onpu.svg" alt="D" />
                      </span>
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="21"
                      >
                        <img src="/img/onpu.svg" alt="B" />
                      </span>
                      <span
                        className="onpuTama-one js-onpuslide-one undefined"
                        data-num="32"
                      >
                        <img src="/img/onpu.svg" alt="E" />
                      </span>
                    </div>
                    <div className="onpuLine">
                      <span className="onpuLine-item is-top1"></span>
                      <span className="onpuLine-item is-top2"></span>
                      <span
                        className="onpuLine-item is-bottom1"
                        style={{ opacity: 1 }}
                      ></span>
                      <span className="onpuLine-item is-bottom2"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="startBtn">
            <span id="startbtn" className="btn-big is-blue" onClick={play}>
              スタート
            </span>
            <span id="stopbtn" className="btn-big is-green" onClick={stop}>
              ストップ
            </span>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Start;
