import generateElement from "../../../utils/GenerateElement.js";
import "./genericCollection.css";

export default function createGenericTaskCollection(collectionState) {
  return generateElement("section", {
    class: "task-collection generic",
    "data-collection-state": collectionState,
  });
}
