import createGenericTaskCollection from "../components/TaskCollections/Generic/GenericTaskCollection.js";
import createAllTasksTaskCollection from "../components/TaskCollections/AllTasks/AllTasksCollection.js";
import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createListElement from "../components/ListElement/CreateListElement.js";
import createSection from "../components/TaskCollectionSection/Section.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import resizeListSvgs from "../utils/ResizeSvgs.js";
import "../components/TaskElement/task.css";

export default class RenderUI {
  #header;
  #taskCollection;
  #pageWrapper;
  #sidebar;
  #taskCollectionWrapper;
  #taskCollections = {
    generic: () => createGenericTaskCollection(),
    "All Tasks": () => createAllTasksTaskCollection(),
  };

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

  get taskCollection() {
    return this.#taskCollection;
  }

  get taskCollections() {
    return this.#taskCollections;
  }

  get taskCollectionWrapper() {
    return this.#taskCollectionWrapper;
  }

  ////////////// SETTER METHODS ///////////////

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

  set taskCollectionWrapper(wrapper) {
    this.#taskCollectionWrapper = wrapper;
  }

  ////////////// ACTION METHODS ///////////////
  setNotesSize() {
    setTimeout(() => {
      const notes = Array.from(
        this.taskCollection.querySelectorAll(".task-notes")
      );
      notes
        .filter((note) => {
          return note.value !== "";
        })
        .forEach((note) => {
          note.style.height = note.scrollHeight + "px";
        });
    }, 25);
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
    return objects.map((task) => createTaskElement(task));
  }

  //takes in list objects (and optional attributes), returns array of list elements
  createListElements(sysObjects, myObjects, attributes) {
    let i = 0;
    const sysEls = sysObjects.map((list) =>
      createListElement(list, attributes?.[i++])
    );
    const myEls = myObjects.map((list) =>
      createListElement(list, attributes?.[i++])
    );

    return [sysEls, myEls];
  }

  async renderSectionedTasks(sections) {
    const frag = document.createDocumentFragment();

    await new Promise((resolve) => setTimeout(resolve, 25));

    sections.forEach((section) => {
      const sectionHeader = createSection(section.listTitle);
      frag.appendChild(sectionHeader);
      const taskElements = this.createTaskElements(section.tasks);
      const subCollection = generateElement("section", {
        class: `sub-collection ${section.listTitle}-collection`,
      });
      subCollection.append(...taskElements);
      frag.appendChild(subCollection);
    });
    this.taskCollection.appendChild(frag);
    this.setNotesSize();
  }

  renderTask(taskCollection, taskObj) {
    const newTask = createTaskElement(taskObj);
    taskCollection.appendChild(newTask);
    return newTask;
  }

  //appends array of task elements to task collection section
  async renderTasks(taskObjects) {
    if (!taskObjects) throw Error("Tasks DNE!");
    this.taskCollection.innerText = "";
    const taskCollectionFrag = document.createDocumentFragment();

    await new Promise((resolve) => setTimeout(resolve, 25));

    const taskElements = this.createTaskElements(taskObjects);
    taskCollectionFrag.append(...taskElements);
    this.taskCollection.appendChild(taskCollectionFrag);
    this.setNotesSize();
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

  //places a list button on the sidebar whose title/name can be edited
  renderEditableList(mylistWrapper) {
    const newList = createListElement();
    mylistWrapper.appendChild(newList);
    resizeListSvgs();
    return newList;
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

  setTaskCollectionElements(taskCollectionType) {
    const newWrapper = this.taskCollections[taskCollectionType]();
    this.taskCollectionWrapper?.replaceWith(newWrapper);
    this.taskCollectionWrapper = newWrapper;
    this.taskCollection = newWrapper.querySelector(".task-collection");
  }

  //when switching to a non generic list, app needs to send in the proper type so renderer can render new task collection and its tasks
  createGenericTaskCollection(taskCollectionType, tasks) {
    this.setTaskCollectionElements(taskCollectionType);
    this.renderTasks(tasks);
  }

  createAllTasksCollection(taskCollectionType, tasks) {
    this.setTaskCollectionElements(taskCollectionType);
    this.renderSectionedTasks(tasks);
  }

  //responsible for creating all the necessary compoenents needed for initial render
  assembleComponents(
    title,
    systemLists,
    myLists,
    currentTasks,
    pageWrapper,
    collectionType = "generic"
  ) {
    this.createHeaderElement(title);
    this.createSidebarElement();
    this.renderLists(systemLists, myLists);
    this.createGenericTaskCollection(collectionType, currentTasks);
    pageWrapper.append(this.header, this.sidebar, this.taskCollectionWrapper);
  }

  removeEditableList(list) {
    list.remove();
  }

  deleteTaskElement(task) {
    task.remove();
  }

  //responsible for updating the task elements and header title for the current list based on Data.currentTasks and Data.currentListTitle
  updateHeaderTitle(headerTitleElement, newTitle) {
    headerTitleElement.innerText = newTitle;
  }

  init(title, systemLists, myLists, currentTasks, pageWrapper, collectionType) {
    this.assembleComponents(
      title,
      systemLists,
      myLists,
      currentTasks,
      pageWrapper,
      collectionType
    );

    setTimeout(resizeListSvgs, 1);
    window.addEventListener("resize", resizeListSvgs);
  }
}
