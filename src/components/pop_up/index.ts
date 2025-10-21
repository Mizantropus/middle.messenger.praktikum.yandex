export function showPopUp(contentElement: HTMLElement) {
  const popUpBg = document.getElementById("pop-up-bg");
  const popUpContent = document.getElementById("pop-up-content");
  const popUpClose = document.getElementById("pop-up-close");

  if (!popUpBg || !popUpContent || !popUpClose) return;

  while (popUpContent.children.length > 0) {
    popUpContent.removeChild(popUpContent.lastChild!);
  }
  popUpContent.appendChild(contentElement);
  popUpBg.style.display = "flex";
  setTimeout(() => {
    popUpBg.style.opacity = "1";
    popUpBg.style.pointerEvents = "auto";
  }, 100);


  popUpClose.onclick = () => closePopUp();
  popUpBg.onclick = (e) => {
    if (e.target === popUpBg) closePopUp();
  };
}

export function closePopUp() {
  const popUpBg = document.getElementById("pop-up-bg");
  if (popUpBg) {
    popUpBg.style.opacity = "0";
    popUpBg.style.pointerEvents = "none";
    setTimeout(() => {
      popUpBg.style.display = "none";
    }, 330);
  }
}
