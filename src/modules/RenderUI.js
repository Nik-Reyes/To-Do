import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createListElement from "../components/ListElement/CreateListElement.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import "../components/TaskElement/task.css";

export default class RenderUI {
  #taskElements = [];
  #listElements = [];
  #header;
  #taskCollection;
  #pageWrapper;
  #sidebar;

  ////////////// GETTER METHODS ///////////////
  get pageWrapper() {
    return this.#pageWrapper;
  }

  get sidebar() {
    return this.#sidebar;
  }

  get header() {
    return this.#header;
  }

  get headerTitle() {
    return this.#header.firstChild.innerText;
  }

  get taskCollection() {
    return this.#taskCollection;
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

  set taskCollection(el) {
    this.#taskCollection = el;
  }

  set pageWrapper(el) {
    this.#pageWrapper = el;
  }

  set sidebar(el) {
    this.#sidebar = el;
  }

  set header(el) {
    this.#header = el;
  }

  set headerTitle(listTitle) {
    this.#header.firstChild.innerText = listTitle.toUpperCase();
  }

  resizeListSvgs() {
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

  ////////////// ACTION METHODS ///////////////
  clearTaskCollection() {
    this.taskCollection.innerText = "";
  }

  createHeaderElement(title) {
    if (!title) throw Error("Title DNE!");
    this.header = createHeader(title);
  }

  createSidebarElement() {
    this.sidebar = createSidebar();
  }

  //takes in array of objects, returns array of task elements
  createTaskElements(objects) {
    return [...objects].map((task) => createTaskElement(task));
  }

  //takes in list objects, returns array of list elements
  createListElements(sysObjects, myObjects) {
    const sysEls = [...sysObjects].map((list) => createListElement(list));
    const myEls = [...myObjects].map((list) => createListElement(list));

    return [sysEls, myEls];
  }

  //appends array of task elements to task collection section
  renderTasks(taskObjects) {
    if (!taskObjects) throw Error("Tasks DNE!");
    this.clearTaskCollection();
    this.taskCollection.append(...this.createTaskElements(taskObjects));
  }

  //appends array of list elements to systemList and myList
  renderLists(sysObjects, myObjects) {
    if (!sysObjects) throw Error("System List Objects DNE!");
    if (!myObjects) throw Error("My List Objects DNE!");

    const [permaLists, userLists] = this.createListElements(
      sysObjects,
      myObjects
    );
    if (!permaLists) throw Error("Perma Lists Elements DNE!");
    if (!userLists) throw Error("User Lists Elements DNE!");

    this.sidebar.querySelector(".system-list-wrapper").append(...permaLists);
    this.sidebar.querySelector(".mylist-wrapper").append(...userLists);
  }

  //responsible for creating all the necessary compoenents needed for initial render
  assembleComponents(title, systemLists, myLists, currentTasks, pageWrapper) {
    this.createHeaderElement(title);
    this.createSidebarElement();
    this.renderTasks(currentTasks);
    this.renderLists(systemLists, myLists);
    pageWrapper.append(this.header, this.sidebar, this.taskCollection);
  }

  //places a list button on the sidebar whose title/name can be edited
  renderEditableList() {
    const newList = createListElement();
    this.sidebar.querySelector(".mylist-wrapper").appendChild(newList);
    newList.querySelector(".newList-input").focus();

    setTimeout(this.resizeListSvgs(), 1);
  }

  removeEditableList(list) {
    list.remove();
  }

  deleteTaskElement(task) {
    task.remove();
  }

  //replaces a list button with its own list list object (a re-render function)
  replaceList(currentListEl, currentListObj, attributes) {
    currentListEl.replaceWith(createListElement(currentListObj, attributes));
    this.resizeListSvgs();
  }

  //responsible for updating the task elements and header title for the current list based on Data.currentTasks and Data.currentListTitle
  updateDisplay(newTitle, newTasks) {
    this.header.firstChild.firstChild.innerText = newTitle.toUpperCase();
    this.renderTasks(newTasks);
  }

  init(title, systemLists, myLists, currentTasks, pageWrapper) {
    this.taskCollection = generateElement("section", {
      class: "task-collection",
    });
    this.assembleComponents(
      title,
      systemLists,
      myLists,
      currentTasks,
      pageWrapper
    );

    setTimeout(this.resizeListSvgs, 1);
    window.addEventListener("resize", this.resizeListSvgs);
  }
}
