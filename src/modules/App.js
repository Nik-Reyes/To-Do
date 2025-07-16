import Data from "./Data.js";
import RenderUI from "./RenderUI.js";
import SidebarManager from "./SidebarManager.js";
import resizeListSvgs from "../utils/ResizeSvgs.js";

export default class App {
  #elements = {
    pageWrapper: document.querySelector(".page-wrapper"),
    overlay: document.querySelector(".overlay"),
  };
  #activeTaskElement = null;

  constructor() {
    this.data = new Data();
    this.renderer = new RenderUI();
    this.sidebarManager = undefined;
  }

  ////////////// FIELD GETTER METHODS ///////////////
  get activeTaskElement() {
    return this.#activeTaskElement;
  }

  get elements() {
    return this.#elements;
  }

  // ////////////// SETTER METHODS ///////////////
  set activeTaskElement(el) {
    this.#activeTaskElement = el;
  }

  queryElements(selectors) {
    for (let key of Object.keys(selectors)) {
      this.#elements[key] = document.querySelector(selectors[key]);
    }
  }

  toggleButton(button) {
    button.disabled
      ? button.removeAttribute("disabled")
      : button.setAttribute("disabled", "");
  }

  addEditableListElement() {
    const list = this.renderer.renderEditableList(this.elements.mylistWrapper);
    list.querySelector(".newList-input").focus();
    this.toggleButton(this.elements.addListBtn);
    resizeListSvgs();
  }

  replaceEditableList(editableList, target) {
    const newList = this.data.createNewList(target.value);
    const newListIdx = this.getClickedListElementIdx(newList);

    console.log(this.data.listCollection);
    this.data.addList(newList);
    this.data.switchLists(newListIdx);
    console.log(this.data.currentListTitle);
    console.log(this.data.currentList);
    this.rerenderList(editableList);
    this.renderer.updateDisplay(
      this.data.currentListTitle,
      this.data.currentTasks
    );
  }

  handleNewList(e) {
    const target = e.target;
    const key = e.key;
    const newList = target.closest(".new-list");
    if (!newList) return;
    const newlistWrapper = newList.closest(".list-btn-wrapper");

    if (target.value === "" && key === "Escape") {
      this.renderer.removeEditableList(newlistWrapper);
      this.toggleButton(this.elements.addListBtn);
    } else if (key === "Enter" || key === "Escape") {
      if (target.value === "") return;
      this.replaceEditableList(newlistWrapper, target);
      this.toggleButton(this.elements.addListBtn);
    }
  }

  // to get the currentList, all we need is the list element index.
  // the list element was created from the list object, so
  // if we have the index of the list element then we have the index of the list object that the list element came from
  getListElements() {
    return [...this.elements.sidebar.querySelectorAll(".list-btn-wrapper")];
  }
  getClickedListElementIdx(listBtnWrapper) {
    const listElements = this.getListElements();
    return listElements.findIndex((el) => el === listBtnWrapper);
  }

  getCurrentListElement() {
    const listElements = this.getListElements();
    return listElements.at(this.data.currentListIdx);
  }

  getCurrentListElementBtn() {
    return this.getCurrentListElement().querySelector(".list-btn");
  }

  // the current list index IS the currentListIdx from the object
  getCurrentListElementIdx() {
    return this.data.currentListIdx;
  }

  switchFocusedLists(listButton) {
    // listButton is my clicked list
    // if my clicked list already has focus, do nothing, just return
    if (listButton.classList.contains("focused-list")) return;

    //if the clicked listButton does not have focus then remove the focus from the previous focused list
    const prevList = this.elements.sidebar.querySelector(".focused-list");

    //if list button is not a clicked button, and is a newList, just remove the old focused list and early return
    if (listButton.classList.contains("new-list")) {
      prevList.classList.remove("focused-list");
      return;
    }

    // if there is no previous focused list, apply the focused list to the clicked list (this is the first ever clicked list)
    if (!prevList) {
      listButton.classList.add("focused-list");
    } else {
      //if there is a previous list, then remove the class and add it to the clicked list
      prevList.classList.remove("focused-list");
      listButton.classList.add("focused-list");
    }
  }

  //currentListID is unreliable.
  //when localstorage comes around the list class will restart its count, and boom, list switchig breaks
  //need a way to compare the list element with the currentList object
  //each list object is an element. So if I can get the list elementID, then I can check to see if the list element idx is the matches the currentListelement index. If they match then the element is the list object (just in element form)
  handleListClicks(e) {
    const target = e.target;
    // return if the clicked element is not a list
    const listButton = target.closest(".list-btn");
    if (!listButton) return;

    // return if the clicked element is a new list
    const classList = listButton.classList;
    if (classList.contains("new-list")) return;

    const listBtnWrapper = target.closest(".list-btn-wrapper");
    const clickedListIdx = this.getClickedListElementIdx(listBtnWrapper);
    const currentListIdx = this.getCurrentListElementIdx();

    // return if the user clicks the list they are already on
    if (clickedListIdx === currentListIdx) return;

    this.switchFocusedLists(listButton);
    this.data.switchLists(clickedListIdx);
    this.renderer.updateDisplay(
      this.data.currentListTitle,
      this.data.currentTasks
    );
  }

  collapseActiveTaskElement(e) {
    if (e.composedPath().includes(this.activeTaskElement)) return;
    this.removeActiveTask();
  }

  handleDocumentClicks(e) {
    const target = e.target;
    const newList = this.elements.mylistWrapper.querySelector(".newList-input");
    const opendMenu = this.elements.taskCollection.querySelector(".open-menu");
    const focusedDateWrapper = this.elements.taskCollection.querySelector(
      ".date-wrapper.focused"
    );
    const focusedPriorityWrapper = this.elements.taskCollection.querySelector(
      ".priority-btn-wrapper.focused"
    );

    //collapses the opened task if the user clicks away from it and the click isnt adding a task
    if (this.activeTaskElement && !target.closest(".add-task-btn")) {
      this.collapseActiveTaskElement(e);
    }
    // removes the new editable list if the user clicks away from it
    if (
      newList &&
      !target.closest(".new-list") &&
      !target.closest(".addList-btn")
    ) {
      const list = newList.closest(".list-btn-wrapper");
      this.renderer.removeEditableList(list);
      this.toggleButton(this.elements.addListBtn);
    }

    //forces unfocusing on the date wrapper when the user clicks away from it
    if (focusedDateWrapper && !target.closest(".date-wrapper")) {
      focusedDateWrapper.classList.remove("focused");
    }

    if (focusedPriorityWrapper && !target.closest(".priority-btn-wrapper")) {
      focusedPriorityWrapper.classList.remove("focused");
    }

    if (
      opendMenu &&
      !target.closest(".task-priority") &&
      !target.closest(".open-menu")
    ) {
      opendMenu.classList.remove("open-menu");
    }
  }

  getNewPriorityRating(target) {
    return Array.from(target.classList).find((className) => {
      return className.includes("-priority");
    });
  }

  changePriorityPanelColor(taskWrapper, newPriority) {
    const taskPriorityColorPanel = taskWrapper.querySelector(".priority-panel");
    taskPriorityColorPanel.classList.forEach((className) => {
      if (className.includes("-priority")) {
        taskPriorityColorPanel.classList.replace(className, newPriority);
      }
    });
  }

  closeMenu(menu) {
    menu.classList.remove("open-menu");
  }

  handlePriorityOptionClick(target, taskWrapper, taskIdx) {
    const taskPriorityBtn = taskWrapper.querySelector("button.task-priority");
    const menu = this.elements.taskCollection.querySelector(".open-menu");
    this.closeMenu(menu);

    //retrieve the user-selected priority rating
    const newPriority = this.getNewPriorityRating(target);
    // Change the color of the priority panel
    this.changePriorityPanelColor(taskWrapper, newPriority);
    // update the task object priority property
    this.data.updateTaskObject(taskIdx, "priority", newPriority);
  }

  togglePriorityMenu(menu) {
    menu.classList.toggle("open-menu");
  }

  removeActiveTask() {
    const activeTask = this.elements.taskCollection.querySelector(".active");
    if (!activeTask) return;

    const activeTaskInput = activeTask.querySelector(".task-input");
    if (!activeTaskInput) return;

    const inputWidth = `${activeTaskInput.value.length + 2}ch`;
    activeTaskInput.style.width = inputWidth;
    activeTask.classList.remove("active");
    this.activeTaskElement = null;
  }

  handleTaskInputClick(target, taskWrapper, taskContent) {
    if (!taskContent) return;
    this.removeActiveTask();
    taskContent.classList.add("active");
    target.style.width = "100%";
    this.activeTaskElement = taskWrapper;
  }

  getTaskIdxFromElement(taskWrapper) {
    return Array.from(
      this.elements.taskCollection.querySelectorAll(".task-wrapper")
    ).indexOf(taskWrapper);
  }

  // re-render either the newList or the list when deleting
  rerenderList(currList) {
    const listBtn = currList.querySelector(".focused-list");
    const newList = currList.querySelector(".new-list");
    const list = listBtn || newList;
    this.switchFocusedLists(list);
    this.renderer.replaceList(currList, this.data.currentList, {
      class: "focused-list",
    });
  }

  deleteTaskElement(taskWrapper, taskIdx) {
    this.data.deleteTask(taskIdx);
    this.renderer.deleteTaskElement(taskWrapper);
    const listEl = this.getCurrentListElement();
    this.rerenderList(listEl);
  }

  addTaskElement(e) {
    const target = e.target;
    if (target.className.includes("add-task-btn")) {
      const newTask = this.data.createNewTask();
      this.data.addTask(newTask);
      const newTaskElement = this.renderer.renderTask(
        this.elements.taskCollection,
        newTask
      );
      const target = newTaskElement.querySelector(".task-input");
      const taskContent = newTaskElement.querySelector(".task-content");
      this.handleTaskInputClick(target, newTaskElement, taskContent);
      newTaskElement.querySelector(".task-input").focus();
      const listEl = this.getCurrentListElement();
      this.rerenderList(listEl);
    }
  }

  handleTaskClicks(e) {
    const target = e.target;
    const classArr = target.classList;
    const taskWrapper = target.closest(".task-wrapper");
    const taskContent = target.closest(".task-content");
    const taskIdx = this.getTaskIdxFromElement(taskWrapper);

    if (classArr.contains("task-input")) {
      this.handleTaskInputClick(target, taskWrapper, taskContent);
    } else if (classArr.contains("task-priority")) {
      const menu = taskWrapper.querySelector(".priority-menu-wrapper");
      target.closest(".priority-btn-wrapper").classList.toggle("focused");
      this.togglePriorityMenu(menu);
    } else if (classArr.contains("delete-svg-wrapper")) {
      this.deleteTaskElement(taskWrapper, taskIdx);
    } else if (target.closest(".task-date")) {
      target.closest(".date-wrapper").classList.add("focused");
    } else if (target.closest(".priority-menu-option")) {
      this.handlePriorityOptionClick(target, taskWrapper, taskIdx);
    }
  }

  handleCompletedTask(taskIdx, prop, value) {
    this.data.updateTaskObject(taskIdx, prop, value);
    // this.data.listCollection.systemLists.com
    // portData("completed", taskIdx);
  }

  // when user clicks, checkbox, not only does the currentList have to be updated, the
  // completed list must also gain the task
  handleTaskInput(e) {
    const target = e.target;
    const taskWrapper = target.closest(".task-wrapper");
    if (!taskWrapper) return;
    const taskIdx = this.getTaskIdxFromElement(taskWrapper);

    const propMap = {
      "task-input": "title",
      "task-notes": "notes",
      "task-date": "dueDate",
      "task-checkbox": "checked",
    };

    const property = Object.keys(propMap).find((className) =>
      target.className.includes(className)
    );

    if (property) {
      if (property === "task-notes") {
        target.style.height = "auto"; // shrinks to auto when content shrinks
        target.style.height = target.scrollHeight + "px"; // grows to fit content
      }
      property === "task-checkbox"
        ? this.handleCompletedTask(taskIdx, propMap[property], target.checked)
        : this.data.updateTaskObject(taskIdx, propMap[property], target.value);
    }
  }

  //////////////// PURE UI-RESPONSIVE METHODS ///////////////
  handleDoubleClicks(e) {
    const target = e.target;
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName)) return;
    const taskContent = target.closest(".task-content");
    if (!taskContent) return;
    const taskWrapper = taskContent.closest(".task-wrapper");

    if (taskContent.classList.contains("active")) {
      taskContent.classList.remove("active");
      this.activeTaskElement = null;
    } else {
      taskContent.classList.add("active");
      this.activeTaskElement = taskWrapper;
    }
  }

  handleTaskChanges(e) {
    const target = e.target;
    if (target.closest(".task-date")) {
      target.closest(".date-wrapper").classList.remove("focused");
    }
  }

  handleTaskKeydown(e) {
    const key = e.key;
    const target = e.target;

    if (key === "Enter" || key === "Escape") {
      if (target.closest(".task-input")) {
        target.style.width = target.value.length + 2 + "ch";
        target.blur();
      }
      if (target.closest(".task-date")) {
        target.closest(".date-wrapper").classList.remove("focused");
      }
    }

    if (key === "Enter") {
      if (target.closest(".task-checkbox")) {
        target.closest(".task-checkbox").click();
      }
    }

    if (key === "Escape") {
      if (target.closest(".task-notes")) {
        target.blur();
      } else if (target.closest(".task-priority")) {
        const priorityWrapper = target.closest(".priority-btn-wrapper");
        const taskWrapper = target.closest(".task-wrapper");
        const menu = taskWrapper.querySelector(
          ".priority-menu-wrapper.open-menu"
        );
        if (menu) {
          priorityWrapper.classList.remove("focused");
          menu.classList.remove("open-menu");
        }
      }
    }
  }

  applyEventListeners() {
    this.elements.sidebar.addEventListener(
      "click",
      this.handleListClicks.bind(this)
    );
    this.elements.addListBtn.addEventListener(
      "click",
      this.addEditableListElement.bind(this)
    );
    this.elements.mylistWrapper.addEventListener(
      "keydown",
      this.handleNewList.bind(this)
    );
    document.addEventListener("click", this.handleDocumentClicks.bind(this));
    this.elements.taskCollection.addEventListener(
      "click",
      this.handleTaskClicks.bind(this)
    );
    this.elements.taskCollection.addEventListener(
      "input",
      this.handleTaskInput.bind(this)
    );
    this.elements.taskCollection.addEventListener(
      "keydown",
      this.handleTaskKeydown.bind(this)
    );
    this.elements.taskCollection.addEventListener(
      "change",
      this.handleTaskChanges
    );
    this.elements.taskCollection.addEventListener(
      "dblclick",
      this.handleDoubleClicks.bind(this)
    );
    this.elements.nav.addEventListener("click", this.addTaskElement.bind(this));
  }

  focusStartingList() {
    const startListBtn = this.getCurrentListElementBtn();
    startListBtn.classList.add("focused-list");
  }

  initialize() {
    // initialize all data
    this.data.init();
    // render all elements with data
    this.renderer.init(
      this.data.currentListTitle,
      this.data.listCollection.systemLists,
      this.data.listCollection.myLists,
      this.data.currentTasks,
      this.elements.pageWrapper
    );
    // app sets up all needed elements
    this.queryElements({
      taskCollection: ".task-collection",
      header: "header",
      sidebar: "aside",
      nav: "nav",
      addListBtn: ".addList-btn",
      mylistWrapper: ".mylist-wrapper",
      headerHamburger: "header .hamburger",
    });
    //app passes elements object to sidebar manager for contstruction
    this.sidebarManager = new SidebarManager(this.elements);
    this.sidebarManager.init();
    // app applies functionality
    this.applyEventListeners();
    // app sets the focused state on the starting list
    this.focusStartingList();
  }
}
