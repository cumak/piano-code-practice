// import Head from 'next/head'
import Head from "components/head";
import Layout from "components/layout";
import { onpuSlide } from "assets/js/OnpuSlide";
import * as Tone from "tone";
import toneData from "assets/js/toneData";
import React, { useEffect } from "react";

export default function Add() {
  useEffect(() => {
    onpuSlide();
  });

  function playWaon(e) {
    const target = e.target;
    const container = target.closest(".onpuContainer-item");
    const onpus = container.querySelectorAll(".onpuTama-one");
    const codeNameArr = [...onpus].map((onpu) => {
      const sharp = onpu.classList.contains("is-sharp") ? "#" : "";
      const flat = onpu.classList.contains("is-flat") ? "#" : "";
      const datanumber = onpu.dataset.num;
      const codeName =
        toneData[datanumber][0] + sharp + flat + toneData[datanumber][1];
      return codeName;
    });

    const sampler = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(codeNameArr, 1.5);
    });
  }

  return (
    <Layout>
      <Head title={"登録画面|コード練習アプリ"} />

      <main className="main">
        <div className="mainWrapper">
          <h1 className="title-l">問題登録</h1>
          <div className="selectGosenContainer">
            <div className="selectGosenContainer-gosen">
              <img src="/img/gosen-long.svg" alt="" />
            </div>
            <div className="selectOnpuContainer">
              <div className="selectOnpuContainer-item">
                <div className="selectOnpuContainer-item-main">
                  <div className="selectOnpuContainer-item-main-parts is-righthand">
                    <div className="selectOnpuTama">
                      <span className="selectOnpuTama-one" data-num="1">
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="2">
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="3">
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="4">
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="5">
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="6">
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="7">
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="8">
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="9">
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="10">
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="11">
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="12">
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="13">
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="14">
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="15">
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="16">
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="17">
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="18">
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                    </div>
                  </div>
                  <div className="selectOnpuContainer-item-main-parts is-lefthand">
                    <div className="selectOnpuTama">
                      <span className="selectOnpuTama-one" data-num="19">
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="20">
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="21">
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="22">
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="23">
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="24">
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="25">
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="26">
                        <img src="/img/onpu.svg" alt="レ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="27">
                        <img src="/img/onpu.svg" alt="ド" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="28">
                        <img src="/img/onpu.svg" alt="シ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="29">
                        <img src="/img/onpu.svg" alt="ラ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="30">
                        <img src="/img/onpu.svg" alt="ソ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="31">
                        <img src="/img/onpu.svg" alt="ファ" />
                      </span>
                      <span className="selectOnpuTama-one" data-num="32">
                        <img src="/img/onpu.svg" alt="ミ" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottomArea">
            <div className="bottomArea-l">
              <div className="addMain">
                <div className="addMain-inner">
                  <div className="addMain-gosen">
                    <img src="/img/gosen-add.svg" alt="" />
                  </div>
                  {/* 決定した和音 */}
                  <div className="onpuContainer">
                    <div className="onpuContainer-item">
                      <div className="onpuContainer-item-main">
                        <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                          <div className="onpuTama">
                            {/* <span className="onpuTama-one js-onpuslide-one" data-num="1"><img src="/img/onpu.svg" alt="ド" /></span> */}
                            {/* <span className="onpuTama-one js-onpuslide-one" data-num="2"><img src="/img/onpu.svg" alt="シ" /></span> */}
                            {/* <span className="onpuTama-one js-onpuslide-one" data-num="3"><img src="/img/onpu.svg" alt="ラ" /></span> */}
                            {/* <span className="onpuTama-one js-onpuslide-one" data-num="4"><img src="/img/onpu.svg" alt="ソ" /></span> */}
                            {/* <span className="onpuTama-one js-onpuslide-one" data-num="5"><img src="/img/onpu.svg" alt="ファ" /></span> */}
                            <span
                              className="onpuTama-one js-onpuslide-one"
                              data-num="6"
                            >
                              <img src="/img/onpu.svg" alt="ミ" />
                            </span>
                            <span
                              className="onpuTama-one js-onpuslide-one"
                              data-num="7"
                            >
                              <img src="/img/onpu.svg" alt="レ" />
                            </span>
                            <span
                              className="onpuTama-one js-onpuslide-one is-sharp"
                              data-num="11"
                            >
                              <img src="/img/onpu.svg" alt="ソ" />
                            </span>
                          </div>
                          <div className="onpuContainer-item-main">
                            <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                              <div className="onpuTama"></div>
                              <div className="onpuLine">
                                <span className="onpuLine-item is-top1"></span>
                                <span className="onpuLine-item is-top2"></span>
                                <span className="onpuLine-item is-bottom1"></span>
                                <span className="onpuLine-item is-bottom2"></span>
                              </div>
                            </div>
                            <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
                              <div className="onpuTama"></div>
                              <div className="onpuLine">
                                <span className="onpuLine-item is-top1"></span>
                                <span className="onpuLine-item is-top2"></span>
                                <span className="onpuLine-item is-bottom1"></span>
                                <span className="onpuLine-item is-bottom2"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
                          <div className="onpuTama">
                            <span
                              className="onpuTama-one js-onpuslide-one"
                              data-num="26"
                            >
                              <img src="/img/onpu.svg" alt="レ" />
                            </span>
                            <span
                              className="onpuTama-one js-onpuslide-one"
                              data-num="32"
                            >
                              <img src="/img/onpu.svg" alt="ミ" />
                            </span>
                          </div>
                          <div className="onpuContainer-item-main">
                            <div className="onpuContainer-item-main-parts is-righthand js-onpuslide">
                              <div className="onpuTama"></div>
                              <div className="onpuLine">
                                <span className="onpuLine-item is-top1"></span>
                                <span className="onpuLine-item is-top2"></span>
                                <span className="onpuLine-item is-bottom1"></span>
                                <span className="onpuLine-item is-bottom2"></span>
                              </div>
                            </div>
                            <div className="onpuContainer-item-main-parts is-lefthand js-onpuslide">
                              <div className="onpuTama"></div>
                              <div className="onpuLine">
                                <span className="onpuLine-item is-top1"></span>
                                <span className="onpuLine-item is-top2"></span>
                                <span className="onpuLine-item is-bottom1"></span>
                                <span className="onpuLine-item is-bottom2"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="onpuContainer-item-opt">
                        <div className="onpuContainer-item-opt-code">
                          <input type="text" />
                        </div>
                        <div className="onpuContainer-item-opt-sound">
                          <button
                            className="onpuContainer-item-opt-sound-btn"
                            onClick={playWaon}
                          >
                            ♪
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="actionArea">
              <div className="actionBtns">
                <div className="actionBtns-row">
                  <div className="btn-grad is-yellow">和音追加</div>
                </div>
                <div className="actionBtns-row">
                  <div className="btn-grad is-gray">
                    <img src="/img/sharp.svg" alt="" />
                  </div>
                  <div className="btn-grad is-gray">
                    <img src="/img/flat.svg" alt="" />
                  </div>
                </div>
                <div className="actionBtns-row">
                  <div className="btn-grad is-green">和音削除</div>
                  <div className="btn-grad is-green">音符削除</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="registerBtn">
          <a className="btn-big is-blue">登録する</a>
        </div>
      </main>
    </Layout>
  );
}
