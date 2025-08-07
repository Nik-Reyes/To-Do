export default function generateElement(type, attributes = {}, content = null) {
  let element = null;
  if (type === "svg" || type === "polygon") {
    element = document.createElementNS("http://www.w3.org/2000/svg", type);
  } else {
    element = document.createElement(type);
  }

  if (attributes && attributes instanceof Object) {
    Object.entries(attributes)
      .filter(([key, value]) => {
        return value !== undefined && value.toString() !== "false";
      })
      .forEach(([key, value]) => {
        element.setAttribute(
          key,
          value === true || value === undefined ? key : value
        );
      });
  }

  if (content) {
    if (element.tagName === "DIV" && element.className.includes("task-input")) {
      element.innerText = content;
    } else {
      element.textContent = content;
    }
  }

  return element;
}
