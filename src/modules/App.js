import Data from "./Data.js";
import RenderUI from "./RenderUI.js";

export default class App {
  #elements = { pageWrapper: document.querySelector(".page-wrapper") };
  #activeTaskElement = null;

  constructor() {
    this.data = new Data();
    this.renderer = new RenderUI();
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
    this.renderer.renderEditableList();
    this.toggleButton(this.elements.addListBtn);
  }

  replaceEditableList(editableList, target) {
    const newList = this.data.createNewList(target.value);
    this.data.addList(newList);
    this.data.switchLists(newList.id);
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

  getListElementIdx(listBtnWrapper) {
    return parseInt(listBtnWrapper.dataset.id);
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

  handleListClicks(e) {
    const target = e.target;
    // return if the clicked element is not a list
    const listButton = target.closest(".list-btn");
    if (!listButton) return;

    // return if the clicked element is a new list
    const classList = listButton.classList;
    if (classList.contains("new-list")) return;

    const listBtnWrapper = target.closest(".list-btn-wrapper");
    const listIdx = this.getListElementIdx(listBtnWrapper);

    // return if the user clicks the list they are already on
    if (listIdx === this.data.currentListId) return;
    console.log("here");

    this.switchFocusedLists(listButton);
    this.data.switchLists(listIdx);
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

    //collapses the active content if the user clicks away from it
    if (this.activeTaskElement) {
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

  // re-render either the newList or the list when deleting tasks
  rerenderList(currList) {
    const listBtn = currList.querySelector(".focused-list");
    const newList = currList.querySelector(".new-list");
    const list = listBtn || newList;
    this.switchFocusedLists(list);
    this.renderer.replaceList(currList, this.data.currentList, {
      class: "focused-list",
    });
  }

  deleteTask(taskWrapper, taskIdx) {
    this.data.deleteTask(taskIdx);
    this.renderer.deleteTaskElement(taskWrapper);

    const listIdx = this.data.currentListId;
    const lists = [
      ...this.elements.sidebar.querySelectorAll(".list-btn-wrapper"),
    ];

    const listEl = lists.at(this.data.currentListIdx);
    this.rerenderList(listEl);
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
      this.deleteTask(taskWrapper, taskIdx);
    } else if (target.closest(".task-date")) {
      target.closest(".date-wrapper").classList.add("focused");
    } else if (target.closest(".priority-menu-option")) {
      this.handlePriorityOptionClick(target, taskWrapper, taskIdx);
    }
  }

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
        ? this.data.updateTaskObject(taskIdx, propMap[property], target.checked)
        : this.data.updateTaskObject(taskIdx, propMap[property], target.value);
    }
  }

  //////////////// PURE UI-RESPONSIVE METHODS ///////////////
  toggleSidebar(e) {
    const target = e.target;
    target.offsetParent.tagName === "HEADER"
      ? this.elements.sidebar.classList.add("opened-sidebar")
      : this.elements.sidebar.classList.remove("opened-sidebar");
  }

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
    this.elements.headerHamburger.addEventListener(
      "click",
      this.toggleSidebar.bind(this)
    );
    this.elements.sidebarHamburger.addEventListener(
      "click",
      this.toggleSidebar.bind(this)
    );
    this.elements.taskCollection.addEventListener(
      "dblclick",
      this.handleDoubleClicks.bind(this)
    );
  }

  focusStartingList() {
    const listElements = [
      ...this.elements.sidebar.querySelectorAll(".list-btn"),
    ];
    const startListIdx = this.data.currentListIdx;
    const startListBtn = listElements.at(startListIdx);
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
      addListBtn: ".addList-btn",
      mylistWrapper: ".mylist-wrapper",
      systemlistWrapper: ".system-list-wrapper",
      headerHamburger: "header .hamburger",
      sidebarHamburger: "aside .hamburger",
    });
    // app applies functionality
    this.applyEventListeners();
    // app sets the focused state on the starting list
    this.focusStartingList();
  }
}
