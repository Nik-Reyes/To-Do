// task.js creates a singluar task element
// each task element is fully de-coupled from one another
// no task is responsible for updating its respective task object it was created from
// each task is responsible ONLY for its own UI changes
// no task is reponsible for updating its own states, even though it handles UI changes

import generateElement from "../../utils/GenerateElement.js";
import createPriorityMenu from "../PriorityMenu/CreatePriorityMenu.js";
import "./task.css";

export default function createTaskElement(task) {
  //////// ELEMENT CREATION ////////
  const taskWrapper = generateElement("div", { class: "task-wrapper" });
  const taskContentBorder = generateElement("div", {
    class: "cyberpunk-clip-wrapper-br",
  });
  const taskContent = generateElement("div", {
    class: "inner-cyberpunk-clip-wrapper-br task-content",
  });
  const taskInput = generateElement("input", {
    class: "task-input",
    type: "text",
    name: "task",
    placeholder: " ",
    value: task.title,
    style: `width: ${task.title.length + 2.5}ch`,
  });
  const taskCheckBox = generateElement("input", {
    class: "task-checkbox",
    type: "checkbox",
    name: task.title,
    value: task.title,
    checked: task.checked,
  });
  const expandableContentWrapper = generateElement("div", {
    class: "expandable-content-wrapper",
  });
  const expandableContent = generateElement("div", {
    class: "expandable-content",
  });

  const taskNotes = generateElement("textarea", {
    class: "task-notes",
    placeholder: "Notes",
  });
  taskNotes.textContent = task.notes;
  if (task.notes.length > 0) {
    console.log(task.notes.length);
    requestAnimationFrame(() => {
      taskNotes.style.height = "auto";
      taskNotes.style.height = taskNotes.scrollHeight + "px";
    });
  }

  const taskDate = generateElement("input", {
    class: "inner-cyberpunk-clip-wrapper-br task-date",
    type: "date",
    name: "due-date",
    min: "2025-01-01",
    max: "2025-12-31",
    value: task.dueDate,
  });
  const taskPriorityWrapper = generateElement("div", {
    class: "cyberpunk-clip-wrapper-br priority-btn-wrapper",
    tabIndex: "0",
  });
  const taskDateWrapper = generateElement("div", {
    class: "cyberpunk-clip-wrapper-br date-wrapper",
  });

  const taskPriority = generateElement(
    "button",
    {
      class: "inner-cyberpunk-clip-wrapper-br task-priority",
    },
    "Priority"
  );

  const taskPriorityColorPanel = generateElement("div", {
    class: `${task.priority} priority-panel`,
  });
  const taskPriorityInnerDiv = generateElement("div", {
    class: "inner-div",
  });
  const moreOptions = generateElement("div", { class: "more-options" });

  const menu = createPriorityMenu();

  //////// ELEMENT EVENT LISTENER APPLICATION ////////
  taskPriorityWrapper.append(taskPriority);
  taskPriorityColorPanel.appendChild(taskPriorityInnerDiv);
  taskDateWrapper.appendChild(taskDate);
  moreOptions.append(taskDateWrapper, taskPriorityWrapper);
  expandableContent.append(taskNotes, moreOptions);
  expandableContentWrapper.append(expandableContent);
  taskContent.append(taskCheckBox, taskInput, expandableContentWrapper);
  taskContentBorder.appendChild(taskContent);
  taskWrapper.append(taskPriorityColorPanel, taskContentBorder, menu);

  return taskWrapper;
}
