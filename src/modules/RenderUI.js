import Manager from "./Manager.js";
import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createListElement from "../components/ListElement/CreateListElement.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import "../components/TaskElement/task.css";

// Purpose of this function is only to load all lists and tasks and then attach to them to
// DOM when the website is first visted.
// This function does not handle newly created lists/tasks

function upDateSvg() {
  //why do I have to use .list-btn-testfor the width and height instead of .list-btn-wrapper???
  const button = document.querySelector(".list-btn");
  const svgStrokes = document.querySelectorAll("polygon");

  const buttonHeight = button.offsetHeight;
  const buttonWidth = button.offsetWidth;

  const bottomPoint = ((buttonHeight - 11) / buttonHeight) * 100;
  const cornerPoint = ((buttonWidth - 8.5) / buttonWidth) * 100;

  svgStrokes.forEach((stroke) => {
    stroke.setAttribute(
      "points",
      `0 0 100 0 100 ${bottomPoint} ${cornerPoint} 100 0 100`
    );
  });
}

export default function renderUi() {
  //create DOM lists
  // this is where the logic to check if the default lists exist will go
  // if the default lists exists, pull from localStorage, else create defaults (first-timer)
  // w/o localStorage, just create default lists every time
  const manager = new Manager();
  const pageWrapper = document.querySelector(".page-wrapper");

  // 1. check if there are lists. if no lists have ever been created, then create the defualt ones. condition should change to if(!Storage.lists) create defaults, else load the stored lists
  // 2. load/create the task items only for the current list. Check local storage for lists
  // 2a. therefore, Manager needs to keep track of the current list, whenever a list is clicked on, that list id should be saed at the currentListId in Manager class

  if (!Manager.listCollection) {
    import("./DefaultLists.js").then(({ default: CreateDefaultLists }) => {
      manager.listCollection = CreateDefaultLists();
      manager.currentList = manager.firstMyList; //else will load ?
      console.log(manager.currentList);

      const tasks = [];
      // loop through all lists, check if they have tasks, and if they do, create them
      manager.lists.forEach((list) => {
        if (list.hasTasks) {
          list.tasks.forEach((taskObj) =>
            tasks.push(createTaskElement(taskObj))
          );
        }
      });

      const taskCollection = generateElement("div", {
        class: "task-collection",
      });

      taskCollection.append(...tasks);

      const sidebar = createSidebar();
      const lists = manager.lists.map((list) => createListElement(list));
      lists.forEach((list, i) => {
        i >= manager.firstMyList
          ? sidebar.querySelector(".mylist-wrapper").appendChild(list)
          : sidebar.querySelector(".system-list-wrapper").appendChild(list);
      });
      pageWrapper.append(
        createHeader(manager.currentListTitle),
        sidebar,
        taskCollection
      );

      // Update on load and resize
      setTimeout(upDateSvg, 1);
      window.addEventListener("resize", upDateSvg);
    });
  } else {
    console.log("load stored lists");
  }
}
