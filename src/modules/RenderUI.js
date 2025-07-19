import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createListElement from "../components/ListElement/CreateListElement.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import resizeListSvgs from "../utils/ResizeSvgs.js";
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

  ////////////// ACTION METHODS ///////////////
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

  //takes in list objects (and optional attributes), returns array of list elements
  createListElements(sysObjects, myObjects, attributes) {
    let i = 0;
    const sysEls = [...sysObjects].map((list) =>
      createListElement(list, attributes?.[i++])
    );
    const myEls = [...myObjects].map((list) =>
      createListElement(list, attributes?.[i++])
    );

    return [sysEls, myEls];
  }

  //appends array of task elements to task collection section
  async renderTasks(taskObjects) {
    if (!taskObjects) throw Error("Tasks DNE!");
    await new Promise((resolve) => setTimeout(resolve, 25));
    const taskElements = this.createTaskElements(taskObjects);
    const taskCollectionFrag = document.createDocumentFragment();
    taskCollectionFrag.append(...taskElements);
    this.taskCollection.appendChild(taskCollectionFrag);
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

    this.sidebar
      .querySelector(".inner-system-list-wrapper")
      .append(...permaLists);
    this.sidebar.querySelector(".inner-mylist-wrapper").append(...userLists);
  }

  rerenderLists(
    sysObjects,
    myObjects,
    systemListWrapper,
    mylistWrapper,
    classes
  ) {
    const [permaLists, userLists] = this.createListElements(
      sysObjects,
      myObjects,
      classes
    );

    mylistWrapper.innerText = "";
    systemListWrapper.innerText = "";
    systemListWrapper.append(...permaLists);
    mylistWrapper.append(...userLists);
    resizeListSvgs();
  }

  //replaces a list button with its own list list object (a re-render function)
  replaceList(currentListEl, currentListObj, attributes) {
    currentListEl.replaceWith(createListElement(currentListObj, attributes));
    resizeListSvgs();
  }

  //responsible for creating all the necessary compoenents needed for initial render
  assembleComponents(title, systemLists, myLists, currentTasks, pageWrapper) {
    this.createHeaderElement(title);
    this.createSidebarElement();
    this.renderTasks(currentTasks);
    this.renderLists(systemLists, myLists);
    pageWrapper.append(this.header, this.sidebar, this.taskCollection);
  }

  renderTask(taskCollection, taskObj) {
    const newTask = createTaskElement(taskObj);
    taskCollection.appendChild(newTask);
    return newTask;
  }

  //places a list button on the sidebar whose title/name can be edited
  renderEditableList(mylistWrapper) {
    const newList = createListElement();
    mylistWrapper.appendChild(newList);
    resizeListSvgs();
    return newList;
  }

  removeEditableList(list) {
    list.remove();
  }

  deleteTaskElement(task) {
    task.remove();
  }

  //responsible for updating the task elements and header title for the current list based on Data.currentTasks and Data.currentListTitle
  updateHeader(newTitle) {
    this.header.firstChild.firstChild.innerText = newTitle.toUpperCase();
  }

  updateTasks(newTasks) {
    this.taskCollection.innerText = "";
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

    setTimeout(resizeListSvgs, 1);
    window.addEventListener("resize", resizeListSvgs);
  }
}
