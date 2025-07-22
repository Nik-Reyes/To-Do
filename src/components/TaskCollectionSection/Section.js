import generateElement from "../../utils/GenerateElement";
import "./section.css";

export default function createSection(title) {
  const sectionWrapper = generateElement("div", {
    class: "section-wrapper",
  });
  const titleWrapper = generateElement("div", {
    class: "title-wrapper",
  });

  const sectionTitle = generateElement(
    "span",
    {
      class: "section-title",
    },
    title
  );
  const sectionExpansionBtn = generateElement(
    "button",
    { class: "expand-collapse" },
    "Collapse"
  );
  titleWrapper.append(sectionTitle, sectionExpansionBtn);
  sectionWrapper.appendChild(titleWrapper);

  return sectionWrapper;
}
