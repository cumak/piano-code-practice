const msgShow = (msg, time) => {
  const msgBox = document.querySelector(".msgBox");
  msgBox.innerHTML = msg;
  msgBox.classList.add("is-show");
  setTimeout(() => {
    msgBox.classList.remove("is-show");
  }, time);
};

module.exports = msgShow;