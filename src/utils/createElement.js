export const utils = {
  generateElement: (type, attributes = {}, content = null) => {
    const element = document.createElement(type);
    if (content) {
      element.innerText = content;
    }

    if (attributes && attributes instanceof Object) {
      Object.entries(attributes)
        .filter(([key, value]) => {
          return value.toString() !== "false" && value !== undefined;
        })
        .forEach(([key, value]) => {
          element.setAttribute(
            key,
            value === true || value === undefined ? key : value
          );
        });
    }
    return element;
  },
};
