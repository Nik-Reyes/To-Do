import CreateDefaultLists from "./modules/DefaultLists.js";
import ToDo from "./modules/ToDo.js";
import List from "./modules/List.js";

const listCollection = CreateDefaultLists();
console.log(listCollection);

//When the page loads, the defualt list displayed is the first list from myLists (the default list)
let currentList = listCollection.myLists[0];

function switchList() {
  const completeLists = [
    ...listCollection.systemLists,
    ...listCollection.myLists,
  ];
  const listNames = completeLists
    .map((list, i) => `${i + 1}. ${list.title}`)
    .join("\n");
  const options = completeLists;
  const choice = parseInt(
    prompt(
      `Which list would you like to switch to?\n\nEnter the list number:\n${listNames}`
    )
  );
  currentList = options[choice - 1];
}

function addTask() {
  currentList.addToDo(new ToDo(prompt("Enter task title")));
}

function newList() {
  listCollection.myLists.push(new List(prompt("Enter the title of the List")));
  console.log(listCollection);
}

function editTask() {}

function viewListTasks() {
  const formattedTasks = currentList.todos
    .map((task) => {
      return task.title;
    })
    .join("\n");
  alert(formattedTasks || "list is empty");
}

let choice = null;
while (true) {
  choice = parseInt(
    prompt(
      `what would you like to do?\n1. Select another list\n2. Add task to current list (${currentList.title})\n3. Create a new List\n4. Edit a task of the current list (${currentList.title})\n5. View all tasks of current List`
    )
  );

  switch (choice) {
    case 1:
      switchList();
      break;
    case 2:
      addTask();
      break;
    case 3:
      newList();
      break;
    case 4:
      editTask();
      break;
    case 5:
      viewListTasks();
      break;
  }
}
