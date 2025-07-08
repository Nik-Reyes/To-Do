import generateElement from "../../utils/GenerateElement";
import "./listTitle.css";

export default function createListTitle(title) {
  const listTitleWrapper = generateElement("div", {
    class: "list-title-wrapper",
  });

  const listTitle = generateElement("h3", { class: "list-title" }, title);

  listTitleWrapper.appendChild(listTitle);
  if (title === "MY LISTS") {
    const addListButtonWrapper = generateElement("div", {
      class: "addList-btn-wrapper",
    });
    const addListButton = generateElement(
      "button",
      { class: "addList-btn" },
      "+ ADD LIST"
    );
    addListButtonWrapper.appendChild(addListButton);
    listTitleWrapper.append(addListButtonWrapper);
  }

  return listTitleWrapper;
}
