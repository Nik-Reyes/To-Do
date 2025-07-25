export default function generateElement(type, attributes = {}, content = null) {
  let element = null;
  if (type === "svg" || type === "polygon") {
    element = document.createElementNS("http://www.w3.org/2000/svg", type);
  } else {
    element = document.createElement(type);
  }
  if (content) {
    element.textContent = content;
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
  return element;
}
