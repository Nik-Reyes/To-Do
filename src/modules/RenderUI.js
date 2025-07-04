import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createListElement from "../components/ListElement/CreateListElement.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import "../components/TaskElement/task.css";
import CreateDefaultLists from "./DefaultLists.js";

// Purpose of this class is only to render any UI changes requested by ScreenController

export default class RenderUI {
  #manager;
  #pageWrapper;
  #sidebar;
  #header;
  #taskCollection;
  #taskElements;
  #listElements;

  constructor(injectedManager) {
    this.#manager = injectedManager;
    this.#pageWrapper = document.querySelector(".page-wrapper");
    this.#sidebar = createSidebar();
    this.#header = null;
    this.#taskCollection = generateElement("div", {
      class: "task-collection",
    });
    this.#taskElements = [];
    this.#listElements = [];
  }

  ////////////// GETTER METHODS ///////////////
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
    return this.#taskElements;
  }

  get lists() {
    return this.#listElements;
  }
  ////////////// SETTER METHODS ///////////////
  set lists(lists) {
    this.#listElements = lists;
  }

  set header(header) {
    this.#header = header;
  }

  set tasks(taskList) {
    this.#taskElements.length = 0;
    this.#taskElements.push(...taskList.map((task) => createTaskElement(task)));
  }

  set header(headerElement) {
    this.#header = headerElement;
  }

  ////////////// ACTION METHODS ///////////////
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

  createTaskElements() {
    this.tasks = this.manager.currentListTasks;
  }

  #createListElements() {
    this.lists = this.manager.lists.map((list) => createListElement(list));
  }

  #createHeaderElement() {
    this.header = createHeader(this.manager.currentListTitle);
  }

  #renderLists() {
    this.lists.forEach((list, i) => {
      i >= this.manager.firstMyList
        ? this.sidebar.querySelector(".mylist-wrapper").appendChild(list)
        : this.sidebar.querySelector(".system-list-wrapper").appendChild(list);
    });
  }

  renderTasks() {
    this.taskCollection.innerText = "";
    this.createTaskElements();
    this.taskCollection.append(...this.tasks);
  }

  set headerTitle(listTitle) {
    this.header.querySelector(".header-title").innerText =
      listTitle.toUpperCase();
  }

  #assembleComponents() {
    this.pageWrapper.append(this.header, this.sidebar, this.taskCollection);
  }

  // appends list element to sidebar
  renderEditableList() {
    const newList = createListElement();
    this.sidebar.querySelector(".mylist-wrapper").appendChild(newList);
    newList.querySelector(".newList-input").focus();

    setTimeout(this.#upDateSvg(), 1);
  }

  renderList(editableList, newListObj) {
    editableList.replaceWith(createListElement(newListObj));
    setTimeout(() => this.#upDateSvg(), 1);
  }

  render(callback) {
    if (this.manager.hasListCollection === false) {
      this.manager.listCollection = CreateDefaultLists();
      this.manager.currentList = this.manager.firstMyList;
      this.renderTasks();
      this.#createListElements();
      this.#createHeaderElement();
      this.#assembleComponents();
      this.#renderLists();

      // Update on load and resize
      setTimeout(() => this.#upDateSvg(), 1);
      window.addEventListener("resize", this.#upDateSvg());
      if (callback) callback();
    } else {
      console.log("load stored lists");
    }
  }
}
