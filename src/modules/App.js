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
    this.wrapperClassNames;
    this.initialize();
  }

  initialize() {
    // initialize all data
    this.data.init();
    //app sets up classWrapper states
    this.setSectionStates();
    // render all elements with data
    this.renderer.init(
      this.data.currentListTitle,
      this.data.listCollection.systemLists,
      this.data.listCollection.myLists,
      this.data.groupMyListTasks(),
      this.wrapperClassNames,
      this.data.sectionHasTasks(),
      this.elements.pageWrapper,
      this.data.listHasTasks()
    );
    // app sets up all needed elements
    this.queryElements({
      taskCollectionWrapper: ".task-collection-wrapper",
      header: "header",
      sidebar: "aside",
      nav: ".navigation",
      addListBtn: ".addList-btn",
      mylistWrapper: ".mylist-wrapper",
      systemListWrapper: ".system-list-wrapper",
      innerMylistWrapper: ".inner-mylist-wrapper",
      innerSystemListWrapper: ".inner-system-list-wrapper",
      headerHamburger: "header .hamburger",
      headerTitle: ".header .header-title",
    });
    //app passes elements object to sidebar manager for contstruction
    new SidebarManager(this.elements).init();
    // app applies functionality
    this.applyEventListeners();
    // app sets the focused state on the starting list
    this.focusStartingList();
  }

  getListElementIdx(listBtnWrapper) {
    return this.getListElements().indexOf(listBtnWrapper);
  }

  getListElements() {
    return [...this.elements.sidebar.querySelectorAll(".list-btn-wrapper")];
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

  getTaskIdxFromElement(taskWrapper) {
    return [
      ...this.elements.taskCollectionWrapper.querySelectorAll(".task-wrapper"),
    ].indexOf(taskWrapper);
  }

  getCurrentListElement() {
    return this.getListElements().at(this.data.currentListIdx);
  }

  queryElements(selectors) {
    for (let key of Object.keys(selectors)) {
      this.elements[key] = document.querySelector(selectors[key]);
    }
  }

  getSectionElements() {
    return Array.from(
      this.elements.taskCollectionWrapper.querySelectorAll(
        ".sub-collection-wrapper"
      )
    );
  }

  setSectionStates() {
    // renderer must have made initial render for this to be true
    if (this.elements.taskCollectionWrapper) {
      const sectionElements = this.getSectionElements();
      //is true only if the user is on the All Tasks list
      if (sectionElements.length !== 0) {
        this.wrapperClassNames = sectionElements.map((wrapper) => {
          return {
            class: wrapper.className,
          };
        });
      } else {
        const currNumberOfSections = this.data.numberOfMyLists;
        const prevNumberOfSections = this.wrapperClassNames.length;
        const numberOfClassNamesToMake =
          currNumberOfSections - prevNumberOfSections;
        if (numberOfClassNamesToMake === 0) return; //no new lists made

        for (let i = 0; i < numberOfClassNamesToMake; i++) {
          this.wrapperClassNames.push({
            class: "sub-collection-wrapper sub-collection-expanded",
          });
        }
      }
    } else {
      // if this is an initial render, assign default classes to each section wrapper
      const classNames = [];
      for (let i = 0; i < this.data.numberOfMyLists; i++) {
        classNames.push({
          class: "sub-collection-wrapper sub-collection-expanded",
        });
      }
      this.wrapperClassNames = classNames;
    }
  }

  // re-render either the newList or the list when deleting
  rerenderCurrentList(listElement) {
    const newList = listElement.querySelector(".new-list");
    this.switchFocusedLists(newList);
    this.renderer.replaceList(listElement, this.data.currentList, {
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

  replaceEditableList(editableListElement, target) {
    const newListObj = this.data.createNewList(target.value);
    this.data.addList(newListObj);
    this.data.switchLists(-1); //-1 being the last list (the newly created list object)
    this.rerenderCurrentList(editableListElement);
    this.renderer.updateHeaderTitle(
      this.elements.headerTitle,
      this.data.currentListTitle
    );
    this.renderer.createGenericTaskCollection(
      this.data.currentTasks,
      this.data.listHasTasks()
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

  handleListClicks(e) {
    const target = e.target;
    // return if the clicked element is not a list
    const listButton = target.closest(".list-btn");
    if (!listButton) return;

    // return if the clicked element is an editable list button
    const classList = listButton.classList;
    if (classList.contains("new-list")) return;

    const listBtnWrapper = target.closest(".list-btn-wrapper");
    const listElementIdx = this.getListElementIdx(listBtnWrapper);

    // return if the user clicks the list they are already on
    if (listElementIdx === this.data.currentListIdx) return;

    this.switchFocusedLists(listButton);

    this.data.switchLists(listElementIdx);
    this.renderer.updateHeaderTitle(
      this.elements.headerTitle,
      this.data.currentListTitle
    );

    if (this.data.currentListTitle === "All Tasks") {
      this.data.updateAllTasksOrder();
      this.setSectionStates();
      this.renderer.createAllTasksCollection(
        this.data.groupMyListTasks(),
        this.wrapperClassNames,
        this.data.sectionHasTasks(),
        this.data.listHasTasks()
      );
    } else {
      this.renderer.createGenericTaskCollection(
        this.data.currentTasks,
        this.data.listHasTasks()
      );
    }
  }

  collapseActiveTaskElement(e) {
    if (e.composedPath().includes(this.activeTaskElement)) return;
    this.removeActiveTask();
  }

  handleDocumentClicks(e) {
    const target = e.target;
    const newList = this.elements.mylistWrapper.querySelector(".newList-input");
    const opendMenu =
      this.elements.taskCollectionWrapper.querySelector(".open-menu");
    const focusedDate =
      this.elements.taskCollectionWrapper.querySelector(".task-date.focused");
    const focusedPriorityWrapper =
      this.elements.taskCollectionWrapper.querySelector(
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
    if (focusedDate && !target.closest(".task-date")) {
      focusedDate.classList.remove("focused");
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

  handlePriorityOptionClick(target, taskWrapper, taskIdx) {
    const menu =
      this.elements.taskCollectionWrapper.querySelector(".open-menu");
    this.closeMenu(menu);

    //retrieve the user-selected priority rating
    const newPriority = this.getNewPriorityRating(target);
    // Change the color of the priority panel
    this.changePriorityPanelColor(taskWrapper, newPriority);
    // update the task object priority property
    this.data.updateTaskObjectWithIndex(taskIdx, "priority", newPriority);
  }

  handleTaskInputClick(target, taskWrapper, taskContent) {
    if (!taskContent) return;
    this.removeActiveTask();
    taskContent.classList.add("active");
    target.style.width = "100%";
    this.activeTaskElement = taskWrapper;
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
    if (this.data.currentListTitle === "Today") {
      newTask.dueDate = this.data.todaysDate;
      this.data.portTask("Scheduled", newTask);
    }
    this.data.addTask(newTask);
    //prohibit adding the task twice if user is on the All Tasks list
    if (this.data.currentListTitle !== destinationList) {
      this.data.portTask(destinationList, newTask);
    }

    //render the task in DOM
    const newTaskElement = this.renderer.renderTask(
      this.elements.taskCollectionWrapper.querySelector(".task-collection"),
      newTask
    );

    //Make sure the task is added to the DOM in active mode
    const input = newTaskElement.querySelector(".task-input");
    input.focus();
    input.select();
    const taskContent = newTaskElement.querySelector(".task-content");
    this.handleTaskInputClick(input, newTaskElement, taskContent);

    //Rerender all lists to update the list task count
    //timout allows the new list to be properly removed (if there is one) and for the addList button to toggle
    setTimeout(() => this.rerenderLists(), 0);
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
        this.data.updateTaskObjectWithIndex(
          taskIdx,
          propMap[property],
          target.value
        );
      } else if (property === "task-checkbox") {
        this.handleTaskCheckBoxInput(taskIdx);
      } else if (property === "task-date") {
        this.handleTaskDateInput(target, taskIdx, target.value);
      } else {
        this.data.updateTaskObjectWithIndex(
          taskIdx,
          propMap[property],
          target.value
        );
      }
    }
  }

  handleTaskDateInput(dateInput, taskIdx, date) {
    dateInput.classList.remove("focused");
    //for mobile devices that don't abide by the html date input min attribute, remove the value, do not update object
    if (this.data.isDateInPast(date)) {
      dateInput.value = "";
      dateInput.blur();
      dateInput.focus();
      return;
    }

    this.data.handleNewDate(taskIdx, date);
    if (this.data.currentListTitle === "Today") {
      //task in today has been deleted, rerender to show deletion
      this.renderer.renderTasks(this.data.currentTasks);
    }
    if (dateInput.value === "" && this.data.currentListTitle === "Scheduled") {
      this.renderer.renderTasks(this.data.currentTasks);
    }

    dateInput.setAttribute("value", date);
    this.rerenderLists();
  }

  handleTaskCheckBoxInput(taskIdx) {
    this.data.handleCheckedTask(taskIdx);
    this.rerenderLists();
    if (this.data.currentListTitle === "Completed") {
      this.renderer.renderTasks(this.data.currentTasks);
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
    this.elements.nav.addEventListener("click", this.addTaskElement.bind(this));
    this.elements.taskCollectionWrapper.addEventListener(
      "click",
      this.handleTaskWrapperClicks.bind(this)
    );
    this.elements.taskCollectionWrapper.addEventListener(
      "input",
      this.handleTaskInput.bind(this)
    );
    this.elements.taskCollectionWrapper.addEventListener(
      "keydown",
      this.handleTaskKeydown.bind(this)
    );
    this.elements.taskCollectionWrapper.addEventListener(
      "dblclick",
      this.handleDoubleClicks.bind(this)
    );
  }

  //////////////// PURE UI-RESPONSIVE METHODS ///////////////

  handleTaskWrapperClicks(e) {
    const target = e.target;

    if (e.target.className.includes("expand-collapse")) {
      const sectionWrapper = target.closest(".section-wrapper");
      const subCollectionWrapper = sectionWrapper.nextSibling;

      //update section expended state if user clicks expanded/collapse
      if (subCollectionWrapper) {
        const comparitor = "collapse";
        subCollectionWrapper.classList.toggle("sub-collection-expanded");
        target.innerText =
          target.innerText.toLowerCase() === comparitor ? "expand" : comparitor;
        this.setSectionStates();
      }
    } else if (target.closest(".task-wrapper")) {
      const taskWrapper = target.closest(".task-wrapper");
      const taskContent = target.closest(".task-content");
      const taskIdx = this.getTaskIdxFromElement(taskWrapper);

      const taskClickHandlers = {
        "task-input": () =>
          this.handleTaskInputClick(target, taskWrapper, taskContent),
        "task-priority": () =>
          this.handleTaskPriorityCLick(target, taskWrapper),
        "delete-svg-wrapper": () =>
          this.deleteTaskElement(taskWrapper, taskIdx),
        "task-date": () => {
          target.classList.add("focused");
        },
        "priority-menu-option": () =>
          this.handlePriorityOptionClick(target, taskWrapper, taskIdx),
      };

      for (let [selector, handler] of Object.entries(taskClickHandlers)) {
        if (target.className.includes(selector)) {
          handler();
          break;
        }
      }
    }
  }

  handleTaskPriorityCLick(target, taskWrapper) {
    const menu = taskWrapper.querySelector(".priority-menu-wrapper");
    const btnWrapper = target.closest(".priority-btn-wrapper");
    btnWrapper.classList.toggle("focused");
    this.togglePriorityMenu(menu);
    this.setPriorityMenuPosition(menu, btnWrapper);
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

  setPriorityMenuPosition(menu, btn) {
    menu.style.left = "";
    const menuCoords = menu.getBoundingClientRect();
    const buttonCoords = btn.getBoundingClientRect();

    const difference = buttonCoords.left - menuCoords.left;
    const gap = 15;

    const trueOffset = (menuCoords.width - buttonCoords.width) / 2;

    menu.style.left = `${difference - trueOffset}px`;
    menu.style.bottom = `${buttonCoords.height + gap}px`;
  }

  removeActiveTask() {
    const activeTask =
      this.elements.taskCollectionWrapper.querySelector(".active");
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
