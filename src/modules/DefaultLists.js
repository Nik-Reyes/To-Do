import List from "./List.js";
import { defaultItems } from "./DefaultTasks.js";

export default function CreateDefaultLists() {
  const lists = {};
  const myListStage = [];
  const systemListStage = [];
  const myLists = ["Groceries"];
  const systemLists = ["Today", "Scheduled", "All Tasks", "Completed"];

  const createLists = () => {
    systemLists.forEach((title) => {
      systemListStage.push(new List(title));
    });

    myLists.forEach((title) => {
      myListStage.push(new List(title));
    });
  };

  const addMyListItems = () => {
    defaultItems.forEach((item) => {
      myListStage[0].addTask(item);
    });
  };

  const stageLists = () => {
    createLists();
    addMyListItems();
  };

  const pushLists = () => {
    stageLists();
    lists.systemLists = systemListStage;
    lists.myLists = myListStage;
    return lists;
  };

  return pushLists();
}
