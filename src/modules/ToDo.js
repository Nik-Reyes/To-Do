export default class ToDo {
  // the only required item property is the title
  #title;
  #dueDate;
  #priority;
  #notes;
  #completed;
  #id = Date.now() + Math.floor(Math.random() * 1000);

  constructor(title, notes, dueDate, priority, completed) {
    this.#title = title;
    this.#dueDate = dueDate || "";
    this.#priority = priority || "";
    this.#notes = notes || "";
    this.#completed = completed || false;
  }

  get title() {
    return this.#title;
  }

  set title(newTitle) {
    this.#title = newTitle;
  }

  get dueDate() {
    return this.#dueDate;
  }

  set dueDate(newDate) {
    this.#dueDate = newDate;
  }

  get priority() {
    return this.#priority;
  }

  set priority(newPriority) {
    this.#priority = newPriority;
  }

  get notes() {
    return this.#notes;
  }

  set notes(newNote) {
    this.#notes = newNote;
  }

  get completed() {
    return this.#completed;
  }

  set completed(updateComplete) {
    this.#completed = updateComplete;
  }

  get id() {
    return this.#id;
  }

  markCompleted() {
    this.completed = true;
  }
}
