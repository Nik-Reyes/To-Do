import generateElement from "../../utils/GenerateElement";
import createHamburger from "../Hamburger/CreateHamburger";
import "./header.css";

export default function createHeader(listName) {
  const header = generateElement("header", { class: "header" });
  const hamburger = createHamburger();
  const titleWrapper = generateElement("div", {
    class: "header-title-wrapper",
  });
  const headerTitle = generateElement(
    "h2",
    { class: "header-title" },
    listName.toUpperCase()
  );

  titleWrapper.appendChild(headerTitle);
  header.append(titleWrapper, hamburger);

  return header;
}
