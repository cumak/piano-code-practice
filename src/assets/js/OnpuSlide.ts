export const onpuSlide = () => {
  const parts = document.querySelectorAll(".js-onpuslide");
  parts.forEach((part) => {
    // 右にスライドする音符にクラスをつける
    const tamas = [...part.querySelectorAll(".js-onpuslide-one")].reverse() as HTMLElement[]; //次の要素にis-slideがあるかどうかを判定するところがあるので、後ろの要素から処理してis-slideをつけておく
    const line1 = part.querySelector(".onpuLine-item.is-top1") as HTMLElement;
    const line2 = part.querySelector(".onpuLine-item.is-top2") as HTMLElement;
    const line3 = part.querySelector(".onpuLine-item.is-bottom1") as HTMLElement;
    const line4 = part.querySelector(".onpuLine-item.is-bottom2") as HTMLElement;

    resetLine();
    function resetLine() {
      line1.style.opacity = "0";
      line2.style.opacity = "0";
      line3.style.opacity = "0";
      line4.style.opacity = "0";
      line1.classList.remove("is-long");
      line2.classList.remove("is-long");
      line3.classList.remove("is-long");
      line4.classList.remove("is-long");
    }

    tamas.forEach((tama) => {
      // 初期化
      tama.classList.remove("is-slide");
      const num = parseInt(tama.dataset.num);
      const nextTama = tama.nextSibling as HTMLElement;
      if (nextTama) {
        const nextTamaNum = parseInt(nextTama.dataset.num);

        if (num + 1 === nextTamaNum) {
          // ラインがちょっと伸びる場合
          if (num === 2) {
            line2.classList.add("is-long");
          }
          if (num === 15) {
            line3.classList.add("is-long");
          }
          if (num === 17) {
            line4.classList.add("is-long");
          }
          // スライドクラス付与
          if (!nextTama.classList.contains("is-slide")) {
            tama.classList.add("is-slide");
          }
        }
      }
      // 音符の横線追加
      if (num === 1) {
        line1.style.opacity = "1";
      }
      if (num <= 3 || num === 19 || num === 20) {
        line2.style.opacity = "1";
      }
      if ((num >= 15 && num <= 18) || num === 32) {
        line3.style.opacity = "1";
      }
      if (num >= 17 && num <= 18) {
        line4.style.opacity = "1";
      }
    });
  });
};
