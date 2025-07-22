import generateElement from "../../../utils/GenerateElement.js";
import createAddButton from "../../AddingButton/CreateAddButton.js";
import "./genericNav.css";
import ".././navStyles.css";

export default function createGenericNav() {
  const addTaskBtn = createAddButton({ class: "add-task", text: "Add Task" });
  const nav = generateElement("nav", { class: "navigation toolbar" });
  nav.appendChild(addTaskBtn);

  return nav;
}
