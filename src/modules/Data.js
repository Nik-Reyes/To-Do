import List from "./List.js";
import Task from "./Task.js";
import CreateDefaultLists from "./Storage.js";

export default class Data {
  #listCollection = [];
  #currentList = null;
  #currentListTitle = null;

  ////////////// GETTER METHODS ///////////////
  get currentList() {
    return this.#currentList;
  }

  get currentListId() {
    return this.#currentList.id;
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
  addListData(newListObj) {
    this.listCollection.myLists.push(newListObj);
  }

  updateTaskObject(taskIndex, property, value) {
    if (taskIndex !== -1 && this.currentTasks[taskIndex]) {
      this.currentTasks[taskIndex][property] = value;
    }
  }

  init() {
    this.listCollection = CreateDefaultLists();
    this.currentList = this.startingListIDX;
    this.currentListTitle = this.currentList.title;
  }
}
