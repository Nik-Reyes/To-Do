import generateElement from "../../utils/GenerateElement.js";
import "./list.css";

export default function createListElement(list, attributes) {
  //////// ELEMENT CREATION ////////
  const buttonWrapper = generateElement("div", {
    class: "list-btn-wrapper",
  });

  const svgWrapper = generateElement("svg", {
    class: "svg-wrapper stacked",
    overflow: "visible",
    preserveAspectRatio: "none",
  });

  const svgStroke = generateElement("polygon", {
    fill: "none",
    "vector-effect": "non-scaling-stroke",
  });

  let listElement = undefined;
  let buttonName = undefined;
  let taskCount = undefined;

  if (list) {
    buttonName = generateElement(
      "span",
      { class: "list-title" },
      list.title.toUpperCase()
    );
    taskCount = generateElement(
      "span",
      { class: "task-count" },
      list.numberOfTasks.toString()
    );
    listElement = generateElement("button", {
      class: `list-btn stacked ${attributes ? attributes.class : ""}`,
    });

    buttonWrapper.setAttribute("data-id", `${list.id}`);
  } else {
    buttonName = generateElement("input", {
      type: "text",
      class: "newList-input",
      maxlength: "11",
      placeholder: "List Name",
    });
    taskCount = generateElement("span", {}, "0");
    listElement = generateElement("div", {
      class: "new-list list-btn stacked",
    });
  }
  //////// ELEMENT ASSEMBLY ////////
  listElement.append(buttonName, taskCount);
  svgWrapper.appendChild(svgStroke);
  buttonWrapper.append(svgWrapper, listElement);

  return buttonWrapper;
}
