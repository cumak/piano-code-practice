import * as Tone from "tone";

import { TONE_DATA } from "@/constants";

// ♪マーク押して音再生
export async function playWaon(e) {
  await Tone.start(); // ipadで音が出ないので、最初にトリガーを発火させる
  const target = e.target;
  const container = target.closest(".onpuContainer-item");
  const onpus = container.querySelectorAll(".onpuTama-one");
  const codeNameArr = [...onpus].map((onpu) => {
    const sharp = onpu.classList.contains("is-sharp") ? "#" : "";
    const flat = onpu.classList.contains("is-flat") ? "b" : "";
    const datanumber = onpu.dataset.num;
    const codeName = TONE_DATA[datanumber][0] + sharp + flat + TONE_DATA[datanumber][1];
    return codeName;
  });

  tonePlay(codeNameArr);
}

function tonePlay(codeNameArr) {
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
    sampler?.triggerAttackRelease(codeNameArr, 1.5);
  });
}
