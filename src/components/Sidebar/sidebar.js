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

  const searchWrapper = generateElement("div", { class: "search" });
  const searchLabel = generateElement("label", {
    for: "search",
    "aria-label": "search",
  });
  const searchInput = generateElement("input", {
    type: "search",
    name: "searchBar",
    id: "search",
    placeholder: "search",
  });

  const systemListWrapper = generateElement("div", {
    class: "system-list-wrapper",
  });

  const myListWrapper = generateElement("div", {
    class: "mylist-wrapper",
  });

  const systemListTitle = createListTitle("SYSTEM LISTS");
  const myListTitle = createListTitle("MY LISTS");

  const addListButtonWrapper = generateElement("div", {
    class: "addList-btn-wrapper",
  });
  const addListButton = generateElement(
    "button",
    { class: "addList-btn" },
    "+ ADD LIST"
  );

  //////// ELEMENT ASSEMBLY ////////
  addListButtonWrapper.appendChild(addListButton);
  systemListWrapper.appendChild(systemListTitle);
  myListWrapper.appendChild(myListTitle);
  searchLabel.appendChild(searchInput);
  searchWrapper.appendChild(searchLabel);

  sidebar.append(
    createHamburger(),
    searchWrapper,
    systemListWrapper,
    myListWrapper,
    addListButtonWrapper
  );

  return sidebar;
}
