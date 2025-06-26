import Manager from "./manager.js";
import task from "../components/Content/Task/task.js";

// Purpose of this function is only to load all lists and tasks and then attach to them to
// DOM when the website is first visted.
// This function does not handle newly created lists/tasks
export default function renderUi() {
  //create DOM lists
  // this is where the logic to check if the default lists exist will go
  // if the default lists exists, pull from localStorage, else create defaults (first-timer)
  // w/o localStorage, just create default lists every time
  const manager = new Manager();
  const body = document.querySelector("body");

  //condition should change to if(!Storage.lists) create defaults, else load the stored lists
  if (!Manager.listCollection) {
    import("./DefaultLists.js").then(({ default: CreateDefaultLists }) => {
      manager.listCollection = CreateDefaultLists();
      manager.currentList = manager.firstMyList;

      const tasktElements = task(manager);
      body.append(...tasktElements);
    });
  } else {
    console.log("load stored lists");
  }
}
