import generateElement from "../../utils/GenerateElement.js";
import "./list.css";

let count = 0;
export default function createListElement(list) {
  //////// ELEMENT CREATION ////////
  const buttonWrapper = generateElement("div", {
    class: "list-btn-wrapper",
  });

  const svgWrapper = generateElement("svg", {
    class: "svg-wrapper stacked",
    viewBox: "0 0 100 100",
    overflow: "visible",
    preserveAspectRatio: "none",
  });

  const svgStroke = generateElement("polygon", {
    stroke: "rgb(120, 214, 204)",
    fill: "none",
    "vector-effect": "non-scaling-stroke",
  });

  let listElement = undefined;
  let buttonName = undefined;
  let taskCount = undefined;

  if (list) {
    buttonName = generateElement("span", {}, list.title.toUpperCase());
    taskCount = generateElement("span", {}, list.numberOfTasks.toString());
    listElement = generateElement("button", {
      class: "list-btn stacked",
    });

    buttonWrapper.addEventListener("mouseover", () => {
      svgStroke.setAttribute("stroke", "hsl(48, 82%, 52%)");
    });

    buttonWrapper.addEventListener("mouseout", () => {
      svgStroke.setAttribute("stroke", "rgb(120, 214, 204)");
    });

    buttonWrapper.setAttribute("data-id", `${count++}`);
  } else {
    buttonName = generateElement("input", {
      type: "text",
      class: "newList-input",
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
