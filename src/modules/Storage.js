import { defaultLists } from './DefaultLists.js';
import List from './List.js';
import Task from './Task.js';

export default class Storage {
	constructor() {
		this._listDataKey = 'listData';
	}

	storageAvailable(type) {
		let storage;
		try {
			storage = window[type];
			const storageTest = '__storage_test__';
			storage.setItem(storageTest, storageTest);
			storage.removeItem(storageTest);
			return true;
		} catch (e) {
			return (
				e instanceof DOMException &&
				e.name === 'QuotaExceededError' &&
				// acknowledge QuotaExceededError only if there's something already stored
				storage &&
				storage.length !== 0
			);
		}
	}

	loadLists() {
		if (this.storageAvailable('localStorage')) {
			if (localStorage.length === 0) {
				// return default lists and push default lists to localStorage
				this.pushToLocalStorage(defaultLists);
				return defaultLists;
			} else {
				// load from local storage
				// localStorage.removeItem(this._listDataKey);
				const parsedData = this.loadFromLocalStorage();
				return this.reClassifyData(parsedData);
			}
		}
	}

	//where data is an object of arrays of objects
	pushToLocalStorage(data) {
		localStorage.setItem(this._listDataKey, JSON.stringify(data));
	}

	loadFromLocalStorage() {
		return JSON.parse(localStorage.getItem(this._listDataKey));
	}

	removeFromLocalStorage() {
		localStorage.removeItem(this._listDataKey);
	}

	reClassifyData(data) {
		return Object.fromEntries(
			Object.entries(data).map(([listType, lists]) => {
				return [listType, lists.map(list => this.reclassifyList(list))];
			}),
		);
	}

	reclassifyList(list) {
		return new List(
			list._title,
			list._tasks.map(task => this.reclassifyTask(task)),
			list._id,
		);
	}

	reclassifyTask(task) {
		return new Task(task._title, task._notes, task._dueDate, task._priority, task._checked, task._id);
	}
}
