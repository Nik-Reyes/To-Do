import generateElement from "../../utils/GenerateElement.js";
import "./list.css";

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

  const listButton = generateElement("button", {
    class: "list-btn stacked",
  });

  const buttonName = generateElement("span", {}, list.title.toUpperCase());
  const taskCount = generateElement("span", {}, list.numberOfTasks.toString());

  //////// EVENT LISTENER APPLICATION ////////
  buttonWrapper.addEventListener("mouseover", () => {
    svgStroke.setAttribute("stroke", "hsl(48, 82%, 52%)");
  });

  buttonWrapper.addEventListener("mouseout", () => {
    svgStroke.setAttribute("stroke", "rgb(120, 214, 204)");
  });

  //////// ELEMENT ASSEMBLY ////////
  listButton.append(buttonName, taskCount);
  svgWrapper.appendChild(svgStroke);
  buttonWrapper.append(svgWrapper, listButton);

  return buttonWrapper;
}
