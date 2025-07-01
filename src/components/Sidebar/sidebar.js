import generateElement from "../../utils/GenerateElement.js";
import createHamburger from "../Hamburger/CreateHamburger.js";
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

  const myListTitle = generateElement(
    "h3",
    { class: "mylist-title" },
    "MY LISTS"
  );

  //////// ELEMENT ASSEMBLY ////////
  myListWrapper.appendChild(myListTitle);
  searchLabel.appendChild(searchInput);
  searchWrapper.appendChild(searchLabel);
  sidebar.append(
    createHamburger(),
    searchWrapper,
    systemListWrapper,
    myListWrapper
  );

  return sidebar;
}
