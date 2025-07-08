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
  #sizeListSvgs() {
    const listButton = document.querySelector(".list-btn");
    const listSvgStrokes = document.querySelectorAll(
      ".list-btn-wrapper polygon"
    );
    const listSvgWrapper = document.querySelector(".list-btn-wrapper svg");

    const listButtonHeight = listButton.offsetHeight;
    const listButtonWidth = listButton.offsetWidth;

    listSvgWrapper.setAttribute(
      "viewBox",
      `0 0 ${listButtonWidth} ${listButtonHeight}`
    );

    const listBottomPoint = listButtonHeight - 11;
    const listCornerPoint = listButtonWidth - 9;

    listSvgStrokes.forEach((stroke) => {
      stroke.setAttribute(
        "points",
        `0,0 ${listButtonWidth},0 ${listButtonWidth},${listBottomPoint} ${listCornerPoint},${listButtonHeight} 0,${listButtonHeight}`
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

    setTimeout(this.#sizeListSvgs(), 1);
  }

  renderList(editableList, newListObj) {
    editableList.replaceWith(createListElement(newListObj));
    setTimeout(() => this.#sizeListSvgs(), 1);
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
      setTimeout(this.#sizeListSvgs, 1);
      window.addEventListener("resize", this.#sizeListSvgs);
      if (callback) callback();
    } else {
      console.log("load stored lists");
    }
  }
}
