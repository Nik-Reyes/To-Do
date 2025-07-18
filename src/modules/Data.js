import List from "./List.js";
import Task from "./Task.js";
import CreateDefaultLists from "./Storage.js";

export default class Data {
  #listCollection = [];
  #currentList = null;
  #currentListTitle = null;
  #destinationService = {};

  ////////////// GETTER METHODS ///////////////
  get currentList() {
    return this.#currentList;
  }

  get todayList() {
    return this.destinationService.Today;
  }

  get scheduledList() {
    return this.destinationService.Scheduled;
  }

  get allTasksList() {
    return this.destinationService["All Tasks"];
  }

  get completedList() {
    return this.destinationService.Completed;
  }

  get destinationService() {
    return this.#destinationService;
  }

  get currentListId() {
    return this.#currentList.id;
  }

  get currentListIdx() {
    return this.lists.indexOf(this.currentList);
  }

  get currentListTitle() {
    return this.#currentList.title;
  }

  get listCollection() {
    return this.#listCollection;
  }

  get lists() {
    return [
      ...this.#listCollection.systemLists,
      ...this.#listCollection.myLists,
    ];
  }

  get startingListIDX() {
    return this.#listCollection.systemLists.length;
  }

  get currentTasks() {
    return this.#currentList.tasks;
  }

  ////////////// SETTER METHODS ///////////////
  set currentList(idx) {
    this.#currentList = this.lists.at(idx);
  }

  set listCollection(collection) {
    this.#listCollection = collection;
  }

  set currentListTitle(title) {
    this.#currentListTitle = title;
  }

  ////////////// ACTION METHODS ///////////////
  getTask(elementIdx) {
    return this.currentTasks.at(elementIdx);
  }
  switchLists(idx) {
    this.currentList = idx;
  }

  //rename to pushListObj
  addList(newListObj) {
    this.listCollection.myLists.push(newListObj);
  }

  createNewTask() {
    return new Task();
  }

  addTask(newTask) {
    this.currentList.addTask(newTask);
  }

  //deletes the task from every list
  deleteTask(taskElementIdx) {
    const taskToDelete = this.currentTasks.at(taskElementIdx);
    const lists = this.lists;
    let idx = -1;
    for (let list of lists) {
      idx = list.tasks.indexOf(taskToDelete);
      if (idx !== -1) {
        list.deleteTask(idx);
      }
    }
  }

  updateTaskObject(taskIdx, taskProperty, value) {
    if (taskIdx !== -1 && this.currentTasks[taskIdx]) {
      this.currentTasks[taskIdx][taskProperty] = value;
    }
  }

  createNewList(title) {
    return new List(title);
  }

  listContainsTask(taskElementIdx) {
    const taskToCheck = this.getTask(taskElementIdx);
  }

  //delete task from completed list and make sure its unchecked to uncheck it from all other lists
  deleteCheckedTask(taskToDelete) {
    this.completedList.tasks.forEach((task, i) => {
      if (task === taskToDelete) {
        this.completedList.deleteTask(i);
        taskToDelete.checked = false;
        return;
      }
    });
  }

  handleCheckedTask(taskElementIdx, taskProperty, checkedValue) {
    const checkedTask = this.getTask(taskElementIdx);
    if (checkedTask.checked) {
      this.deleteCheckedTask(checkedTask);
    } else {
      this.portTask("Completed", taskElementIdx);
      this.updateTaskObject(taskElementIdx, taskProperty, checkedValue);
    }
  }

  //Accepts a task object or existing element index
  //data can only ever be ported to a system list. All other lists are added to the current list the user is on
  portTask(destination, task) {
    !isNaN(task)
      ? this.destinationService[destination].tasks.push(this.getTask(task))
      : this.destinationService[destination].tasks.push(task);
  }

  init() {
    this.listCollection = CreateDefaultLists();
    this.currentList = this.startingListIDX;
    this.currentListTitle = this.currentList.title;
    this.#destinationService = {
      Today: this.listCollection.systemLists[0],
      Scheduled: this.listCollection.systemLists[1],
      "All Tasks": this.listCollection.systemLists[2],
      Completed: this.listCollection.systemLists[3],
    };
  }
}
