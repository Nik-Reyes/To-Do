import { utils } from "../../../utils/createElement.js";
import "./task.css";

export default function task(manager) {
  const tasks = [];

  // loop through all lists, check if they have tasks, and if they do, create them
  manager.lists.forEach((list) => {
    if (list.hasTasks) {
      console.log(list.todos);
      list.todos.forEach((task) => {
        const taskWrapper = utils.generateElement("div", ["task-wrapper"]);
        const taskInput = utils.generateElement("input", ["task-input"]);
        const taskCheckBox = utils.generateElement("input", ["task-checkbox"]);
        const taskNotes = utils.generateElement("textarea", ["task-notes"]);
        const taskDate = utils.generateElement("input", ["task-date"]);
        const taskPriority = utils;

        taskInput.type = "text";
        taskInput.name = "task";
        taskInput.placeholder = " ";
        taskInput.value = task.title;
        taskInput.style.width = taskInput.value.length + "ch";
        taskInput.addEventListener("focus", () => {
          taskInput.style.width = `100%`;
        });
        taskInput.addEventListener("blur", () => {
          taskInput.style.width = taskInput.value.length + "ch";
        });
        taskInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === "Escape") {
            taskInput.style.width = taskInput.value.length + "ch";
            taskInput.blur();
          }
        });

        taskCheckBox.type = "checkbox";
        taskCheckBox.name = task.title;
        taskCheckBox.value = task.title;

        taskNotes.rows = 1; // prevents content jumping
        taskNotes.placeholder = "Notes";
        taskNotes.addEventListener("input", () => {
          taskNotes.style.height = "auto"; // shrinks to auto
          taskNotes.style.height = taskNotes.scrollHeight + "px"; // Expand to content
        });

        taskDate.type = "date";
        taskDate.name = "due-date";
        taskDate.min = "2025-01-01";
        taskDate.max = "2025-12-31";

        taskWrapper.append(taskCheckBox, taskInput, taskNotes, taskDate);
        tasks.push(taskWrapper);
      });
    }
  });
  return tasks;
}
