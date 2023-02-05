import toneData from "./toneData";

/* itemエリアに和音を追加する  */
export const appendWaon = (item, notes) => {
  let onpuTamaRight = item.querySelector(".is-righthand .onpuTama");
  let onpuTamaLeft = item.querySelector(".is-lefthand .onpuTama");

  notes.sort(function (a, b) {
    return a - b;
  });
  notes.forEach((note) => {
    const num = note.num;
    let kigou;
    if (note.sharp) {
      kigou = "is-sharp";
    }
    if (note.flat) {
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
