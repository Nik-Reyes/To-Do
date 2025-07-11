import generateElement from "../../utils/GenerateElement.js";
import createHamburger from "../Hamburger/CreateHamburger.js";
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

  const systemListTitle = createListTitle("SYSTEM LISTS");
  const myListTitle = createListTitle("MY LISTS");

  //////// ELEMENT ASSEMBLY ////////
  systemListWrapper.appendChild(systemListTitle);
  myListWrapper.appendChild(myListTitle);

  sidebar.append(createHamburger(), systemListWrapper, myListWrapper);

  return sidebar;
}
