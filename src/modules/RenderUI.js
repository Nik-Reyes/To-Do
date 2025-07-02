import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createListElement from "../components/ListElement/CreateListElement.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import "../components/TaskElement/task.css";

// Purpose of this function is only to load all lists and tasks and then attach to them to
// DOM when the website is first visted.
// This function does not handle newly created lists/tasks

export default class RenderUI {
  #manager;
  #pageWrapper;
  #sidebar;
  #header;
  #taskCollection;
  #tasks;
  #lists;

  constructor(injectedManager) {
    this.#manager = injectedManager;
    this.#pageWrapper = document.querySelector(".page-wrapper");
    this.#sidebar = createSidebar();
    this.#header = undefined;
    this.#taskCollection = generateElement("div", {
      class: "task-collection",
    });
    this.#tasks = [];
    this.#lists = [];
  }

  get manager() {
    return this.#manager;
  }

  get pageWrapper() {
    return this.#pageWrapper;
  }

  get sidebar() {
    return this.#sidebar;
  }

  get header() {
    return this.#header;
  }

  get taskCollection() {
    return this.#taskCollection;
  }

  get tasks() {
    return this.#tasks;
  }

  get lists() {
    return this.#lists;
  }

  set lists(lists) {
    this.#lists = lists;
  }
  set header(header) {
    this.#header = header;
  }

  #upDateSvg() {
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

  #createTaskElements() {
    this.manager.lists.forEach((list) => {
      if (list.hasTasks) {
        list.tasks.forEach((taskObj) =>
          this.tasks.push(createTaskElement(taskObj))
        );
      }
    });
  }

  #createListElements() {
    this.lists = this.manager.lists.map((list) => createListElement(list));
  }

  #appendLists() {
    this.lists.forEach((list, i) => {
      i >= this.manager.firstMyList
        ? this.sidebar.querySelector(".mylist-wrapper").appendChild(list)
        : this.sidebar.querySelector(".system-list-wrapper").appendChild(list);
    });
  }

  #appendTasks() {
    this.taskCollection.append(...this.tasks);
  }

  #assembleComponents() {
    this.pageWrapper.append(this.header, this.sidebar, this.taskCollection);
  }

  render() {
    console.log(this.manager.hasListCollection);

    if (this.manager.hasListCollection === false) {
      import("./DefaultLists.js").then(({ default: CreateDefaultLists }) => {
        this.manager.listCollection = CreateDefaultLists();
        this.manager.currentList = this.manager.firstMyList;
        this.#createTaskElements();
        this.#appendTasks();
        this.#createListElements();
        this.header = createHeader(this.manager.currentListTitle);
        this.#assembleComponents();
        this.#appendLists();

        // Update on load and resize
        setTimeout(this.#upDateSvg(), 1);
        window.addEventListener("resize", this.#upDateSvg());
      });
    } else {
      console.log("load stored lists");
    }
  }
}
