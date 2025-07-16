import List from "./List.js";
import { defaultItems } from "./DefaultTasks.js";

export default function CreateLists() {
  const lists = {};
  const myLists = {};
  const systemLists = {};

  const createSystemLists = (storedSystemLists) => {
    storedSystemLists.map((list) => {
      systemLists[list] = new List(list);
    });
  };

  const createMyLists = (storedMyLists) => {
    storedMyLists.forEach((list) => {
      myLists[list] = new List(list);
    });
  };

  const createLists = () => {
    const storedSystemLists = [
      "Today-0",
      "Scheduled-0",
      "All Tasks-0",
      "Completed-0",
    ];
    const storedMyLists = ["Groceries-0", "Scheduled-0"];

    createSystemLists(storedSystemLists);
    createMyLists(storedMyLists);

    lists.systemLists = systemLists;
    lists.myLists = myLists;

    console.log(lists.myLists);
  };

  //every task will be part of All Tasks
  //some tasks might be part of Completed
  //Some tasks might be part of Scheduled
  //Some tasks might be part of Today
  const assignTasks = () => {
    for (let [key, value] of Object.entries(lists.myLists)) {
      value.tasks = defaultItems;
    }
    lists.systemLists["All Tasks-0"].tasks = defaultItems;
  };

  const init = (() => {
    createLists();
    assignTasks();
  })();

  return lists;
}
