import generateElement from "../../../utils/GenerateElement.js";
import createGenericNav from "../../Navs/Generic/GenericNav.js";
import "./genericCollection.css";

export default function createGenericTaskCollection() {
  const taskCollectionWrapper = generateElement("section", {
    class: "task-collection-wrapper ",
  });
  const nav = createGenericNav();
  const taskCollection = generateElement("section", {
    class: "task-collection generic",
  });
  taskCollectionWrapper.append(nav, taskCollection);

  return taskCollectionWrapper;
}
