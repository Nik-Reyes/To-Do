import List from "./List.js";
import ToDo from "./ToDo.js";
import CreateDefaultLists from "./DefaultLists.js";

export default class Manager {
  constructor() {
    this.listCollection = CreateDefaultLists();
    this.currentListId = 0;
  }

  get aggregateLists() {
    return [...this.listCollection.systemLists, ...this.listCollection.myLists];
  }

  get allLists() {
    return this.aggregateLists.map((list, i) => ({
      id: i,
      title: list.title,
      creationDate: list.creationDate,
    }));
  }

  get numberOfLists() {
    return this.aggregateLists.length;
  }

  get currentList() {
    return this.aggregateLists[this.currentListId];
  }

  set currentList(listId) {
    this.currentListId = listId;
  }

  get currentListTitle() {
    return this.aggregateLists[this.currentListId]?.title || "Unknown List";
  }

  addList(title) {
    this.listCollection.myLists.push(new List(title));
    return this.numberOfLists;
  }

  addTask(title) {
    if (this.currentList) {
      this.currentList.addToDo(new ToDo(title));
    }
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

  get formattedTasks() {
    return (
      this.listTasks.map((task) => task.title).join("\n") || "list is empty"
    );
  }

  markCompleted(taskId) {
    if (this.currentList) {
      this.currentList.completeToDo(taskId);
    }
  }
}
