import createEditableListElement from "../components/ListElement/ListElements/EditableListElement/CreateEditableListELement.js";
import createSystemListElement from "../components/ListElement/ListElements/SystemListElement/CreateSystemListElement.js";
import createNewListElement from "../components/ListElement/ListElements/NewListElement/CreateNewListElement.js";
import createMyListElement from "../components/ListElement/ListElements/MyListElement/CreateMyListElement.js";
import createGenericTaskCollection from "../components/TaskCollections/Generic/GenericTaskCollection.js";
import createAllTasksTaskCollection from "../components/TaskCollections/AllTasks/AllTasksCollection.js";
import createTaskCollectionWrapper from "../components/TaskCollections/TaskCollectionWrapper.js";
import createTaskTitleDiv from "../components/TaskTextDivs/TaskTitleDiv/createTaskTitleDiv.js";
import createTaskNotesDiv from "../components/TaskTextDivs/TaskNotesDiv/createTaskNotesDiv.js";
import createTitleTextArea from "../components/TextArea/TitleTA/CreateTitleTextArea.js";
import createNotesTextArea from "../components/TextArea/NotesTA/CreateNotesTextArea.js";
import createTaskElement from "../components/TaskElement/CreateTaskElement.js";
import createSection from "../components/TaskCollectionSection/Section.js";
import createHeader from "../components/Header/CreateHeader.js";
import createSidebar from "../components/Sidebar/Sidebar.js";
import generateElement from "../utils/GenerateElement.js";
import resizeListSvgs from "../utils/ResizeSvgs.js";
import "../components/TaskElement/task.css";

import createDisabledNav from "../components/Navs/AddDisabled/AddTaskDisabled.js";
import createGenericNav from "../components/Navs/Generic/GenericNav.js";

export default class RenderUI {
  #header;
  #taskCollection;
  #sidebar;
  #taskCollectionWrapper;
  #taskCollections = {
    generic: (collectionState) => {
      this.taskCollectionWrapper
        .querySelector("nav")
        .replaceWith(createGenericNav());
      return createGenericTaskCollection(collectionState);
    },
    "All Tasks": (collectionState) => {
      this.taskCollectionWrapper
        .querySelector("nav")
        .replaceWith(createDisabledNav());
      return createAllTasksTaskCollection(collectionState);
    },
    disabled: (collectionState) => {
      this.taskCollectionWrapper
        .querySelector("nav")
        .replaceWith(createDisabledNav());
      return createGenericTaskCollection(collectionState);
    },
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
  setNotesSize(note) {
    requestAnimationFrame(() => {
      note.style.height = "1px";
      note.style.height = note.scrollHeight + "px";
    });
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
    const editableList = createEditableListElement();
    listBtnWrapper.replaceWith(editableList);
    editableList.querySelector("input").focus();
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

  rerenderSectionHeader(section, title, text, state, id) {
    section.replaceWith(this.renderSectionHeader(title, text, state, id));
  }

  renderSectionHeader(title, text, state, id) {
    return createSection(title, text, state, id);
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
        sectionStates[i],
        section.id
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
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const sectionsFragment = this.renderSections(
      sections,
      classes,
      sectionHasTasks
    );
    this.taskCollection.appendChild(sectionsFragment);
  }

  renderTask(taskCollection, taskObj) {
    const newTask = createTaskElement(taskObj);
    taskCollection.appendChild(newTask);
    return newTask;
  }

  //appends array of task elements to task collection section
  async renderTasks(taskObjects) {
    if (!taskObjects) return;
    const taskCollectionFrag = document.createDocumentFragment();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const taskElements = this.createTaskElements(taskObjects);
    taskCollectionFrag.append(...taskElements);
    this.taskCollection.appendChild(taskCollectionFrag);
  }

  updateTaskElements(taskObjects) {
    this.taskCollection.innerText = "";
    this.renderTasks(taskObjects);
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

  renderTitleTextArea(divTaskTitle, taskObj) {
    const textArea = createTitleTextArea(taskObj);
    divTaskTitle.replaceWith(textArea);
    textArea.focus();
    textArea.selectionStart = textArea.value.length;
  }

  renderNotesTextArea(divTaskTitle, taskObj) {
    const textArea = createNotesTextArea(taskObj);
    divTaskTitle.replaceWith(textArea);
    textArea.focus();
    textArea.selectionStart = textArea.value.length;
  }

  renderNotesDiv(taskNoteTextArea, taskObj) {
    const noteDiv = createTaskNotesDiv(taskObj);
    taskNoteTextArea.replaceWith(noteDiv);
  }

  renderTitleDiv(taskTitleTextArea, taskObj) {
    const titleDiv = createTaskTitleDiv(taskObj);
    taskTitleTextArea.replaceWith(titleDiv);
  }

  setTaskCollectionElements(taskCollectionType, collectionState) {
    const newTaskCollection =
      this.taskCollections[taskCollectionType](collectionState);
    this.taskCollection?.replaceWith(newTaskCollection);
    this.taskCollection = newTaskCollection;
  }

  //when switching to a non generic list, app needs to send in the proper type so renderer can render new task collection and its tasks
  renderGenericTaskCollection(tasks, collectionState) {
    this.setTaskCollectionElements("generic", collectionState);
    this.renderTasks(tasks);
  }

  renderDisabledCollection(tasks, collectionState) {
    this.setTaskCollectionElements("disabled", collectionState);
    this.renderTasks(tasks);
  }

  renderAllTasksCollection(
    sectionedTasks,
    classes,
    sectionHasTasks,
    collectionState
  ) {
    this.setTaskCollectionElements("All Tasks", collectionState);
    this.renderSectionedTasks(sectionedTasks, classes, sectionHasTasks);
  }

  renderTaskCollectionWrapper() {
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
    this.renderTaskCollectionWrapper();
    this.renderAllTasksCollection(
      sectionedTasks,
      classes,
      sectionHasTasks,
      collectionState
    );
    pageWrapper.append(this.header, this.sidebar, this.taskCollectionWrapper);

    requestAnimationFrame(resizeListSvgs);
    window.addEventListener("resize", resizeListSvgs);
  }
}
