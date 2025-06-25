export default class List {
  #title;
  #creationDate;
  #todos = [];

  constructor(title, creationDate) {
    this.#title = title;
    this.#creationDate = creationDate || "";
  }

  ////////////// GETTER METHODS ///////////////
  get title() {
    return this.#title;
  }

  get creationDate() {
    return this.#creationDate;
  }

  get todos() {
    return this.#todos;
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
