import generateElement from "../../../utils/GenerateElement.js";
import "./allTasks.css";

export default function createAllTasksTaskCollection() {
  return generateElement("section", {
    class: "task-collection all-tasks",
  });
}
