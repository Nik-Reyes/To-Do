export default class List {
  static count = 0;
  #title;
  #tasks = [];
  #id;

  constructor(title) {
    this.#title = title;
    this.#id = List.count++;
  }

  ////////////// GETTER METHODS ///////////////
  get title() {
    return this.#title;
  }

  get id() {
    return this.#id;
  }

  get tasks() {
    return this.#tasks;
  }

  get numberOfTasks() {
    return this.#tasks.length;
  }

  get hasTasks() {
    return this.#tasks.length >= 1 ? true : false;
  }

  ////////////// SETTER METHODS ///////////////
  set tasks(trimmedTasks) {
    this.#tasks = trimmedTasks;
  }

  set title(newTitle) {
    this.#title = newTitle;
  }

  ////////////// ACTION METHODS ///////////////
  deleteTask(taskId) {
    this.tasks.splice(
      this.tasks.findIndex((item) => parseInt(item.id) === taskId),
      1
    );
  }

  addTask(newTask) {
    this.tasks.push(newTask);
  }

  completeTask(taskId) {
    const task = this.#tasks.find((task) => task.id === taskId);
    if (task) {
      task.markchecked();
    }
  }
}
