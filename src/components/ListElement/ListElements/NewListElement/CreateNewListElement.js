import generateElement from "../../../../utils/GenerateElement.js";
import "./newListElement.css";
import "../../list.css";

export default function createNewListElement() {
  //////// ELEMENT CREATION ////////
  const listButtonWrapper = generateElement("div", {
    class: "list-btn-wrapper my-list",
  });

  //////// TITLE PORTION OF THE LIST BUTTON ////////
  const listElementTitle = generateElement("div", {
    class: "list-element-title",
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

  const input = generateElement("input", {
    type: "text",
    class: "newList-input",
    maxlength: "17",
    placeholder: "List Name",
  });

  const listElement = generateElement("div", {
    class: "new-list list-btn stacked",
  });

  //////// ELEMENT ASSEMBLY ////////
  listElement.append(input);
  svgWrapper.appendChild(svgStroke);
  listElementTitle.append(svgWrapper, listElement);
  listButtonWrapper.append(listElementTitle);

  return listButtonWrapper;
}
