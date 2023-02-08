// 「問題登録」で和音追加ボタンを押した時
// 「Mypage」で登録している和音をロードする時

import * as Tone from "tone";

import toneData from "./toneData";

// addEdit＝>和音を選択できるようにする
// addPlay=>playボタンを作る
// waonAreaSelect=>和音を追加した後に、和音エリアをselectにするかどうか
export const createWaonArea = (args) => {
  // 引数の初期値
  const onpuContainer = args.onpuContainer ?? "";
  const addEdit = args.addEdit ?? false;
  const addPlay = args.addPlay ?? false;
  const waonAreaSelect = args.waonAreaSelect ?? true;

  // アイテム作成
  const containerItem = document.createElement("div");
  containerItem.classList.add("onpuContainer-item");
  // アイテムの中身を作成
  const containerMainHtml = `
      <div class="onpuContainer-item-main">
        <div class="onpuContainer-item-main-parts is-righthand js-onpuslide">
          <div class="onpuTama"></div>
          <div class="onpuLine">
            <span class="onpuLine-item is-top1"></span>
            <span class="onpuLine-item is-top2"></span>
            <span class="onpuLine-item is-bottom1"></span>
            <span class="onpuLine-item is-bottom2"></span>
          </div>
        </div>
        <div class="onpuContainer-item-main-parts is-lefthand js-onpuslide">
          <div class="onpuTama"></div>
          <div class="onpuLine">
            <span class="onpuLine-item is-top1"></span>
            <span class="onpuLine-item is-top2"></span>
            <span class="onpuLine-item is-bottom1"></span>
            <span class="onpuLine-item is-bottom2"></span>
          </div>
        </div>
      </div>
    `;
  containerItem.insertAdjacentHTML("beforeend", containerMainHtml);
  const containerItemMain = containerItem.querySelector(
    ".onpuContainer-item-main"
  );

  if (addEdit) {
    // イベントリスナを追加
    containerItemMain.addEventListener("click", selectWaonArea);
  }
  onpuContainer.append(containerItem);

  // コードのinputとプレイボタンがいる場合
  if (addPlay) {
    // コード名と再生ボタンのHtmlを追加
    const optHtml = `
      <div class="onpuContainer-item-opt">
        <div class="onpuContainer-item-opt-code">
          <input type="text" name="code" />
        </div>
        <div class="onpuContainer-item-opt-sound">
          <button class="onpuContainer-item-opt-sound-btn" type="button">♪</button>
        </div>
      </div>
    `;
    containerItem.insertAdjacentHTML("beforeend", optHtml);

    // 再生ボタンイベントリスナ追加
    const playBtnWrapHtml = containerItem.querySelector(
      ".onpuContainer-item-opt-sound"
    );
    playBtnWrapHtml.addEventListener("click", playWaon);
  }
  // 「和音登録」画面で最初に「和音追加」をしたときにそれを選択状態にする
  if (addEdit && waonAreaSelect) {
    selectWaonArea(containerItemMain);
  }
};

// 和音エリアを選択→is-selectクラスをつける
// param .onpuContainer-item-main
function selectWaonArea(e) {
  const target = e.type ? e.target.parentNode : e.parentNode;
  target.classList.toggle("is-select");
  // is-selectが追加された時
  if (target.classList.contains("is-select")) {
    // 他のitemはselectを解除
    const items = document.querySelectorAll(".onpuContainer-item.is-select");
    [...items].forEach((e) => {
      if (e != target) e.classList.remove("is-select");
    });
  }
}

// ♪マーク押して音再生
function playWaon(e) {
  const target = e.target;
  const container = target.closest(".onpuContainer-item");
  const onpus = container.querySelectorAll(".onpuTama-one");
  const codeNameArr = [...onpus].map((onpu) => {
    const sharp = onpu.classList.contains("is-sharp") ? "#" : "";
    const flat = onpu.classList.contains("is-flat") ? "b" : "";
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
