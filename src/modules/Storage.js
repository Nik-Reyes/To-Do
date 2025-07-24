import { defaultLists } from "./DefaultLists.js";

export default class Storage {
  constructor() {
    this.listDataKey = "listData";
  }
  storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const storageTest = "__storage_test__";
      storage.setItem(storageTest, storageTest);
      storage.removeItem(storageTest);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

  loadLists() {
    if (this.storageAvailable("localStorage")) {
      if (localStorage.length === 0) {
        //return default lists and push default lists to localStorage
        // this.pushToLocalStorage(defaultLists);
        // console.log(JSON.parse(localStorage.getItem(this.listDataKey)));
        return defaultLists;
      } else {
        // this.removeFromLocalStorage();
        // load from local storage
      }
    }
  }

  //where data is an object of arrays of objects
  pushToLocalStorage(data) {
    localStorage.setItem(this.listDataKey, JSON.stringify(data));
  }

  removeFromLocalStorage() {
    localStorage.removeItem(this.listDataKey);
  }
}
