import List from "./List.js";
import ToDo from "./ToDo.js";
import CreateDefaultLists from "./DefaultLists.js";

export default class Manager {
  constructor() {
    this.listCollection = CreateDefaultLists();
    this.currentListId = 0; // tracks the current list
  }

  ////////////// GETTER METHODS ///////////////
  get aggregateLists() {
    return [...this.listCollection.systemLists, ...this.listCollection.myLists];
  }

  get lists() {
    return this.aggregateLists.map((list, i) => ({
      id: i,
      title: list.title,
      creationDate: list.creationDate,
    }));
  }

  get listTasks() {
    return this.currentList
      ? this.currentList.todos.map((todo) => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
        }))
      : [];
  }

  get tasks() {
    return this.currentList.todos;
  }

  get formattedTasks() {
    return (
      this.listTasks.map((task) => task.title).join("\n") || "list is empty"
    );
  }

  get numberOfLists() {
    return this.aggregateLists.length;
  }

  get currentList() {
    return this.aggregateLists[this.currentListId];
  }

  get currentListTitle() {
    return this.aggregateLists[this.currentListId]?.title || "Unknown List";
  }

  ////////////// SETTER METHODS ///////////////
  set currentList(listId) {
    this.currentListId = listId;
  }

  ////////////// ACTION METHODS ///////////////
  addList(title) {
    this.listCollection.myLists.push(new List(title));
    return this.numberOfLists;
  }

  addTask(title) {
    if (this.currentList) {
      this.currentList.addToDo(new ToDo(title));
    }
  }

  markCompleted(taskId) {
    if (this.currentList) {
      this.currentList.completeToDo(taskId);
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
