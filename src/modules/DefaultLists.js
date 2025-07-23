import Task from "./Task.js";
import List from "./List.js";

const initialItems = [
  new Task("Tomatoes"),
  new Task("Lettuce"),
  new Task("Burger buns"),
  new Task("Ground beef"),
  new Task("Sweet onions"),
  new Task("Mushrooms"),
];

const groceries = new List("Groceries");
groceries.tasks.push(...initialItems);

const allTasks = new List("All Tasks");
allTasks.tasks.push(...initialItems);

export const defaultLists = {
  systemLists: [
    allTasks,
    new List("Today"),
    new List("Scheduled"),
    new List("Completed"),
  ],
  myLists: [groceries],
};
