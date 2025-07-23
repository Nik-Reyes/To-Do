import generateElement from "../../../utils/GenerateElement.js";
import "./genericCollection.css";

export default function createGenericTaskCollection() {
  return generateElement("section", {
    class: "task-collection generic",
  });
}
