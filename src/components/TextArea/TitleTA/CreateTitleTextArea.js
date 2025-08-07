import generateElement from "../../../utils/GenerateElement.js";
const TASK_TITLE_HEIGHT = 29; //calculated by hand using: height = line-height(1.4) * font-size(1.25rem) - values as seen in "./task.css";

export default function createTitleTextArea(task) {
  const taskInput = generateElement(
    "textarea",
    {
      class: "task-input",
      style: `height: ${TASK_TITLE_HEIGHT}px`,
      readonly: task.checked,
    },
    task.title
  );

  requestAnimationFrame(() => {
    if (taskInput.scrollHeight > TASK_TITLE_HEIGHT) {
      taskInput.setAttribute("style", `height: ${taskInput.scrollHeight}px`);
    }
  });

  return taskInput;
}
