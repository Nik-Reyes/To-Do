import generateElement from "../../utils/GenerateElement.js";
import createListTitle from "../ListTitle/CreateListTitle.js";
import "./sidebar.css";

export default function createSidebar() {
  //////// ELEMENT CREATION ////////
  const sidebar = generateElement("aside", {
    id: "sidebar",
    class: "side-panel",
  });

  const systemListWrapper = generateElement("div", {
    class: "system-list-wrapper",
  });

  const myListWrapper = generateElement("div", {
    class: "mylist-wrapper",
  });

  const innerSystemListsWrapper = generateElement("div", {
    class: "inner-system-list-wrapper",
  });

  const innerMyListsWrapper = generateElement("div", {
    class: "inner-mylist-wrapper",
  });

  const systemListTitle = createListTitle("system lists");
  const myListTitle = createListTitle("my lists");

  //////// ELEMENT ASSEMBLY ////////
  systemListWrapper.append(systemListTitle, innerSystemListsWrapper);
  myListWrapper.append(myListTitle, innerMyListsWrapper);

  sidebar.append(systemListWrapper, myListWrapper);

  return sidebar;
}
