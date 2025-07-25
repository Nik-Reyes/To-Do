import generateElement from "../../../utils/GenerateElement.js";
import "./allTasks.css";

export default function createAllTasksTaskCollection(collectionState) {
  console.log(collectionState);
  return generateElement("section", {
    class: "task-collection all-tasks",
    "data-collection-state": collectionState,
  });
}
