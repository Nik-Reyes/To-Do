import generateElement from "../../utils/GenerateElement.js";
import "./priorityMenu.css";

export default function createPirorityMenu() {
  const priorityMenuWrapper = generateElement("div", {
    class: "cyberpunk-clip-wrapper-br priority-menu-wrapper",
  });

  const priorityMenu = generateElement("menu", {
    class: "priority-menu",
  });
  const priorityMenuOptionHigh = generateElement(
    "button",
    {
      class: "priority-menu-option high-priority",
    },
    "High Priority"
  );
  const priorityMenuOptionMedium = generateElement(
    "button",
    {
      class: "priority-menu-option medium-priority",
    },
    "Medium Priority"
  );
  const priorityMenuOptionLow = generateElement(
    "button",
    {
      class: "priority-menu-option low-priority",
    },
    "Low Priority"
  );
  const priorityMenuOptionNone = generateElement(
    "button",
    {
      class: "inner-cyberpunk-clip-wrapper-br priority-menu-option no-priority",
    },
    "No Priority"
  );
  const menuSpacer = generateElement("span", { class: "menu-spacer" });

  ////// TASK ELEMENT ASSEMBLY ////////
  priorityMenu.append(
    priorityMenuOptionHigh,
    priorityMenuOptionMedium,
    priorityMenuOptionLow,
    menuSpacer,
    priorityMenuOptionNone
  );
  priorityMenuWrapper.appendChild(priorityMenu);

  return priorityMenuWrapper;
}
