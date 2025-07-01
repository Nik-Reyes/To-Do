import generateElement from "../../utils/GenerateElement";
import "./hamburger.css";

export default function createHamburger() {
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

  hamburger.append(hamLine1, hamLine2, hamLine3);

  return hamburger;
}
