import List from "./List.js";
import Task from "./Task.js";

export default class Manager {
  #listCollection;
  #currentListId;
  constructor() {
    this.#listCollection = [];
    this.#currentListId = undefined; // tracks the current list
  }

  ////////////// GETTER METHODS ///////////////
  get lists() {
    return [
      ...this.#listCollection.systemLists,
      ...this.#listCollection.myLists,
    ];
  }

  get listTasks() {
    return this.currentList
      ? this.currentList.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
        }))
      : [];
  }

  get tasks() {
    return this.currentList.tasks;
  }

  get numberOfLists() {
    return this.lists.length;
  }

  get currentList() {
    return this.lists[this.#currentListId];
  }

  get firstMyList() {
    return this.#listCollection.systemLists.length;
  }

  get listCollection() {
    return this.#listCollection;
  }

  ////////////// SETTER METHODS ///////////////
  set currentList(listId) {
    this.#currentListId = listId;
  }

  set listCollection(newList) {
    this.#listCollection = newList;
  }

  ////////////// ACTION METHODS ///////////////
  addList(title) {
    this.#listCollection.myLists.push(new List(title));
    return this.numberOfLists;
  }

  addTask(title) {
    if (this.currentList) {
      this.currentList.addTask(new Task(title));
    }
  }

  markCompleted(taskId) {
    if (this.currentList) {
      this.currentList.completeTask(taskId);
    }
  }

  idxToId(selectedIdx) {
    return this.tasks.at(selectedIdx - 1).id;
  }

  deleteTask(taskToDelete) {
    const taskId = this.idxToId(taskToDelete);
    this.currentList.deleteTask(taskId);
  }
}
