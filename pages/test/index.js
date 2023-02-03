// 全ての音符の雛形

// import Head from '../components/head';
import Layout from "../../components/layout";
import React, { useEffect } from "react";

export default function Test() {
  return (
    <Layout>
      <main className="main">
        <div className="mainWrapper">
          <h1 className="code">C9</h1>
          <div className="gosenContainer">
            <div className="gosenContainer-gosen">
              <img src="/img/gosen.svg" alt="" />
            </div>
            <div className="gosenContainer-toonkigou">
              <img src="/img/toonkigou.svg" alt="" />
            </div>
            <div className="gosenContainer-heonkigou">
              <img src="/img/heonkigou.svg" alt="" />
            </div>
            <div className="onpuContainer">
              {/* <div className="onpuContainer-item">
                <div className="onpuTama">
                  <span className="onpuTama-one" data-num="1"><img src="/img/onpu.svg" alt="ド" /></span>
                  <span className="onpuTama-one" data-num="2"><img src="/img/onpu.svg" alt="シ" /></span>
                  <span className="onpuTama-one" data-num="3"><img src="/img/onpu.svg" alt="ラ" /></span>
                  <span className="onpuTama-one" data-num="4"><img src="/img/onpu.svg" alt="ソ" /></span>
                  <span className="onpuTama-one" data-num="5"><img src="/img/onpu.svg" alt="ファ" /></span>
                  <span className="onpuTama-one" data-num="6"><img src="/img/onpu.svg" alt="ミ" /></span>
                  <span className="onpuTama-one" data-num="7"><img src="/img/onpu.svg" alt="レ" /></span>
                  <span className="onpuTama-one" data-num="8"><img src="/img/onpu.svg" alt="ド" /></span>
                  <span className="onpuTama-one" data-num="9"><img src="/img/onpu.svg" alt="シ" /></span>
                  <span className="onpuTama-one" data-num="10"><img src="/img/onpu.svg" alt="ラ" /></span>
                  <span className="onpuTama-one" data-num="11"><img src="/img/onpu.svg" alt="ソ" /></span>
                  <span className="onpuTama-one" data-num="12"><img src="/img/onpu.svg" alt="ファ" /></span>
                  <span className="onpuTama-one" data-num="13"><img src="/img/onpu.svg" alt="ミ" /></span>
                  <span className="onpuTama-one" data-num="14"><img src="/img/onpu.svg" alt="レ" /></span>
                  <span className="onpuTama-one" data-num="15"><img src="/img/onpu.svg" alt="ド" /></span>
                  <span className="onpuTama-one" data-num="16"><img src="/img/onpu.svg" alt="シ" /></span>
                  <span className="onpuTama-one" data-num="17"><img src="/img/onpu.svg" alt="ラ" /></span>
                  <span className="onpuTama-one" data-num="18"><img src="/img/onpu.svg" alt="ソ" /></span>
                </div>
                <div className="onpuLine">
                  <span className="onpuLine-item is-top1"></span>
                  <span className="onpuLine-item is-top2"></span>
                  <span className="onpuLine-item is-bottom1"></span>
                  <span className="onpuLine-item is-bottom2"></span>
                </div>
              </div> */}
              <div className="onpuContainer-item">
                <div className="onpuContainer-item-parts is-righthand">
                  <div className="onpuTama">
                    <span className="onpuTama-one" data-num="1">
                      <img src="/img/onpu.svg" alt="ド" />
                    </span>
                    <span className="onpuTama-one" data-num="2">
                      <img src="/img/onpu.svg" alt="シ" />
                    </span>
                    <span className="onpuTama-one" data-num="3">
                      <img src="/img/onpu.svg" alt="ラ" />
                    </span>
                    <span className="onpuTama-one" data-num="5">
                      <img src="/img/onpu.svg" alt="ファ" />
                    </span>
                    <span className="onpuTama-one" data-num="7">
                      <img src="/img/onpu.svg" alt="レ" />
                    </span>
                    <span className="onpuTama-one" data-num="8">
                      <img src="/img/onpu.svg" alt="ド" />
                    </span>
                  </div>
                  <OnpuLine />
                </div>
                <div className="onpuContainer-item-parts is-lefthand">
                  <div className="onpuTama">
                    <span className="onpuTama-one" data-num="19">
                      <img src="/img/onpu.svg" alt="レ" />
                    </span>
                    <span className="onpuTama-one" data-num="20">
                      <img src="/img/onpu.svg" alt="ド" />
                    </span>
                    <span className="onpuTama-one" data-num="21">
                      <img src="/img/onpu.svg" alt="シ" />
                    </span>
                    <span className="onpuTama-one" data-num="22">
                      <img src="/img/onpu.svg" alt="ラ" />
                    </span>
                    <span className="onpuTama-one" data-num="23">
                      <img src="/img/onpu.svg" alt="ソ" />
                    </span>
                    <span className="onpuTama-one" data-num="24">
                      <img src="/img/onpu.svg" alt="ファ" />
                    </span>
                    <span className="onpuTama-one" data-num="25">
                      <img src="/img/onpu.svg" alt="ミ" />
                    </span>
                    <span className="onpuTama-one" data-num="26">
                      <img src="/img/onpu.svg" alt="レ" />
                    </span>
                    <span className="onpuTama-one" data-num="27">
                      <img src="/img/onpu.svg" alt="ド" />
                    </span>
                    <span className="onpuTama-one" data-num="28">
                      <img src="/img/onpu.svg" alt="シ" />
                    </span>
                    <span className="onpuTama-one" data-num="29">
                      <img src="/img/onpu.svg" alt="ラ" />
                    </span>
                    <span className="onpuTama-one" data-num="30">
                      <img src="/img/onpu.svg" alt="ソ" />
                    </span>
                    <span className="onpuTama-one" data-num="31">
                      <img src="/img/onpu.svg" alt="ファ" />
                    </span>
                    <span className="onpuTama-one" data-num="32">
                      <img src="/img/onpu.svg" alt="ミ" />
                    </span>
                  </div>
                  <OnpuLine />
                </div>
              </div>
              <div className="onpuContainer-item">
                <div className="onpuContainer-item-parts is-righthand">
                  <div className="onpuTama">
                    <span className="onpuTama-one" data-num="11">
                      <img src="/img/onpu.svg" alt="ソ" />
                    </span>
                    <span className="onpuTama-one" data-num="13">
                      <img src="/img/onpu.svg" alt="ミ" />
                    </span>
                    <span className="onpuTama-one" data-num="14">
                      <img src="/img/onpu.svg" alt="レ" />
                    </span>
                    <span className="onpuTama-one" data-num="15">
                      <img src="/img/onpu.svg" alt="ド" />
                    </span>
                    <span className="onpuTama-one" data-num="16">
                      <img src="/img/onpu.svg" alt="シ" />
                    </span>
                    <span className="onpuTama-one" data-num="17">
                      <img src="/img/onpu.svg" alt="ラ" />
                    </span>
                    <span className="onpuTama-one" data-num="18">
                      <img src="/img/onpu.svg" alt="ソ" />
                    </span>
                  </div>
                  <OnpuLine />
                </div>
                <div className="onpuContainer-item-parts is-lefthand">
                  <div className="onpuTama">
                    <span className="onpuTama-one" data-num="26">
                      <img src="/img/onpu.svg" alt="レ" />
                    </span>
                    <span className="onpuTama-one" data-num="30">
                      <img src="/img/onpu.svg" alt="ソ" />
                    </span>
                    <span className="onpuTama-one" data-num="32">
                      <img src="/img/onpu.svg" alt="ミ" />
                    </span>
                  </div>
                  <OnpuLine />
                </div>
              </div>
            </div>
          </div>
          <div className="startBtn">
            <span className="btn-green">スタート</span>
          </div>
        </div>
      </main>

      <style jsx>
        {`
          .gosenContainer {
            width: 100%;
            padding: 8.3% 0;
          }
          .code {
            width: 100%;
            margin-bottom: 60px;
            font-size: 10rem;
            font-weight: bold;
            text-align: center;
          }
          .gosenContainer {
            position: relative;
            &-toonkigou {
              position: absolute;
              left: 6%;
              top: 13%;
              width: 6%;
            }
            &-heonkigou {
              position: absolute;
              left: 6%;
              top: 60%;
              width: 7%;
            }
          }
          .startBtn {
            position: fixed;
            top: 50px;
            right: 40px;
          }
        `}
      </style>
    </Layout>
  );
}
