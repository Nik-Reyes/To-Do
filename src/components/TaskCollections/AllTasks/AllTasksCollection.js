import generateElement from "../../../utils/GenerateElement.js";
import createGenericNav from "../../Navs/Generic/GenericNav.js";
import "./allTasks.css";

export default function createAllTasksTaskCollection() {
  const taskCollectionWrapper = generateElement("section", {
    class: "task-collection-wrapper",
  });
  const nav = createGenericNav();
  const taskCollection = generateElement("section", {
    class: "task-collection all-tasks",
  });
  taskCollectionWrapper.append(nav, taskCollection);

  return taskCollectionWrapper;
}
