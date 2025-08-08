export default class Task {
	constructor(title, notes, dueDate, priority, checked, id) {
		this._title = title || 'New Task';
		this._dueDate = dueDate || '';
		this._priority = priority || 'no-priority';
		this._notes = notes || 'Notes';
		this._checked = checked || false;
		this._id = id || `${performance.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
	}

	get title() {
		return this._title;
	}

	set title(newTitle) {
		this._title = newTitle;
	}

	get dueDate() {
		return this._dueDate;
	}

	set dueDate(newDate) {
		this._dueDate = newDate;
	}

	get priority() {
		return this._priority;
	}

	set priority(newPriority) {
		this._priority = newPriority;
	}

	get notes() {
		return this._notes;
	}

	set notes(newNote) {
		this._notes = newNote;
	}

	get checked() {
		return this._checked;
	}

	set checked(updateComplete) {
		this._checked = updateComplete;
	}

	get id() {
		return this._id;
	}

	toggleCheck() {
		this._checked = !this._checked;
	}
}
