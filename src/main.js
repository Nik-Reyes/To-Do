import Manager from "./modules/Manager.js";
import "@oddbird/popover-polyfill";
import "@oddbird/css-anchor-positioning";
import "./style.css";

const manager = new Manager();
manager.Renderer.render();
console.log("hi");

// function switchList() {
//   const listNames = manager.lists
//     .map((list, i) => `${i + 1}. ${list.title}`)
//     .join("\n");

//   const choice = parseInt(
//     prompt(
//       `Which list would you like to switch to?\n\nEnter the list number:\n${listNames}`
//     )
//   );
//   manager.currentList = choice - 1;
// }

// function addTask() {
//   manager.addTask(prompt("Enter task title"));
// }

// function newList() {
//   manager.addList(prompt("Enter the title of the List"));
// }

// function editTask() {}

// function viewListTasks() {
//   alert(manager.formattedTasks);
// }

// function deleteTask() {
//   const taskToDelete = parseInt(
//     prompt(
//       `Enter the index of the task to be deleted (starting from 1)\n${manager.formattedTasks} `
//     )
//   );
//   manager.deleteTask(taskToDelete);
// }

// let choice = null;
// while (true) {
//   choice = parseInt(
//     prompt(
//       `what would you like to do?\n1. Select another list\n2. Add task to current list (${manager.currentListTitle})\n3. Create a new List\n4. Edit a task of the current list (${manager.currentListTitle})\n5. View all tasks of current List\n6. Delete a task`
//     )
//   );

//   switch (choice) {
//     case 1:
//       switchList();
//       break;
//     case 2:
//       addTask();
//       break;
//     case 3:
//       newList();
//       break;
//     case 4:
//       editTask();
//       break;
//     case 5:
//       viewListTasks();
//       break;
//     case 6:
//       deleteTask();
//       break;
//   }
// }
