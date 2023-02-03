import toneData from "./toneData";

/* itemエリアに和音を追加する  */
export const appendWaon = (item, theWaoninfo) => {
  let onpuTamaRight = item.querySelector(".is-righthand .onpuTama");
  let onpuTamaLeft = item.querySelector(".is-lefthand .onpuTama");
  let waons = theWaoninfo.waons;

  waons.sort(function (a, b) {
    return a - b;
  });
  waons.forEach((waon) => {
    const num = waon.num;
    let kigou;
    if (waon.sharp) {
      kigou = "is-sharp";
    }
    if (waon.flat) {
      kigou = "is-flat";
    }
    const onpuHtml = `<span class="onpuTama-one js-onpuslide-one ${kigou}" data-num="${num}">
          <img src="/img/onpu.svg" alt="${toneData[num][0]}" />
        </span>`;
    if (toneData[num][2] === "R") {
      onpuTamaRight.insertAdjacentHTML("beforeend", onpuHtml);
    } else {
      onpuTamaLeft.insertAdjacentHTML("beforeend", onpuHtml);
    }
  });
};
