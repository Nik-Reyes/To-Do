export default class List {
  #title;
  #color;
  #todos = [];

  constructor(title, color) {
    this.#title = title;
    this.#color = color || "rgb(228, 27, 51)";
  }

  ////////////// GETTER METHODS ///////////////
  get title() {
    return this.#title;
  }

  get todos() {
    return this.#todos;
  }

  get numberOfTodos() {
    return this.#todos.length;
  }

  get hasTasks() {
    return this.#todos.length >= 1 ? true : false;
  }

  ////////////// SETTER METHODS ///////////////
  set todos(trimmedTasks) {
    this.#todos = trimmedTasks;
  }

  set title(newTitle) {
    this.#title = newTitle;
  }

  ////////////// ACTION METHODS ///////////////
  deleteTask(taskId) {
    this.todos.splice(
      this.todos.findIndex((item) => parseInt(item.id) === taskId),
      1
    );
  }

  addToDo(newToDo) {
    this.todos.push(newToDo);
  }

  completeToDo(todoId) {
    const todo = this.#todos.find((todo) => todo.id === todoId);
    if (todo) {
      todo.markCompleted();
    }
  }
}
