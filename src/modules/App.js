import Data from "./Data.js";
import RenderUI from "./RenderUI.js";
import SidebarManager from "./SidebarManager.js";

export default class App {
  constructor() {
    this.data = new Data();
    this.renderer = new RenderUI();
    this.activeTaskElement;
    this.listBtnWrapperClassNames;
    this.elements = {
      pageWrapper: document.querySelector(".page-wrapper"),
      overlay: document.querySelector(".overlay"),
    };
    this.initialize();
  }

  initialize() {
    this.data.init();
    this.setSectionStates();
    this.renderer.init(
      this.data.currentListTitle,
      this.data.listCollection.systemLists,
      this.data.listCollection.myLists,
      this.data.getGroupedTasks(),
      this.listBtnWrapperClassNames,
      this.data.sectionHasTasks(),
      this.elements.pageWrapper,
      this.data.getTaskCollectionState()
    );

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

    new SidebarManager(this.elements).init();
    this.applyEventListeners();
    this.focusStartingList();
  }

  getListElements() {
    return [...this.elements.sidebar.querySelectorAll(".list-btn-wrapper")];
  }

  getListElementIdx(listBtnWrapper) {
    return this.getListElements().indexOf(listBtnWrapper);
  }

  getCurrentListElement() {
    return this.getListElements().at(this.data.currentListIdx);
  }

  getSectionHeader(id) {
    const sectionWrappers = Array.from(
      this.elements.taskCollectionWrapper.querySelectorAll(".section-wrapper")
    );
    return sectionWrappers.find((wrapper) => wrapper.dataset.id === id);
  }

  getAllTasksListElement() {
    const allTasksId = this.data.getAllTasksListID();
    if (!allTasksId) throw Error("All Tasks ID DNE!");
    return this.getListElements().find((el) => el.dataset.id === allTasksId);
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

  getAllListElementBtns() {
    return this.elements.sidebar.querySelectorAll(".list-btn");
  }

  getTaskIdxFromElement(taskWrapper) {
    return [
      ...this.elements.taskCollectionWrapper.querySelectorAll(".task-wrapper"),
    ].indexOf(taskWrapper);
  }

  getListElement(idx) {
    return this.getListElements().at(idx);
  }

  queryElements(selectors) {
    Object.entries(selectors).forEach(([key, selector]) => {
      this.elements[key] = document.querySelector(selector);
    });
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
        this.listBtnWrapperClassNames = sectionElements.map((wrapper) => {
          return {
            class: wrapper.className,
          };
        });
      } else {
        //registers additional classes to match total number of myLists
        const currNumberOfSections = this.data.numberOfMyLists;
        const prevNumberOfSections = this.listBtnWrapperClassNames.length;
        const numberOfNewSections = currNumberOfSections - prevNumberOfSections;

        for (let i = 0; i < numberOfNewSections; i++) {
          this.listBtnWrapperClassNames.push({
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
      this.listBtnWrapperClassNames = classNames;
    }
  }

  // re-render either the newList or the list when deleting
  rerenderCurrentList(listElement) {
    const newList = listElement.querySelector(".new-list");
    this.switchFocusedLists(newList);
    this.renderer.rerenderList(listElement, this.data.currentList, {
      class: "list-btn stacked focused-list",
    });
  }

  addEditableListElement() {
    const list = this.renderer.renderNewList(this.elements.innerMylistWrapper);
    list.querySelector(".newList-input").focus();
    this.toggleButton(this.elements.addListBtn);
  }

  replaceNewList(editableListElement, target) {
    const newListObj = this.data.createNewList(target.value);
    this.data.addList(newListObj);
    this.data.updateCurrentList(-1); //-1 being the last list (the newly created list object)
    this.rerenderCurrentList(editableListElement);
    this.renderer.updateHeaderTitle(
      this.elements.headerTitle,
      this.data.currentListTitle
    );
    this.renderer.renderGenericTaskCollection(
      this.data.currentTasks,
      this.data.getTaskCollectionState()
    );
  }

  handleNewList(e) {
    const { target, key } = e;
    const newList = target.closest(".new-list");
    if (!newList) return;

    const newlistWrapper = newList.closest(".list-btn-wrapper");

    if (target.value === "" && key === "Escape") {
      this.renderer.removeEditableList(newlistWrapper);
      this.toggleButton(this.elements.addListBtn);
    } else if (key === "Enter" || key === "Escape") {
      if (target.value === "") return;
      this.replaceNewList(newlistWrapper, target);
      this.toggleButton(this.elements.addListBtn);
    }
  }

  requestAllTasksCollection() {
    this.data.updateAllTasksOrder();
    this.data.updateAllTasksListOrder();
    this.setSectionStates();
    this.renderer.renderAllTasksCollection(
      this.data.getGroupedTasks(),
      this.listBtnWrapperClassNames,
      this.data.sectionHasTasks(),
      this.data.getTaskCollectionState()
    );
  }

  requestDisabledTasksCollection() {
    this.renderer.renderDisabledCollection(
      this.data.currentTasks,
      this.data.getTaskCollectionState()
    );
  }

  requestGenericTaskCollection() {
    this.renderer.renderGenericTaskCollection(
      this.data.currentTasks,
      this.data.getTaskCollectionState()
    );
  }

  switchLists(listElementIdx, listBtn) {
    this.switchFocusedLists(listBtn);
    this.data.updateCurrentList(listElementIdx);
    this.renderer.updateHeaderTitle(
      this.elements.headerTitle,
      this.data.currentListTitle
    );

    const collectionMap = {
      "All Tasks": () => this.requestAllTasksCollection(),
      Today: () => this.requestDisabledTasksCollection(),
      Scheduled: () => this.requestDisabledTasksCollection(),
      Completed: () => this.requestDisabledTasksCollection(),
      generic: () => this.requestGenericTaskCollection(),
    };

    for (let [collectionType, handler] of Object.entries(collectionMap)) {
      if (collectionType === "generic") {
        handler();
        break;
      } else if (this.data.currentListTitle === collectionType) {
        handler();
        break;
      }
    }
  }

  deleteListElement(listBtnWrapper) {
    const listId = listBtnWrapper.dataset.id;

    const listElement = this.getAllTasksListElement();
    const listElementIdx = this.getListElementIdx(listElement);
    if (!listElement || listElementIdx === -1) return;

    this.data.deleteList(listId);
    this.switchLists(listElementIdx, listElement.querySelector(".list-btn"));
    this.rerenderLists();
  }

  editListElement(listBtnWrapper) {
    this.renderer.renderEditableList(listBtnWrapper);
  }

  confirmListEdit(listElementIdx, listBtnWrapper, input) {
    const newTitle = input.value;

    input.setCustomValidity("");
    if (!input.validity.valid) {
      input.setCustomValidity("This List must have a title");
      input.reportValidity();
      return;
    }

    //update the list object with the new title
    this.data.updateListObject(listElementIdx, "title", newTitle);
    const currentListObj = this.data.getListFromListElement(listElementIdx);

    if (this.data.currentListIsAllTasks()) {
      const list = this.data.getListFromListElement(listElementIdx);

      const listHasTasks = this.data.listHasTasks(list);
      const sectionHeader = this.getSectionHeader(list.id);
      if (!sectionHeader) return;
      this.renderer.rerenderSectionHeader(
        sectionHeader,
        list.title,
        null,
        listHasTasks,
        list.id
      );
    }

    //rerender the header to update the title
    if (this.data.isOnCurrentListByID(currentListObj.id)) {
      this.renderer.updateHeaderTitle(this.elements.headerTitle, newTitle);
      this.renderer.rerenderList(listBtnWrapper, currentListObj, {
        class: "list-btn stacked focused-list",
      });
      return;
    }

    this.renderer.rerenderList(listBtnWrapper, currentListObj);
  }

  deleteTaskElement(taskWrapper, taskIdx) {
    const list = this.data.getListFromtask(taskIdx);
    this.data.deleteTask(taskIdx);
    this.renderer.deleteTaskElement(taskWrapper);
    this.rerenderLists();

    if (this.data.currentListIsAllTasks()) {
      const listHasTasks = this.data.listHasTasks(list);
      if (!listHasTasks) {
        const sectionHeader = this.getSectionHeader(list.id);
        if (!sectionHeader) return;
        this.renderer.rerenderSectionHeader(
          sectionHeader,
          list.title,
          null,
          listHasTasks,
          sectionHeader.dataset.id
        );
      }
      return;
    }

    if (this.data.currentTasks.length === 0) {
      this.renderer.renderGenericTaskCollection(this.currentTasks, "empty");
    }
  }

  cancelListEdit(listElementIdx, listBtnWrapper) {
    //get currentList Obj
    const canceledListObj = this.data.lists.at(listElementIdx);

    //rerender the list element
    if (this.data.isOnCurrentListByID(canceledListObj.id)) {
      this.renderer.rerenderList(listBtnWrapper, canceledListObj, {
        class: "list-btn stacked focused-list",
      });
    }

    this.renderer.rerenderList(listBtnWrapper, canceledListObj);
  }

  handleListBtnClick(listElementIdx, listBtn) {
    if (listElementIdx === this.data.currentListIdx) return;
    this.switchLists(listElementIdx, listBtn);
  }

  openEditOptions(listBtnWrapper) {
    const hoverWrapper = listBtnWrapper.querySelector(
      ".hoverable-list-content-wrapper"
    );

    if (hoverWrapper.classList.contains("expand-row")) {
      hoverWrapper.classList.remove("expand-row");
      return;
    }

    const lists = document.querySelectorAll(".expand-row");
    lists.forEach((list) => list.classList.remove("expand-row"));

    if (hoverWrapper.className.includes("expand-row")) {
      hoverWrapper.classList.add("collapse-row");
      hoverWrapper.addEventListener(
        "transitionend",
        () => {
          hoverWrapper.classList.remove("expand-row", "collapse-row");
        },
        { once: true }
      );
    }

    hoverWrapper.classList.add("expand-row");
  }

  //should be handelSideBarClicks: check if target is addList btn, list element, or any of the button clicks (edit, delete, confirm, cancel)
  handleSidebarClicks(e) {
    const target = e.target;

    if (e.target.closest(".addList-btn")) {
      this.addEditableListElement(e);
    } else if (e.target.closest(".list-btn-wrapper")) {
      const listBtnWrapper = e.target.closest(".list-btn-wrapper");
      const listBtn = listBtnWrapper.querySelector("button");
      const listElementIdx = this.getListElementIdx(listBtnWrapper);
      const listInput = listBtnWrapper.querySelector("input");

      const listElementHandlers = {
        ".new-list": () => {
          return;
        },
        ".list-btn": () => this.handleListBtnClick(listElementIdx, listBtn),
        ".edit-list": () => this.openEditOptions(listBtnWrapper, target),
        ".edit-list-btn": () => this.editListElement(listBtnWrapper),
        ".delete-list-btn": () => this.deleteListElement(listBtnWrapper),
        ".confirm-edit-btn": () =>
          this.confirmListEdit(listElementIdx, listBtnWrapper, listInput),
        ".cancel-edit-btn": () =>
          this.cancelListEdit(listElementIdx, listBtnWrapper),
      };
      for (let [selector, handler] of Object.entries(listElementHandlers)) {
        if (target.closest(selector)) {
          handler();
          break;
        }
      }
    }
  }

  handleSidebarInput(e) {
    const { target, key } = e;

    const listBtnWrapper = e.target.closest(".list-btn-wrapper");
    const listElementIdx = this.getListElementIdx(listBtnWrapper);
    const listInput = listBtnWrapper.querySelector("input");

    if (key === "Enter") {
      if (target.value === "") return;
      if (target.closest(".editable-list-input")) {
        this.confirmListEdit(listElementIdx, listBtnWrapper, listInput);
      }
    }

    if (key === "Escape") {
      if (target.closest(".editable-list-input")) {
        this.cancelListEdit(listElementIdx, listBtnWrapper);
      }
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
    const currentListEdit = document.querySelector(
      ".list-btn-wrapper:has(.expand-row)"
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

    if (currentListEdit) {
      if (!e.composedPath().includes(currentListEdit)) {
        currentListEdit
          .querySelector(".hoverable-list-content-wrapper")
          .classList.remove("expand-row");
      }
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

  addTaskElement(e) {
    const target = e.target;
    //clicking on the add task button counts as clicking outside the task
    //when user clicks outside of task, the task closes
    //condition makes sure the task stays open
    if (!target.className.includes("add-task-btn")) return;

    //replace the empty task collection class with the populated class
    if (this.data.getTaskCollectionState() === "empty") {
      this.renderer.renderGenericTaskCollection(this.currentTasks, "populated");
    }

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
    //timeout allows the new list to be properly removed (if there is one) and for the addList button to toggle
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
      this.handleSidebarClicks.bind(this)
    );
    this.elements.sidebar.addEventListener(
      "keydown",
      this.handleSidebarInput.bind(this)
    );
    this.elements.mylistWrapper.addEventListener(
      "keydown",
      this.handleNewList.bind(this)
    );
    document.addEventListener("click", this.handleDocumentClicks.bind(this));
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

    if (target.closest(".add-task-btn")) {
      this.addTaskElement(e);
    } else if (e.target.className.includes("expand-collapse")) {
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
          this.deleteTaskElement(taskWrapper, taskIdx, target),
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
    // if my clicked list already has focus, do nothing, just return
    if (listButton.classList.contains("focused-list")) return;

    const btns = this.getAllListElementBtns();

    btns.forEach((btn) => btn.classList.remove("focused-list"));
    listButton.classList.add("focused-list");
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
    const { target, key } = e;

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
