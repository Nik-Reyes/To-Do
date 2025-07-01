import Manager from "./manager.js";
import task from "../components/Content/Task/task.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import "../components/Content/Task/task.css";

// Purpose of this function is only to load all lists and tasks and then attach to them to
// DOM when the website is first visted.
// This function does not handle newly created lists/tasks

function upDateSvg() {
  //why do I have to use .list-btn-testfor the width and height instead of .list-btn-wrapper???
  const listButton = document.querySelector(".list-btn");
  const svgStroke = document.querySelector("polygon");
  const height = listButton.offsetHeight;
  const width = listButton.offsetWidth;

  // Convert your calc() values to percentages
  const bottomPoint = ((height - 11) / height) * 100;
  const cornerPoint = ((width - 8.5) / width) * 100;

  console.log("Container dimensions:", width, "x", height);
  console.log(
    "Button computed style (height):",
    getComputedStyle(listButton).height
  );
  console.log(
    "Button computed style (width):",
    getComputedStyle(listButton).width
  );

  svgStroke.setAttribute(
    "points",
    `0 0 100 0 100 ${bottomPoint} ${cornerPoint} 100 0 100`
  );
}

export default function renderUi() {
  //create DOM lists
  // this is where the logic to check if the default lists exist will go
  // if the default lists exists, pull from localStorage, else create defaults (first-timer)
  // w/o localStorage, just create default lists every time
  const manager = new Manager();
  const body = document.querySelector("body");

  // 1. check if there are lists. if no lists have ever been created, then create the defualt ones. condition should change to if(!Storage.lists) create defaults, else load the stored lists
  // 2. load/create the todo items only for the current list. Check local storage for lists
  // 2a. therefore, Manager needs to keep track of the current list, whenever a list is clicked on, that list id should be saed at the currentListId in Manager class

  if (!Manager.listCollection) {
    import("./DefaultLists.js").then(({ default: CreateDefaultLists }) => {
      manager.listCollection = CreateDefaultLists();
      manager.currentList = manager.firstMyList; //else will load ?

      // const tasks = [];
      // // loop through all lists, check if they have tasks, and if they do, create them
      // manager.lists.forEach((list) => {
      //   if (list.hasTasks) {
      //     list.todos.forEach((taskObj) => tasks.push(task(taskObj)));
      //   }
      // });

      body.append(createSidebar());

      // Update on load and resize
      setTimeout(upDateSvg, 100);
      window.addEventListener("resize", upDateSvg);
    });
  } else {
    console.log("load stored lists");
  }
}
