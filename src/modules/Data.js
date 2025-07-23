import List from "./List.js";
import Task from "./Task.js";
import Storage from "./Storage.js";
import { format, isAfter, isBefore, isEqual, parseISO } from "date-fns";

export default class Data {
  #listCollection = [];
  #currentList = null;
  #destinationService = {};

  ////////////// GETTER METHODS ///////////////
  get currentList() {
    return this.#currentList;
  }

  get todaysDate() {
    return format(new Date(), "yyy-MM-dd");
  }

  get todayList() {
    return this.destinationService.Today;
  }

  get scheduledList() {
    return this.destinationService.Scheduled;
  }

  get allTasksList() {
    return this.destinationService["All Tasks"];
  }

  get completedList() {
    return this.destinationService.Completed;
  }

  get destinationService() {
    return this.#destinationService;
  }

  get currentListIdx() {
    return this.lists.indexOf(this.currentList);
  }

  get currentListTitle() {
    return this.#currentList.title;
  }

  get listCollection() {
    return this.#listCollection;
  }

  get lists() {
    return [
      ...this.#listCollection.systemLists,
      ...this.#listCollection.myLists,
    ];
  }

  get allMylistsTasks() {
    const tasks = this.listCollection.myLists.flatMap((list) => list.tasks);
    return tasks;
  }

  get startingListIDX() {
    return this.#listCollection.systemLists.length;
  }

  get currentTasks() {
    return this.#currentList.tasks;
  }

  ////////////// SETTER METHODS ///////////////
  set currentList(idx) {
    this.#currentList = this.lists.at(idx);
  }

  set listCollection(collection) {
    this.#listCollection = collection;
  }

  ////////////// ACTION METHODS ///////////////

  getSectionedTasks() {
    const sectionedTasks = [];
    const copiedLists = this.listCollection.myLists.slice();

    copiedLists
      .sort(function (a, b) {
        return a.tasks.length - b.tasks.length;
      })
      .forEach((list) => {
        sectionedTasks.push({
          listTitle: list.title,
          tasks: [...list.tasks],
        });
      });

    return sectionedTasks;
  }

  isDateInPast(date) {
    const todaysDate = format(new Date(), "yyyy-MM-dd");
    return isBefore(date, todaysDate);
  }

  getTask(elementIdx) {
    return this.currentTasks.at(elementIdx);
  }
  switchLists(idx) {
    this.currentList = idx;
  }

  addList(newListObj) {
    this.listCollection.myLists.push(newListObj);
  }

  createNewTask() {
    return new Task();
  }

  addTask(newTask) {
    this.currentList.addTask(newTask);
  }

  //deletes the task from every list
  deleteTask(taskElementIdx) {
    const taskToDelete = this.currentTasks.at(taskElementIdx);
    const lists = this.lists;
    let idx = -1;
    for (let list of lists) {
      idx = list.tasks.indexOf(taskToDelete);
      if (idx !== -1) {
        list.deleteTask(idx);
      }
    }
  }

  updateTaskObjectWithIndex(taskIdx, taskProperty, value) {
    if (taskIdx !== -1 && this.currentTasks[taskIdx]) {
      console.log(taskIdx);

      this.currentTasks[taskIdx][taskProperty] = value;
    }
  }

  createNewList(title) {
    return new List(title);
  }

  //delete task from completed list and make sure its unchecked to uncheck it from all other lists
  deleteCheckedTask(taskToDelete) {
    this.completedList.tasks.forEach((task, i) => {
      if (task === taskToDelete) {
        this.completedList.deleteTask(i);
        taskToDelete.checked = false;
        return;
      }
    });
  }

  handleCheckedTask(taskElementIdx, taskProperty, checkedValue) {
    const checkedTask = this.getTask(taskElementIdx);
    if (checkedTask.checked) {
      this.deleteCheckedTask(checkedTask);
    } else {
      this.portTask("Completed", taskElementIdx);
      this.updateTaskObjectWithIndex(
        taskElementIdx,
        taskProperty,
        checkedValue
      );
    }
  }

  deleteTaskFromScheduled(taskToDelete) {
    const scheduledList = this.scheduledList;
    const scheduledListTasks = scheduledList.tasks;

    let idx = scheduledListTasks.indexOf(taskToDelete);
    if (idx !== -1) {
      scheduledList.deleteTask(idx);
    }
  }

  deleteTaskFromToday(taskToDelete) {
    const todayList = this.todayList;
    const todayListTasks = todayList.tasks;

    let idx = todayListTasks.indexOf(taskToDelete);
    if (idx !== -1) {
      todayList.deleteTask(idx);
    }
  }

  handleNewDate(taskElementIdx, taskProperty, newDate) {
    const dateTask = this.getTask(taskElementIdx);
    //account for user clearing the date
    if (newDate === "") {
      dateTask["dueDate"] = newDate;
      this.deleteTaskFromToday(dateTask);
      this.deleteTaskFromScheduled(dateTask);
      return;
    }
    const dateFormat = "yyyy-MM-dd";
    const todaysDate = format(new Date(), dateFormat);
    const selectedDate = format(parseISO(newDate), dateFormat);

    let scheduledTaskIdx = this.scheduledList.tasks.indexOf(dateTask);
    let todaysTaskIdx = this.todayList.tasks.indexOf(dateTask);

    if (isBefore(selectedDate, todaysDate)) {
      console.log("task is in the past");
      return;
    }

    if (scheduledTaskIdx !== -1 || todaysTaskIdx !== -1) {
      const prevDate = dateTask.dueDate;
      if (isBefore(selectedDate, prevDate)) {
        if (isEqual(selectedDate, todaysDate)) {
          this.portTask("Today", dateTask);
        }
        this.updateTaskObjectWithIndex(
          taskElementIdx,
          taskProperty,
          selectedDate
        );
      } else if (
        isAfter(selectedDate, todaysDate) &&
        isAfter(selectedDate, prevDate)
      ) {
        this.deleteTaskFromToday(dateTask);
        dateTask["dueDate"] = selectedDate;
      }
    } else {
      if (isAfter(selectedDate, todaysDate)) {
        this.portTask("Scheduled", dateTask);
      } else if (isEqual(selectedDate, todaysDate)) {
        this.portTask("Scheduled", dateTask);
        this.portTask("Today", dateTask);
      }
      this.updateTaskObjectWithIndex(
        taskElementIdx,
        taskProperty,
        selectedDate
      );
    }
  }

  //Accepts a task object or existing element index
  //data can only ever be ported to a system list. All other lists are added to the current list the user is on
  portTask(destination, task) {
    !isNaN(task)
      ? this.destinationService[destination].tasks.push(this.getTask(task))
      : this.destinationService[destination].tasks.push(task);
  }

  init() {
    const storage = new Storage(); //storage will send starting list
    this.listCollection = storage.loadLists();
    this.currentList = 0; //was: this.startingListIDX. Might change later to load on last clicked list
    this.#destinationService = {
      "All Tasks": this.listCollection.systemLists[0],
      Today: this.listCollection.systemLists[1],
      Scheduled: this.listCollection.systemLists[2],
      Completed: this.listCollection.systemLists[3],
    };
  }
}
