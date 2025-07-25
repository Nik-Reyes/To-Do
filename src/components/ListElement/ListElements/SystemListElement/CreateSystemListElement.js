import generateElement from "../../../../utils/GenerateElement";
import "../../list.css";

export default function createSystemListElement(list, attributes) {
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

  const buttonName = generateElement(
    "span",
    { class: "list-title" },
    list.title
  );
  const taskCount = generateElement(
    "span",
    { class: "task-count" },
    list.numberOfTasks.toString()
  );
  const listElement = generateElement("button", {
    class: attributes?.class || "list-btn stacked",
    "data-id": list.id,
  });

  //////// ELEMENT ASSEMBLY ////////
  listElement.append(buttonName, taskCount);
  svgWrapper.appendChild(svgStroke);
  buttonWrapper.append(svgWrapper, listElement);

  return buttonWrapper;
}
