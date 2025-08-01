import createEditableListElement from "../components/ListElement/ListElements/EditableListElement/CreateEditableListELement.js";
import createSystemListElement from "../components/ListElement/ListElements/SystemListElement/CreateSystemListElement.js";
import createNewListElement from "../components/ListElement/ListElements/NewListElement/CreateNewListElement.js";
import createMyListElement from "../components/ListElement/ListElements/MyListElement/CreateMyListElement.js";
import createGenericTaskCollection from "../components/TaskCollections/Generic/GenericTaskCollection.js";
import createAllTasksTaskCollection from "../components/TaskCollections/AllTasks/AllTasksCollection.js";
import createTaskCollectionWrapper from "../components/TaskCollections/TaskCollectionWrapper.js";
import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createSection from "../components/TaskCollectionSection/Section.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import resizeListSvgs from "../utils/ResizeSvgs.js";
import "../components/TaskElement/task.css";

export default class RenderUI {
  #header;
  #taskCollection;
  #sidebar;
  #taskCollectionWrapper;
  #taskCollections = {
    generic: (collectionState) => createGenericTaskCollection(collectionState),
    "All Tasks": (collectionState) =>
      createAllTasksTaskCollection(collectionState),
  };

  ////////////// GETTER METHODS ///////////////
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

  renderEditableList(listBtnWrapper) {
    listBtnWrapper.replaceWith(createEditableListElement());
    resizeListSvgs();
  }

  //takes in list objects (and optional attributes), returns array of list elements
  createListElements(sysObjects, myObjects, attributes) {
    let i = 0;
    const sysEls = sysObjects.map((list) =>
      createSystemListElement(list, attributes?.[i++])
    );
    const myEls = myObjects.map((list) =>
      createMyListElement(list, attributes?.[i++])
    );

    return [sysEls, myEls];
  }

  rerenderSectionHeader(section, title, text, state) {
    section.replaceWith(this.renderSectionHeader(title, text, state));
  }

  renderSectionHeader(title, text, state) {
    return createSection(title, text, state);
  }

  renderSections(sections, classes, sectionStates) {
    const frag = document.createDocumentFragment();

    sections.forEach((section, i) => {
      const subCollectionWrapper = generateElement("section", {
        class: classes[i].class,
      });

      const subCollection = generateElement("section", {
        class: `sub-collection`,
      });

      const buttonText = classes[i].class.includes("sub-collection-expanded")
        ? "Collapse"
        : "Expand";

      const sectionHeader = this.renderSectionHeader(
        section.listTitle,
        buttonText,
        sectionStates[i]
      );
      const taskElements = this.createTaskElements(section.tasks);

      subCollection.append(...taskElements);
      subCollectionWrapper.appendChild(subCollection);

      frag.append(sectionHeader, subCollectionWrapper);
    });
    return frag;
  }

  //always starts off with base classes
  async renderSectionedTasks(sections, classes, sectionHasTasks) {
    await new Promise((resolve) => setTimeout(resolve, 25));
    const sectionsFragment = this.renderSections(
      sections,
      classes,
      sectionHasTasks
    );
    this.taskCollection.appendChild(sectionsFragment);
    this.setNotesSize();
  }

  renderTask(taskCollection, taskObj) {
    const newTask = createTaskElement(taskObj);
    taskCollection.appendChild(newTask);
    return newTask;
  }

  //appends array of task elements to task collection section
  async renderTasks(taskObjects) {
    if (!taskObjects) return;
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
  renderNewList(mylistWrapper) {
    const newList = createNewListElement();
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
  rerenderList(currentListEl, currentListObj, attributes) {
    currentListEl.replaceWith(createMyListElement(currentListObj, attributes));
    resizeListSvgs();
  }

  setTaskCollectionElements(taskCollectionType, collectionState) {
    const newTaskCollection =
      this.taskCollections[taskCollectionType](collectionState);
    this.taskCollection?.replaceWith(newTaskCollection);
    this.taskCollection = newTaskCollection;
  }

  //when switching to a non generic list, app needs to send in the proper type so renderer can render new task collection and its tasks
  createGenericTaskCollection(tasks, collectionState) {
    this.setTaskCollectionElements("generic", collectionState);
    this.renderTasks(tasks);
  }

  createAllTasksCollection(
    sectionedTasks,
    classes,
    sectionHasTasks,
    collectionState
  ) {
    this.setTaskCollectionElements("All Tasks", collectionState);
    this.renderSectionedTasks(sectionedTasks, classes, sectionHasTasks);
  }

  createTaskCollectionWrapper() {
    this.taskCollectionWrapper = createTaskCollectionWrapper();
    this.taskCollection =
      this.taskCollectionWrapper.querySelector(".task-collection");
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

  init(
    title,
    systemLists,
    myLists,
    sectionedTasks,
    classes,
    sectionHasTasks,
    pageWrapper,
    collectionState
  ) {
    this.createHeaderElement(title);
    this.createSidebarElement();
    this.renderLists(systemLists, myLists);
    this.createTaskCollectionWrapper();
    this.createAllTasksCollection(
      sectionedTasks,
      classes,
      sectionHasTasks,
      collectionState
    );
    pageWrapper.append(this.header, this.sidebar, this.taskCollectionWrapper);

    setTimeout(resizeListSvgs, 1);
    window.addEventListener("resize", resizeListSvgs);
  }
}
