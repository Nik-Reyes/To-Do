import List from "./List.js";
import Task from "./Task.js";
import Storage from "./Storage.js";
import { format, isAfter, isBefore, isEqual, parseISO } from "date-fns";

export default class Data {
  #listCollection;
  #currentList;
  #destinationService;
  #allTasksListOrder;

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
    for (let list of this.#listCollection.systemLists) {
      if (list.title === "All Tasks") {
        return list;
      }
    }
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

  //number of myLists is the same number of sections in All Tasks list
  get numberOfMyLists() {
    return this.#listCollection.myLists.length;
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

  get currentTasks() {
    return this.#currentList.tasks;
  }

  get numberOfCurrentTasks() {
    return this.#currentList.tasks.length;
  }

  get allTasksListOrder() {
    return this.#allTasksListOrder;
  }

  get myLists() {
    return this.#listCollection.myLists;
  }

  ////////////// SETTER METHODS ///////////////
  set currentList(idx) {
    this.#currentList = this.lists.at(idx);
  }

  set listCollection(collection) {
    this.#listCollection = collection;
  }

  ////////////// CREATE METHODS ///////////////
  createNewTask() {
    return new Task();
  }

  createNewList(title) {
    return new List(title);
  }

  ////////////// READ METHODS ///////////////
  getFlattenedSortedMyLists() {
    return this.getSortedLists().flatMap((list) => list.tasks);
  }

  getListIdxFromAllTasks(list) {
    const allTaskLists = this.#allTasksListOrder;

    for (let i = 0; i < allTaskLists.length; i++) {
      if (list.title === allTaskLists[i].listTitle) {
        return i;
      }
    }
    return -1;
  }

  getTaskCollectionState() {
    return this.#currentList.tasks.length > 0 ? "populated" : "empty";
  }

  getTask(elementIdx) {
    return this.currentTasks.at(elementIdx);
  }

  getGroupedTasks() {
    const sectionedTasks = [];
    this.getSortedLists().forEach((list) => {
      sectionedTasks.push({
        listTitle: list.title,
        tasks: [...list.tasks],
      });
    });
    return sectionedTasks;
  }

  getListFromtask(idx) {
    const task = this.getTask(idx);
    //get the task
    //loop through each list and check if that list has the task
    //if the list has the task, return the task title
    for (let list of this.listCollection.myLists) {
      const idx = list.tasks.indexOf(task);
      if (idx !== -1) {
        return list;
      }
    }
    return null;
  }

  getAllTasksListID() {
    for (let list of this.#listCollection.systemLists) {
      if (list.title === "All Tasks") {
        return list.id;
      }
    }
  }

  getSortedLists() {
    const copiedLists = this.listCollection.myLists.slice();
    return copiedLists.sort(function (a, b) {
      return a.tasks.length - b.tasks.length;
    });
  }

  ////////////// UPDATE METHODS ///////////////
  updateTaskObjectWithIndex(taskIdx, taskProperty, value) {
    if (taskIdx !== -1 && this.currentTasks[taskIdx]) {
      this.currentTasks[taskIdx][taskProperty] = value;
    }
  }

  updateListObject(listIdx, listProperty, value) {
    if (listIdx !== -1 && this.lists.at(listIdx)) {
      this.lists.at(listIdx)[listProperty] = value;
    }
  }

  updateAllTasksOrder() {
    this.allTasksList.tasks = this.getFlattenedSortedMyLists();
  }

  updateAllTasksListOrder() {
    this.#allTasksListOrder = this.getGroupedTasks();
  }

  updateCurrentList(idx) {
    this.currentList = idx;
  }

  ////////////// DELETION METHODS ///////////////
  deleteList(id) {
    console.log(id);
    const myLists = this.myLists;
    for (let i = 0; i < myLists.length; i++) {
      console.log("here");
      if (myLists[i].id === id) {
        myLists.splice(i, 1);
        console.log(this.myLists);

        return;
      }
    }
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
  //delete task from completed list and toggle its checked state
  deleteCheckedTask(taskToDelete) {
    const idx = this.completedList.tasks.indexOf(taskToDelete);
    if (idx !== -1) {
      this.completedList.deleteTask(idx);
      taskToDelete.toggleCheck();
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

  ////////////// ADDING METHODS ///////////////
  //Accepts a task object or existing element index
  //data can only ever be ported to a system list. All other lists are added to the current list the user is on
  portTask(destination, task) {
    !isNaN(task)
      ? this.destinationService[destination].tasks.push(this.getTask(task))
      : this.destinationService[destination].tasks.push(task);
  }

  addTask(newTask) {
    this.currentList.addTask(newTask);
  }

  addList(newListObj) {
    this.listCollection.myLists.push(newListObj);
  }

  ////////////// BOOLEAN EVALUATION METHODS ///////////////
  listHasTasks(list) {
    return list.tasks.length > 0;
  }

  isDateInPast(date) {
    const todaysDate = format(new Date(), "yyyy-MM-dd");
    return isBefore(date, todaysDate);
  }

  sectionHasTasks() {
    return this.getSortedLists().map((list) => {
      return list.tasks.length > 0;
    });
  }

  ////////////// HANDLER METHODS ///////////////
  handleNewDate(taskElementIdx, newDate) {
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

    let scheduledHasTask = this.scheduledList.tasks.includes(dateTask);
    let todayHasTask = this.todayList.tasks.includes(dateTask);

    if (isBefore(selectedDate, todaysDate)) {
      console.log("task is in the past");
      return;
    }

    if (scheduledHasTask || todayHasTask) {
      const prevDate = dateTask.dueDate;
      // prevDate === "" means the task was created in Scheduled
      if (isBefore(selectedDate, prevDate) || prevDate === "") {
        if (isEqual(selectedDate, todaysDate)) {
          this.portTask("Today", dateTask);
        }
        this.currentTasks[taskElementIdx].dueDate = selectedDate;
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
      this.currentTasks[taskElementIdx].dueDate = selectedDate;
    }
  }

  handleCheckedTask(taskElementIdx) {
    const checkedTask = this.getTask(taskElementIdx);
    if (checkedTask.checked) {
      this.deleteCheckedTask(checkedTask);
    } else {
      this.portTask("Completed", taskElementIdx);
      this.currentTasks[taskElementIdx].toggleCheck();
    }
  }

  //////////////// INIT METHOD ///////////////
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
    this.#destinationService["All Tasks"].tasks =
      this.getFlattenedSortedMyLists();
    this.#allTasksListOrder = this.getGroupedTasks();
  }
}
