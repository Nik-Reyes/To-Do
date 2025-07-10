import Data from "./Data.js";
import List from "./List.js";
import RenderUI from "./RenderUI.js";
// import List from "./List.js";
// import Task from "./Task.js";

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

  // //accesses and sets currentListTasks, moved to Data.js
  // updateTaskObject(taskIndex, property, value) {
  //   if (taskIndex !== -1 && this.currentListTasks[taskIndex]) {
  //     this.currentListTasks[taskIndex][property] = value;
  //   }
  // }

  // toggleButton() {
  //   this.addListBtn.disabled
  //     ? this.addListBtn.removeAttribute("disabled")
  //     : this.addListBtn.setAttribute("disabled", "");
  // }

  // addEditableListElement() {
  //   this.renderer.renderEditableList();
  //   this.toggleButton();
  // }

  // //uses addListData, creates List
  // replaceEditableListElement(e) {
  //   if (e.target.value === "" && e.key === "Escape") {
  //     e.target.closest(".list-btn-wrapper").remove();
  //     this.toggleButton();
  //   } else if (e.key === "Enter" || e.key === "Escape") {
  //     if (e.target.value === "") return;
  //     const newListObj = new List(e.target.value);
  //     this.renderer.renderList(
  //       e.target.closest(".list-btn-wrapper"),
  //       newListObj
  //     );
  //     this.addListData(newListObj);
  //     this.toggleButton();
  //     this.switchLists(newListObj);
  //   }
  // }

  getListElementIdx(listBtnWrapper) {
    return parseInt(listBtnWrapper.dataset.id);
  }

  //accesses currentList; uses elementToObj, switchLists
  handleListClicks(e) {
    // return if the clicked element is not a list
    const listButton = e.target.closest(".list-btn");
    if (!listButton) return;

    // return if the clicked element is a new list
    const classList = listButton.classList;
    if (classList.contains("new-list")) return;

    const listBtnWrapper = e.target.closest(".list-btn-wrapper");
    const listIdx = this.getListElementIdx(listBtnWrapper);

    // return if the user clicks the list they are already on
    if (listIdx === this.data.currentListId) return;

    this.data.switchLists(listIdx);
    this.renderer.updateDisplay(
      this.data.currentListTitle,
      this.data.currentTasks
    );
  }

  // removeEditableList(newList) {
  //   newList.closest(".list-btn-wrapper").remove();
  // }

  collapseActiveTaskElement(e) {
    if (e.composedPath().includes(this.activeTaskElement)) return;
    this.removeActiveTask();
  }

  handleDocumentClicks(e) {
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
      !e.target.closest(".new-list") &&
      !e.target.closest(".addList-btn")
    ) {
      this.removeEditableList(newList);
      this.toggleButton();
    }

    //forces unfocusing on the date wrapper when the user clicks away from it
    if (focusedDateWrapper && !e.target.closest(".date-wrapper")) {
      focusedDateWrapper.classList.remove("focused");
    }

    if (focusedPriorityWrapper && !e.target.closest(".priority-btn-wrapper")) {
      focusedPriorityWrapper.classList.remove("focused");
    }

    if (
      opendMenu &&
      !e.target.closest(".task-priority") &&
      !e.target.closest(".open-menu")
    ) {
      console.log("here");
      opendMenu.classList.remove("open-menu");
    }
  }

  getNewPriorityRating(clickedElement) {
    return Array.from(clickedElement.classList).find((className) => {
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

  handlePriorityOptionClick(clickedElement, taskWrapper, taskIdx) {
    const taskPriorityBtn = taskWrapper.querySelector("button.task-priority");
    const menu = this.elements.taskCollection.querySelector(".open-menu");
    this.closeMenu(menu);

    //retrieve the user-selected priority rating
    const newPriority = this.getNewPriorityRating(clickedElement);
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

  handleTaskInputClick(clickedElement, taskWrapper, taskContent) {
    if (!taskContent) return;

    this.removeActiveTask();
    taskContent.classList.add("active");
    clickedElement.style.width = "100%";
    this.activeTaskElement = taskWrapper;
  }

  getTaskIdxFromElement(taskWrapper) {
    return Array.from(
      this.elements.taskCollection.querySelectorAll(".task-wrapper")
    ).indexOf(taskWrapper);
  }

  handleTaskClicks(e) {
    const clickedElement = e.target;
    const classArr = clickedElement.classList;
    const taskWrapper = clickedElement.closest(".task-wrapper");
    const taskContent = clickedElement.closest(".task-content");
    const taskIdx = this.getTaskIdxFromElement(taskWrapper);

    if (classArr.contains("task-input")) {
      this.handleTaskInputClick(clickedElement, taskWrapper, taskContent);
    } else if (classArr.contains("task-priority")) {
      const menu = taskWrapper.querySelector(".priority-menu-wrapper");
      clickedElement
        .closest(".priority-btn-wrapper")
        .classList.toggle("focused");
      this.togglePriorityMenu(menu);
    } else if (clickedElement.closest(".task-date")) {
      clickedElement.closest(".date-wrapper").classList.add("focused");
    } else if (clickedElement.closest(".priority-menu-option")) {
      this.handlePriorityOptionClick(clickedElement, taskWrapper, taskIdx);
    }
  }

  // handleTaskInput(e) {
  //   const taskWrapper = e.target.closest(".task-wrapper");
  //   if (!taskWrapper) return;
  //   const taskIndex = this.getTaskIdxFromElement(taskWrapper);

  //   const propMap = {
  //     "task-input": "title",
  //     "task-notes": "notes",
  //     "task-date": "dueDate",
  //     "task-checkbox": "checked",
  //   };

  //   const property = Object.keys(propMap).find((className) =>
  //     e.target.className.includes(className)
  //   );

  //   // uses updateTaskObject
  //   if (property) {
  //     if (property === "task-notes") {
  //       e.target.style.height = "auto"; // shrinks to auto when content shrinks
  //       e.target.style.height = e.target.scrollHeight + "px"; // grows to fit content
  //     }
  //     property === "task-checkbox"
  //       ? this.updateTaskObject(taskIndex, propMap[property], e.target.checked)
  //       : this.updateTaskObject(taskIndex, propMap[property], e.target.value);
  //   }
  // }

  // handleTaskChanges(e) {
  //   if (e.target.closest(".task-date")) {
  //     e.target.closest(".date-wrapper").classList.remove("focused");
  //   }
  // }

  // handleTaskKeydown(e) {
  //   if (e.key === "Enter" || e.key === "Escape") {
  //     if (e.target.closest(".task-input")) {
  //       e.target.style.width = e.target.value.length + 2 + "ch";
  //       e.target.blur();
  //     }
  //     if (e.target.closest(".task-date")) {
  //       e.target.closest(".date-wrapper").classList.remove("focused");
  //     }
  //   }

  //   if (e.key === "Enter") {
  //     if (e.target.closest(".task-checkbox")) {
  //       e.target.closest(".task-checkbox").click();
  //     }
  //   }

  //   if (e.key === "Escape") {
  //     if (e.target.closest(".task-notes")) {
  //       e.target.blur();
  //     } else if (e.target.closest(".task-priority")) {
  //       const taskWrapper = e.target.closest(".task-wrapper");
  //       const menu = taskWrapper.querySelector(".priority-menu-wrapper");
  //       if (menu.classList.contains("open-menu")) {
  //         menu.classList.remove("open-menu");
  //       }
  //     }
  //   }
  // }

  //////////////// PURE UI-RESPONSIVE METHODS ///////////////
  toggleSidebar(e) {
    if (e.target.offsetParent.tagName === "HEADER") {
      this.elements.sidebar.classList.add("opened-sidebar");
    }
    if (e.target.offsetParent.tagName === "ASIDE") {
      this.elements.sidebar.classList.remove("opened-sidebar");
    }
  }

  handleDoubleClicks(e) {
    if (["INPUT", "TEXTAREA", "BUTTON"].includes(e.target.tagName)) return;
    const taskContent = e.target.closest(".task-content");
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

  applyEventListeners() {
    this.elements.sidebar.addEventListener(
      "click",
      this.handleListClicks.bind(this)
    );
    // this.elements.addListBtn.addEventListener(
    //   "click",
    //   this.addEditableListElement.bind(this)
    // );
    //   this.mylistWrapper.addEventListener(
    //     "keydown",
    //     this.replaceEditableListElement.bind(this)
    //   );
    document.addEventListener("click", this.handleDocumentClicks.bind(this));
    this.elements.taskCollection.addEventListener(
      "click",
      this.handleTaskClicks.bind(this)
    );
    //   this.taskCollection.addEventListener(
    //     "input",
    //     this.handleTaskInput.bind(this)
    //   );
    //   this.taskCollection.addEventListener(
    //     "keydown",
    //     this.handleTaskKeydown.bind(this)
    //   );
    //   this.taskCollection.addEventListener("change", this.handleTaskChanges);
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

  initialize() {
    this.data.init();
    this.renderer.init(
      this.data.currentListTitle,
      this.data.listCollection.systemLists,
      this.data.listCollection.myLists,
      this.data.currentTasks,
      this.elements.pageWrapper
    );
    this.queryElements({
      taskCollection: ".task-collection",
      header: "header",
      sidebar: "aside",
      addListBtn: ".addList-btn",
      mylistWrapper: ".mylist-wrapper",
      headerHamburger: "header .hamburger",
      sidebarHamburger: "aside .hamburger",
    });
    this.applyEventListeners();
  }
}
