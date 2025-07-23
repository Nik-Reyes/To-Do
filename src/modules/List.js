export default class List {
  constructor(title) {
    this.title = title;
    this.tasks = [];
    this.id = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(2)}`;
  }

  ////////////// GETTER METHODS ///////////////
  get numberOfTasks() {
    return this.tasks.length;
  }

  get hasTasks() {
    return this.tasks.length >= 1 ? true : false;
  }

  ////////////// ACTION METHODS ///////////////
  deleteTask(idx) {
    this.tasks.splice(idx, 1);
  }

  addTask(newTask) {
    this.tasks.push(newTask);
  }

  completeTask(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.markchecked();
    }
  }
}
