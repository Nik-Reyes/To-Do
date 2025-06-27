import { utils } from "../../../utils/createElement.js";
import "./task.css";

export default function task(manager) {
  const tasks = [];
  // loop through all lists, check if they have tasks, and if they do, create them
  manager.lists.forEach((list) => {
    if (list.hasTasks) {
      list.todos.forEach((task) => {
        //////// ELEMENT CREATION ////////
        const taskWrapper = utils.generateElement("div", ["task-wrapper"]);
        const taskContentBorder = utils.generateElement("div", [
          "task-content-border",
        ]);
        const taskContent = utils.generateElement("div", ["task-content"]);
        const taskInput = utils.generateElement("input", ["task-input"]);
        const taskCheckBox = utils.generateElement("input", ["task-checkbox"]);
        const expandableContentWrapper = utils.generateElement("div", [
          ["expandable-content-wrapper"],
        ]);
        const expandableContent = utils.generateElement("div", [
          "expandable-content",
        ]);
        const taskNotes = utils.generateElement("textarea", ["task-notes"]);
        const taskDate = utils.generateElement("input", ["task-date"]);
        const taskPriorityWrapper = utils.generateElement("div", [
          "task-priority-wrapper",
        ]);
        const taskPriority = utils.generateElement(
          "button",
          ["task-priority"],
          "Priority"
        );
        const taskPriorityColorPanel = utils.generateElement("div", [
          "no-priority",
          "priority-panel",
        ]);
        const taskPriorityInnerDiv = utils.generateElement("div", [
          "inner-div",
        ]);
        const moreOptions = utils.generateElement("div", ["more-options"]);

        //////// ELEMENT ATTRIBUTES APPLICATION ////////
        taskInput.type = "text";
        taskInput.name = "task";
        taskInput.placeholder = " ";
        taskInput.value = task.title;
        taskInput.style.width = `${taskInput.value.length + 2.5}ch`;

        taskCheckBox.type = "checkbox";
        taskCheckBox.name = task.title;
        taskCheckBox.value = task.title;
        taskCheckBox.checked = task.completed;

        taskNotes.rows = 1; // prevents content jumping
        taskNotes.placeholder = "Notes";

        taskDate.type = "date";
        taskDate.name = "due-date";
        taskDate.min = "2025-01-01";
        taskDate.max = "2025-12-31";

        //////// ELEMENT EVENT LISTENER APPLICATION ////////
        taskCheckBox.addEventListener("input", () => {
          task.completed ? console.log("checked") : console.log("unchecked");
        });
        taskInput.addEventListener("click", (e) => {
          e.stopPropagation();
          const activeTask = e.target.closest(".task-content");
          if (!activeTask) return;
          tasks.forEach((taskContentBorder) =>
            taskContentBorder
              .querySelector(".task-content")
              .classList.remove("active")
          );
          taskContent.classList.add("active");
          taskInput.style.width = `100%`;
        });
        taskInput.addEventListener("blur", (e) => {
          e.stopPropagation();
          taskInput.style.width = `${taskInput.value.length + 2}ch`;
        });
        taskInput.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Enter" || e.key === "Escape") {
            taskInput.style.width = taskInput.value.length + "ch";
            taskInput.blur();
          }
        });
        taskNotes.addEventListener("input", (e) => {
          e.stopPropagation();
          taskNotes.style.height = "auto"; // shrinks to auto when content shrinks
          taskNotes.style.height = taskNotes.scrollHeight + "px"; // grows to fit content
        });
        taskNotes.addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            taskNotes.blur();
          }
        });
        // check if task wrapper is active and if the element clicked is outside the taskContent
        document.addEventListener("click", (e) => {
          if (
            taskContent.classList.contains("active") &&
            !taskContent.contains(e.target)
          ) {
            taskContent.classList.remove("active");
          }
        });

        //////// TASK ELEMENT ASSEMBLY ////////
        taskPriorityWrapper.appendChild(taskPriority);
        taskPriorityColorPanel.appendChild(taskPriorityInnerDiv);
        moreOptions.append(taskDate, taskPriorityWrapper);
        expandableContent.append(taskNotes, moreOptions);
        expandableContentWrapper.append(expandableContent);
        taskContent.append(taskCheckBox, taskInput, expandableContentWrapper);
        taskContentBorder.appendChild(taskContent);
        taskWrapper.append(taskPriorityColorPanel, taskContentBorder);
        tasks.push(taskWrapper);
      });
    }
  });
  return tasks;
}
