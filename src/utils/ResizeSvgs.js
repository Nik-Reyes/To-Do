export default function resizeSvgs() {
  const listButton = document.querySelector(".list-btn");
  const listSvgStrokes = document.querySelectorAll(".list-btn-wrapper polygon");
  const listSvgWrapper = document.querySelector(".list-btn-wrapper svg");
  const listButtonHeight = listButton.offsetHeight;
  const listButtonWidth = listButton.offsetWidth;

  //ran into bug where browser set improper line height for input, even when I applied inline styles or the !important flag
  //explcitly setting the height seems to work
  let newList = document.querySelector(".new-list.list-btn input");
  if (newList) {
    const correctListTitleHeight = listButton.querySelector(".list-title");
    newList.style.height = `${correctListTitleHeight.offsetHeight}px`;
  }
  listSvgWrapper.setAttribute(
    "viewBox",
    `0 0 ${listButtonWidth} ${listButtonHeight}`
  );

  const listBottomPoint = listButtonHeight - 11;
  const listCornerPoint = listButtonWidth - 9;

  listSvgStrokes.forEach((stroke) => {
    stroke.setAttribute(
      "points",
      `0,0 ${listButtonWidth},0 ${listButtonWidth},${listBottomPoint} ${listCornerPoint},${listButtonHeight} 0,${listButtonHeight}`
    );
  });
}
