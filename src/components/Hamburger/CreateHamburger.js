import generateElement from "../../utils/GenerateElement";
import "./hamburger.css";

export default function createHamburger() {
  const hamburger = generateElement("button", {
    class: "hamburger close-sidepanel",
    "aria-expanded": "true",
    "aria-controls": "sidebar",
  });

  const hamLineWrapper = generateElement("span", { class: "ham-line-wrapper" });

  const hamLine1 = generateElement("span", { class: "ham-line" });
  const hamLine2 = generateElement("span", { class: "ham-line" });
  const hamLine3 = generateElement("span", { class: "ham-line" });

  hamLineWrapper.append(hamLine1, hamLine2, hamLine3);
  hamburger.append(hamLineWrapper);

  return hamburger;
}
