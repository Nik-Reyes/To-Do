import Data from "./Data.js";
import RenderUI from "./RenderUI.js";
import SidebarManager from "./SidebarManager.js";

export default class App {
  constructor() {
    this.data = new Data();
    this.renderer = new RenderUI();
    this.elements = {
      pageWrapper: document.querySelector(".page-wrapper"),
      overlay: document.querySelector(".overlay"),
    };
    this.activeTaskElement;
  }

  queryElements(selectors) {
    for (let key of Object.keys(selectors)) {
      this.elements[key] = document.querySelector(selectors[key]);
    }
  }

  // re-render either the newList or the list when deleting
  rerenderCurrentList(currList) {
    const newList = currList.querySelector(".new-list");
    this.switchFocusedLists(newList);
    this.renderer.replaceList(currList, this.data.currentList, {
      class: "list-btn stacked focused-list",
    });
  }

  addEditableListElement() {
    const list = this.renderer.renderEditableList(
      this.elements.innerMylistWrapper
    );
    list.querySelector(".newList-input").focus();
    this.toggleButton(this.elements.addListBtn);
  }

  replaceEditableList(editableList, target) {
    const newList = this.data.createNewList(target.value);
    this.data.addList(newList);
    this.data.switchLists(newList.id);
    this.rerenderCurrentList(editableList);
    this.renderer.updateHeader(this.data.currentListTitle);
    this.renderer.updateTasks(this.data.currentTasks);
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

  getTargetSystemList(targetListName) {
    return this.getSystemListElements().find((list) => {
      return list
        .querySelector(".list-title")
        .innerText.includes(targetListName.toUpperCase());
    });
  }

  getListElements() {
    return [...this.elements.sidebar.querySelectorAll(".list-btn-wrapper")];
  }

  getSystemListElements() {
    return [
      ...this.elements.systemListWrapper.querySelectorAll(".list-btn-wrapper"),
    ];
  }

  getCurrentListElementBtn() {
    return this.getCurrentListElement().querySelector(".list-btn");
  }

  getAllListElementBtnClasses() {
    return Array.from(this.elements.sidebar.querySelectorAll(".list-btn")).map(
      (btn) => {
        return { class: btn.className };
      }
    );
  }

  getCurrentListElement() {
    return this.getListElements().at(this.data.currentListIdx);
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

    this.switchFocusedLists(listButton);
    this.data.switchLists(listIdx);
    this.renderer.updateHeader(this.data.currentListTitle);
    setTimeout(() => {
      this.renderer.updateTasks(this.data.currentTasks);
    }, 0);
  }

  collapseActiveTaskElement(e) {
    if (e.composedPath().includes(this.activeTaskElement)) return;
    this.removeActiveTask();
  }

  handleDocumentClicks(e) {
    const target = e.target;
    const newList = this.elements.mylistWrapper.querySelector(".newList-input");
    const opendMenu = this.elements.taskCollection.querySelector(".open-menu");
    const focusedDate =
      this.elements.taskCollection.querySelector(".task-date.focused");
    const focusedPriorityWrapper = this.elements.taskCollection.querySelector(
      ".priority-btn-wrapper.focused"
    );

    //collapses the opened task if the user clicks away from it and the click isnt adding a task
    if (this.activeTaskElement && !target.closest(".add-task-btn")) {
      console.log("bubble 1");
      this.collapseActiveTaskElement(e);
    }
    // removes the new editable list if the user clicks away from it
    if (
      newList &&
      !target.closest(".new-list") &&
      !target.closest(".addList-btn")
    ) {
      console.log("bubble 2");
      const list = newList.closest(".list-btn-wrapper");
      this.renderer.removeEditableList(list);
      this.toggleButton(this.elements.addListBtn);
    }

    //forces unfocusing on the date wrapper when the user clicks away from it
    if (focusedDate && !target.closest(".task-date")) {
      console.log("bubble 3");
      focusedDate.classList.remove("focused");
    }

    if (focusedPriorityWrapper && !target.closest(".priority-btn-wrapper")) {
      console.log("bubble 4");
      focusedPriorityWrapper.classList.remove("focused");
    }

    if (
      opendMenu &&
      !target.closest(".task-priority") &&
      !target.closest(".open-menu")
    ) {
      console.log("bubble 5");
      opendMenu.classList.remove("open-menu");
    }
  }

  getNewPriorityRating(target) {
    return Array.from(target.classList).find((className) => {
      return className.includes("-priority");
    });
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

  rerenderTargetList(targetListElement, targetListData) {
    this.renderer.replaceList(targetListElement, targetListData);
  }

  rerenderLists() {
    const classes = this.getAllListElementBtnClasses();
    this.renderer.rerenderLists(
      this.data.listCollection.systemLists,
      this.data.listCollection.myLists,
      this.elements.innerSystemListWrapper,
      this.elements.innerMylistWrapper,
      classes
    );
  }

  deleteTaskElement(taskWrapper, taskIdx) {
    this.data.deleteTask(taskIdx);
    this.renderer.deleteTaskElement(taskWrapper);
    this.rerenderLists();
  }

  addTaskElement(e) {
    const target = e.target;
    //clicking on the add task button counts as clicking outside the task
    //when user clicks outside of task, the task closes
    //condition makes sure the task stays open
    if (!target.className.includes("add-task-btn")) return;

    //create the data, add data to current list, port data to all tasks list
    const destinationList = "All Tasks";
    const newTask = this.data.createNewTask();
    this.data.addTask(newTask);
    this.data.portTask(destinationList, newTask);

    //render the task in DOM
    const newTaskElement = this.renderer.renderTask(
      this.elements.taskCollection,
      newTask
    );

    //Make sure the task is added to the DOM in active mode
    const input = newTaskElement.querySelector(".task-input");
    input.focus();
    const taskContent = newTaskElement.querySelector(".task-content");
    this.handleTaskInputClick(input, newTaskElement, taskContent);

    //Rerender all lists to update the list task count
    this.rerenderLists();
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
      systemListWrapper: ".system-list-wrapper",
      innerMylistWrapper: ".inner-mylist-wrapper",
      innerSystemListWrapper: ".inner-system-list-wrapper",
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

  //////////////// PURE UI-RESPONSIVE METHODS ///////////////

  handleTaskClicks(e) {
    const target = e.target;
    const taskWrapper = target.closest(".task-wrapper");
    const taskContent = target.closest(".task-content");
    const taskIdx = this.getTaskIdxFromElement(taskWrapper);

    const taskClickHandlers = {
      "task-input": () =>
        this.handleTaskInputClick(target, taskWrapper, taskContent),
      "task-priority": () => this.handleTaskPriorityCLick(target, taskWrapper),
      "delete-svg-wrapper": () => this.deleteTaskElement(taskWrapper, taskIdx),
      "task-date": () => target.classList.add("focused"),
      "priority-menu-option": () =>
        this.handlePriorityOptionClick(target, taskWrapper, taskIdx),
      "task-notes": () => (target.style.height = target.scrollHeight + "px"),
    };

    for (let [selector, handler] of Object.entries(taskClickHandlers)) {
      if (target.className.includes(selector)) {
        handler();
        break;
      }
    }
  }

  handleTaskPriorityCLick(target, taskWrapper) {
    const menu = taskWrapper.querySelector(".priority-menu-wrapper");
    target.closest(".priority-btn-wrapper").classList.toggle("focused");
    this.togglePriorityMenu(menu);
  }

  focusStartingList() {
    const startListBtn = this.getCurrentListElementBtn();
    startListBtn.classList.add("focused-list");
  }

  toggleButton(button) {
    button.disabled
      ? button.removeAttribute("disabled")
      : button.setAttribute("disabled", "");
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
      console.log("removed");
      return;
    }

    // if there is no previous focused list, apply the focused list to the clicked list (this is the first ever clicked list)
    if (!prevList) {
      listButton.classList.add("focused-list");
      console.log("added");
    } else {
      //if there is a previous list, then remove the class and add it to the clicked list
      prevList.classList.remove("focused-list");
      console.log("removed");

      listButton.classList.add("focused-list");
      console.log("added");
    }
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
      target.classList.remove("focused");
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
}
