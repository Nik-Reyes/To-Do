export default class List {
  constructor(title, tasks, id) {
    this._title = title;
    this._tasks = tasks || [];
    this._id =
      id ||
      `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
  }

  ////////////// GETTER METHODS ///////////////
  get numberOfTasks() {
    return this._tasks.length;
  }

  get hasTasks() {
    return this._tasks.length >= 1 ? true : false;
  }

  get tasks() {
    return this._tasks;
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._id;
  }

  set tasks(tasks) {
    this._tasks = tasks;
  }

  set title(title) {
    this._title = title;
  }

  ////////////// ACTION METHODS ///////////////
  deleteTask(idx) {
    this._tasks.splice(idx, 1);
  }

  addTask(newTask) {
    this._tasks.push(newTask);
  }

  pushTasks(tasks) {
    this._tasks.push(...tasks);
  }

  completeTask(taskId) {
    const task = this._tasks.find((task) => task.id === taskId);
    if (task) {
      task.markchecked();
    }
  }
}
