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

  //was firstMyList()
  get startingListIDX() {
    return this.#listCollection.systemLists.length;
  }

  //was currentListTasks
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

  deleteTask(idx) {
    this.currentList.deleteTask(idx);
  }

  updateTaskObject(taskIdx, property, value) {
    if (taskIdx !== -1 && this.currentTasks[taskIdx]) {
      this.currentTasks[taskIdx][property] = value;
    }
  }

  createNewList(title) {
    return new List(title);
  }

  //data can only ever be ported to a system list. All other lists are added to the current list the user is on
  portTask(destination, task) {
    this.destinationService[destination].tasks.push(task);
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
