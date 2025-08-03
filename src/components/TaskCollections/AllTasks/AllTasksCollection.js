import generateElement from "../../../utils/GenerateElement.js";
import "./allTasks.css";

export default function createAllTasksTaskCollection(collectionState) {
  const section = generateElement("section", {
    class: "task-collection all-tasks",
    "data-collection-state": collectionState,
  });

  const tagRow = generateElement("div", { class: "tag-row" });
  section.appendChild(tagRow);

  return section;
}
