export default class Task {
  // the only required item property is the title
  #title;
  #dueDate;
  #priority;
  #notes;
  #checked;
  #id = `${performance.now().toString(36)}-${Math.random()
    .toString(36)
    .substring(2)}`;
  constructor(title, notes, dueDate, priority, checked) {
    this.#title = title;
    this.#dueDate = dueDate || "";
    this.#priority = priority || "no-priority";
    this.#notes = notes || "";
    this.#checked = checked || false;
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

  get checked() {
    return this.#checked;
  }

  set checked(updateComplete) {
    this.#checked = updateComplete;
  }

  get id() {
    return this.#id;
  }

  markchecked() {
    this.checked = true;
  }
}
