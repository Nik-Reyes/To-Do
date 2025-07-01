export default class List {
  #title;
  #color;
  #tasks = [];

  constructor(title, color) {
    this.#title = title;
    this.#color = color || "rgb(228, 27, 51)";
  }

  ////////////// GETTER METHODS ///////////////
  get title() {
    return this.#title;
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
      task.markCompleted();
    }
  }
}
