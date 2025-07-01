import generateElement from "../../utils/createElement.js";
import "./sidebar.css";

export default function createSidebar() {
  //////// ELEMENT CREATION ////////
  const sidebar = generateElement("aside", {
    id: "sidebar",
    class: "side-panel",
  });

  const hamburger = generateElement("button", {
    class: "hamburger close-sidepanel",
    "aria-label": "Close Menu",
    "aria-expanded": "true",
    role: "button",
    tabindex: "0",
    "aria-controls": "sidebar",
  });

  const hamLine1 = generateElement("span", { class: "ham-line" });
  const hamLine2 = generateElement("span", { class: "ham-line" });
  const hamLine3 = generateElement("span", { class: "ham-line" });

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
  hamburger.append(hamLine1, hamLine2, hamLine3);
  searchLabel.appendChild(searchInput);
  searchWrapper.appendChild(searchLabel);
  sidebar.append(hamburger, searchWrapper, systemListWrapper, myListWrapper);

  return sidebar;
}
