// import "./addTaskDisabled.css";
import generateElement from "../../../utils/GenerateElement.js";
import ".././navStyles.css";
import "./disabledNav.css";

export default function createDisabledNav() {
  const nav = generateElement("nav", { class: "navigation toolbar" });

  return nav;
}
