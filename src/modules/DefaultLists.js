import Task from './Task.js';
import List from './List.js';

const groceryItems = [
	new Task('Tomatoes'),
	new Task('Lettuce'),
	new Task('Burger buns'),
	new Task('Ground beef'),
	new Task('Sweet onions'),
	new Task('Mushrooms'),
];

const choreItems = [
	new Task('clean bedroom'),
	new Task('clean bathroom'),
	new Task('do dishes'),
	new Task('vacuum downstairs'),
];

const groceries = new List('Groceries');
groceries.pushTasks(groceryItems);

const chores = new List('Chores');
chores.pushTasks(choreItems);

const allTasks = new List('All Tasks');
allTasks.pushTasks([...groceryItems, ...choreItems]);

export const defaultLists = {
	systemLists: [allTasks, new List('Today'), new List('Scheduled'), new List('Completed')],
	myLists: [groceries, chores],
};
