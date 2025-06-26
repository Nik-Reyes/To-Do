export const utils = {
  generateElement: (type, classes, content) => {
    const element = document.createElement(type);
    element.classList.add(...classes);
    if (content && content.includes(".jpg")) {
      element.src = content;
    }
    if (content && !content.includes(".jpg")) {
      element.innerText = content;
    }
    return element;
  },
};
