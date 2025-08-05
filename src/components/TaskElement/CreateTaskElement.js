import generateElement from "../../utils/GenerateElement.js";
import createPriorityMenu from "../PriorityMenu/CreatePriorityMenu.js";
import { format } from "date-fns";
import "./task.css";

const TASK_TITLE_HEIGHT = 29; //calculated by hand using: height = line-height(1.4) * font-size(1.25rem) - values as seen in "./task.css";

export default function createTaskElement(task) {
  //////// ELEMENT CREATION ////////
  const taskWrapper = generateElement("div", {
    class: `task-wrapper ${task.checked ? "completed" : ""}`,
    "data-task-id": task.id,
  });
  const taskContentBorder = generateElement("div", {
    class: "cyberpunk-clip-wrapper-br",
  });
  const taskContent = generateElement("div", {
    class: "inner-cyberpunk-clip-wrapper-br task-content",
  });

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

  const taskCheckBoxWrapper = generateElement("div", {
    class: "task-checkbox-wrapper",
  });

  const taskCheckBoxShell = generateElement("div", {
    class: " cyberpunk-clip-wrapper-br  task-checkbox-shell",
  });

  const taskCheckBox = generateElement("input", {
    class: "task-checkbox inner-cyberpunk-clip-wrapper-br",
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

  const taskNotes = generateElement(
    "textarea",
    {
      class: "task-notes",
      placeholder: "Notes",
      disabled: task.checked,
    },
    task.notes
  );

  const taskDate = generateElement("input", {
    class: "inner-cyberpunk-clip-wrapper-br task-date",
    type: "date",
    name: "due-date",
    min: format(new Date(), "yyyy-MM-dd"),
    value: task.dueDate,
    disabled: task.checked,
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
      disabled: task.checked,
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
  const svgWrapper = generateElement("div", { class: "delete-svg-wrapper" });
  const row = generateElement("div", { class: "row" });

  //////// ELEMENT ASSEMBLY ////////
  taskPriorityWrapper.append(taskPriority);
  taskPriorityColorPanel.appendChild(taskPriorityInnerDiv);
  taskDateWrapper.appendChild(taskDate);
  moreOptions.append(taskDateWrapper, taskPriorityWrapper);
  expandableContent.append(taskNotes, moreOptions);
  expandableContentWrapper.append(expandableContent);
  row.append(taskInput, svgWrapper);
  taskCheckBoxShell.appendChild(taskCheckBox);
  taskCheckBoxWrapper.appendChild(taskCheckBoxShell);
  taskContent.append(taskCheckBoxWrapper, row, expandableContentWrapper);
  taskContentBorder.appendChild(taskContent);
  taskWrapper.append(taskPriorityColorPanel, taskContentBorder, menu);

  return taskWrapper;
}
