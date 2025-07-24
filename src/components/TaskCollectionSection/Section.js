import generateElement from "../../utils/GenerateElement";
import "./section.css";

export default function createSection(title, buttonText, hasTasks) {
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

  titleWrapper.appendChild(sectionTitle);

  if (hasTasks) {
    const sectionExpansionBtn = generateElement(
      "button",
      { class: "expand-collapse" },
      buttonText || "Collapse"
    );
    titleWrapper.appendChild(sectionExpansionBtn);
  }

  sectionWrapper.appendChild(titleWrapper);

  return sectionWrapper;
}
