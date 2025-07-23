import generateElement from "../../utils/GenerateElement.js";
import createGenericNav from "../Navs/Generic/GenericNav.js";

export default function createTaskCollectionWrapper() {
  const taskCollectionWrapper = generateElement("section", {
    class: "task-collection-wrapper",
  });
  const nav = createGenericNav();
  const initialTaskCollection = generateElement("section", {
    class: "task-collection",
  });

  taskCollectionWrapper.append(nav, initialTaskCollection);

  return taskCollectionWrapper;
}
