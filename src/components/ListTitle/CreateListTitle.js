import generateElement from "../../utils/GenerateElement";
import "./listTitle.css";

export default function createListTitle(title) {
  const listTitleWrapper = generateElement("div", {
    class: "list-title-wrapper",
  });

  const listTitle = generateElement("h3", { class: "list-title" }, title);

  listTitleWrapper.appendChild(listTitle);
  return listTitleWrapper;
}
