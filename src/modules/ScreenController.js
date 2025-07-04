import List from "./List.js";
import Task from "./Task.js";
import RenderUI from "./RenderUI.js";

export default class ScreenController {
  #header = null;
  #sidebar = null;
  #addListBtn = null;
  #currentList = null;
  #listCollection = [];
  #mylistWrapper = null;
  #currentListId = null;
  #taskCollection = null;
  #currentTaskIndex = null;
  #currentListTitle = null;
  #activeTaskElement = null;
  #previousTaskElement = null;
  #Renderer = new RenderUI(this);

  ////////////// FIELD GETTER METHODS ///////////////
  get header() {
    return this.#header;
  }

  get sidebar() {
    return this.#sidebar;
  }

  get addListBtn() {
    return this.#addListBtn;
  }

  get currentList() {
    return this.#currentList;
  }

  get listCollection() {
    return this.#listCollection;
  }

  get mylistWrapper() {
    return this.#mylistWrapper;
  }

  get currentListId() {
    return this.#currentListId;
  }

  get taskCollection() {
    return this.#taskCollection;
  }

  get currentTaskIndex() {
    return this.#currentTaskIndex;
  }

  get currentListTitle() {
    return this.#currentList.title;
  }

  get activeTaskElement() {
    return this.#activeTaskElement;
  }

  get previousTaskElement() {
    return this.#previousTaskElement;
  }

  get Renderer() {
    return this.#Renderer;
  }

  ////////////// HELPER GETTER METHODS ///////////////
  get lists() {
    return [
      ...this.#listCollection.systemLists,
      ...this.#listCollection.myLists,
    ];
  }

  get currentTask() {
    return this.#currentTaskIndex !== null
      ? this.currentListTasks[this.#currentTaskIndex]
      : null;
  }

  get currentListTasks() {
    return this.currentList.tasks;
  }

  get numberOfLists() {
    return this.lists.length;
  }

  get firstMyList() {
    return this.#listCollection.systemLists.length;
  }

  get hasListCollection() {
    return this.#listCollection.length >= 1;
  }

  ////////////// SETTER METHODS ///////////////
  set currentList(listId) {
    this.#currentList = this.lists.at(listId);
    this.currentListId = listId;
  }

  set currentListId(id) {
    this.#currentListId = id;
  }

  set listCollection(newList) {
    this.#listCollection = newList;
  }

  set header(header) {
    this.#header = header;
  }

  set currentListTitle(title) {
    this.#currentListTitle = title;
  }

  set sidebar(aside) {
    this.#sidebar = aside;
  }

  set mylistWrapper(wrapper) {
    this.#mylistWrapper = wrapper;
  }

  set taskCollection(collection) {
    this.#taskCollection = collection;
  }

  set addListBtn(button) {
    this.#addListBtn = button;
  }

  set activeTaskElement(el) {
    this.#activeTaskElement = el;
  }

  set previousTaskElement(el) {
    this.#previousTaskElement = el;
  }

  set currentTaskIndex(idx) {
    this.#currentTaskIndex = idx;
  }

  ////////////// ACTION METHODS ///////////////
  // Event listener listening for any textarea, input, checkbox, or priority button change within the taskCollection will call this function
  // this.updateTask is responsible for dynamically updating the object data of the current list
  // since the event listener is attached to the task collection, this function needs to
  // get the current task (closest() function is handy here) and also get the value of the
  // current input
  // With the current input, update the lists task object
  // This function is solely responsible for updating the data, the task elements
  // appearance is handled by the individual task
  updateTask() {}

  listElementToListObject(element) {
    const elId = element.dataset.id;
    return this.lists.at(elId);
  }

  initializeDOMEelements() {
    this.header = this.Renderer.header;
    this.taskCollection = this.Renderer.taskCollection;
    this.sidebar = this.Renderer.sidebar;
    this.addListBtn = this.sidebar.querySelector(".addList-btn");
    this.mylistWrapper = this.sidebar.querySelector(".mylist-wrapper");
  }

  // addListData, addEditableListElement, replaceEditableListElement work together to add a task
  addListData(newListObj) {
    this.listCollection.myLists.push(newListObj);
  }

  ////////////// EVENT LISTENER METHODS ///////////////
  toggleButton() {
    this.addListBtn.disabled
      ? this.addListBtn.removeAttribute("disabled")
      : this.addListBtn.setAttribute("disabled", "");
  }

  addEditableListElement() {
    this.Renderer.renderEditableList();
    this.toggleButton();
  }

  replaceEditableListElement(e) {
    if (e.target.value === "" && e.key === "Escape") {
      e.target.closest(".list-btn-wrapper").remove();
      this.toggleButton();
    } else if (e.key === "Enter" || e.key === "Escape") {
      if (e.target.value === "") return;
      const newListObj = new List(e.target.value);
      this.Renderer.renderList(
        e.target.closest(".list-btn-wrapper"),
        newListObj
      );
      this.addListData(newListObj);
      this.toggleButton();
      this.switchLists(newListObj);
    }
  }

  // expects a list object
  switchLists(list) {
    //if the current list is the selected list, return

    this.currentList = list.id;
    this.currentListTitle = list.title;
    this.Renderer.renderTasks();
    this.Renderer.headerTitle = this.currentListTitle;
  }

  handleSidebarClick(e) {
    if (e.target.closest(".list-btn") && !e.target.closest(".new-list")) {
      const clickedList = this.listElementToListObject(
        e.target.closest(".list-btn-wrapper")
      );

      if (clickedList === this.currentList) return;
      this.switchLists(clickedList);
    }
  }

  removeEditableList(newList) {
    newList.closest(".list-btn-wrapper").remove();
    this.toggleButton();
  }

  handleDocumentClicks(e) {
    const newList = this.mylistWrapper.querySelector(".newList-input");

    if (
      newList &&
      !e.target.closest(".new-list") &&
      !e.target.closest(".addList-btn")
    ) {
      this.removeEditableList(newList);
    }
    if (e.target.closest(".priority-menu-option")) return;

    // Any time i click outside the current task wrapper, remove active state from current task content
    const withinActiveWrapper = e
      .composedPath()
      .includes(this.activeTaskElement);
    if (withinActiveWrapper === false) {
      this.removeActiveTask();
    }
  }

  // the active task element is whichever task content has class active or whichever task checkbox is clicked
  // class active is gained by double clicking or clicking the input of a task
  removeActiveTask() {
    const activeTask = this.taskCollection.querySelector(
      ".task-content.active"
    );
    if (!activeTask) return;

    const taskInput = activeTask.querySelector(".task-input");
    if (taskInput) {
      taskInput.style.width = `${taskInput.value.length + 2}ch`;
    }
    activeTask.classList.remove("active");
    this.previousTaskElement = activeTask.offsetParent;
    this.activeTaskElement = null;
  }

  setActiveTask(e, taskWrapper, taskContent, taskIndex) {
    this.removeActiveTask();

    if (taskContent && e.target) {
      taskContent.classList.add("active");
      e.target.style.width = "100%";
      this.activeTaskElement = taskWrapper;
      this.currentTaskIndex = taskIndex;
    }
  }

  getTaskIdxFromElement(taskWrapper) {
    const tasks = Array.from(
      this.taskCollection.querySelectorAll(".task-wrapper")
    );
    return tasks.indexOf(taskWrapper);
  }

  updateTaskObject(taskIndex, property, value) {
    if (taskIndex !== -1 && this.currentListTasks[taskIndex]) {
      const currentTaskObj = this.currentTask;

      switch (property) {
        case "title":
          currentTaskObj.title = value;
          break;
        case "completed":
          currentTaskObj.completed = value;
          break;
        case "notes":
          currentTaskObj.notes = value;
          break;
        case "priority":
          currentTaskObj.priority = value;
          break;
        case "dueDate":
          currentTaskObj.dueDate = value;
      }
    }
  }

  handleTaskInputClick(e, taskWrapper, taskContent, taskIndex) {
    this.setActiveTask(e, taskWrapper, taskContent, taskIndex);
  }

  handleCheckboxClick(e, taskWrapper, taskIndex) {
    this.currentTaskIndex = taskIndex;
    this.updateTaskObject(taskIndex, "completed", e.target.checked);
  }

  handlePriorityOptionClick(e, taskWrapper, taskIndex) {
    const priorityMenuWrapper = taskWrapper.querySelector(
      ".priority-menu-wrapper"
    );
    const menuId = priorityMenuWrapper.getAttribute("id");
    const taskPriorityBtn = taskWrapper.querySelector("button.task-priority");
    const taskPriorityColorPanel = taskWrapper.querySelector(".priority-panel");
    priorityMenuWrapper.hidePopover();
    taskPriorityBtn.blur();

    // Change the color of the priority panel
    const newPriority = Array.from(e.target.classList).find((className) => {
      return className.includes("-priority");
    });
    taskPriorityColorPanel.classList.forEach((className) => {
      if (className.includes("-priority")) {
        taskPriorityColorPanel.classList.replace(className, newPriority);
      }
    });
    this.updateTaskObject(taskIndex, "priority", newPriority);
  }

  handleTaskClicks(e) {
    const taskWrapper = e.target.closest(".task-wrapper");
    const taskContent = e.target.closest(".task-content");
    const taskIndex = this.getTaskIdxFromElement(taskWrapper);

    if (e.target.classList.contains("task-input")) {
      this.handleTaskInputClick(e, taskWrapper, taskContent, taskIndex);
    } else if (e.target.classList.contains("task-checkbox")) {
      this.handleCheckboxClick(e, taskWrapper, taskIndex);
    } else if (e.target.closest(".priority-menu-option")) {
      this.handlePriorityOptionClick(e, taskWrapper, taskIndex);
    }
  }

  handleDoubleClicks(e) {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "BUTTON"
    ) {
      return;
    }
    if (e.target.closest(".task-content")) {
      const taskWrapper = e.target.closest(".task-wrapper");
      const taskContent = e.target.closest(".task-content");
      const taskIndex = this.getTaskIdxFromElement(taskWrapper);

      if (taskContent.classList.contains("active")) {
        taskContent.classList.remove("active");
        this.previousTaskElement = taskWrapper;
        this.activeTaskElement = null;
      } else if (!taskContent.classList.contains("active")) {
        taskContent.classList.add("active");
        this.activeTaskElement = taskWrapper;
        this.currentTaskIndex = taskIndex;
      }
    }
  }

  handleTaskInput(e) {
    console.log(e);
  }

  applyEventListeners() {
    this.addListBtn.addEventListener(
      "click",
      this.addEditableListElement.bind(this)
    );
    this.mylistWrapper.addEventListener(
      "keydown",
      this.replaceEditableListElement.bind(this)
    );
    this.taskCollection.addEventListener(
      "click",
      this.handleTaskClicks.bind(this)
    );
    this.taskCollection.addEventListener(
      "input",
      this.handleTaskInput.bind(this)
    );
    this.sidebar.addEventListener("click", this.handleSidebarClick.bind(this));
    document.addEventListener("click", this.handleDocumentClicks.bind(this));
    document.addEventListener("dblclick", this.handleDoubleClicks.bind(this));
  }

  initialize() {
    this.Renderer.render(() => {
      this.initializeDOMEelements();
      this.applyEventListeners();
    });
  }
}
