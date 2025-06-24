export default class List {
  #title;
  #creationDate;
  #todos = [];

  constructor(title, creationDate) {
    this.#title = title;
    this.#creationDate = creationDate || "";
  }

  get title() {
    return this.#title;
  }

  set title(newTitle) {
    this.#title = newTitle;
  }

  get creationDate() {
    return this.#creationDate;
  }

  get todos() {
    return this.#todos;
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
