import generateElement from "../../utils/GenerateElement.js";
import createHamburger from "../Hamburger/CreateHamburger.js";
import createAddButton from "../AddingButton/CreateAddButton.js";
import "./header.css";

export default function createHeader(listName) {
  const header = generateElement("header", { class: "header" });
  const hamburger = createHamburger();
  const addTaskBtn = createAddButton({ class: "add-task", text: "Add Task" });
  const nav = generateElement("nav", { class: "navigation toolbar" });
  nav.appendChild(addTaskBtn);
  const titleWrapper = generateElement("div", {
    class: "header-title-wrapper",
  });

  const headerTitle = generateElement(
    "h2",
    { class: "header-title" },
    listName.toUpperCase()
  );

  titleWrapper.appendChild(headerTitle);
  header.append(titleWrapper, hamburger, nav);

  return header;
}
