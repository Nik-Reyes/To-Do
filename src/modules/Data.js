import List from "./List.js";
import Task from "./Task.js";
import CreateLists from "./Storage.js";

export default class Data {
  #listCollection = undefined;
  #currentList = null;
  #currentListTitle = null;

  ////////////// GETTER METHODS ///////////////
  get currentList() {
    return this.#currentList;
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
      ...Object.values(this.#listCollection.systemLists),
      ...Object.values(this.#listCollection.myLists),
    ];
  }

  get startingList() {
    return this.#listCollection.myLists[
      Object.keys(this.#listCollection.myLists)[0]
    ];
  }

  get currentTasks() {
    return this.#currentList.tasks;
  }

  // ////////////// SETTER METHODS ///////////////
  set currentList(currentList) {
    this.#currentList = currentList;
  }

  set listCollection(collection) {
    this.#listCollection = collection;
  }

  set currentListTitle(currentList) {
    this.#currentListTitle = this.currentList.title;
  }

  //////////////// ACTION METHODS ///////////////

  //takes in the title of the new list
  switchLists(listToSwitchTo) {
    this.currentList = this.lists.at(listToSwitchTo);
  }

  // //rename to pushListObj
  addList(newListObj) {
    if (this.listCollection.myLists[newListObj.title]) {
      this.listCollection.myLists[`newListObj.title`] = newListObj;
    } else {
      console.log("unique");
    }
    this.listCollection.myLists[newListObj.title] = newListObj;
  }

  // createNewTask() {
  //   return new Task();
  // }

  // addTask(newTask) {
  //   this.currentList.addTask(newTask);
  // }

  // deleteTask(idx) {
  //   this.currentList.deleteTask(idx);
  // }

  // updateTaskObject(taskIdx, property, value) {
  //   if (taskIdx !== -1 && this.currentTasks[taskIdx]) {
  //     this.currentTasks[taskIdx][property] = value;
  //   }
  // }

  createNewList(title) {
    return new List(title);
  }

  // //responsible for pushing dynamically created tasks to their proper system lists
  // portData(destinationList, taskIdx) {
  //   destinationService = {
  //     Today: this.listCollection.systemLists.completed,
  //     Scheduled: this.listCollection.systemLists.Scheduled,
  //     "All Tasks": this.listCollection.systemLists[destinationList],
  //     Completed: this.listCollection.systemLists.Completed,
  //   };
  // }

  init() {
    this.listCollection = CreateLists();
    this.currentList = this.startingList;
    this.currentListTitle = this.#currentList;
  }
}
