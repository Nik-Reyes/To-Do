// task.js creates a singluar task element
// each task element is fully de-coupled from one another
// no task is responsible for updating its respective task object it was created from
// each task is responsible ONLY for its own UI changes
// no task is reponsible for updating its own states, even though it handles UI changes

import generateElement from "../../utils/GenerateElement.js";

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
    checked: task.completed,
  });
  const expandableContentWrapper = generateElement("div", {
    class: "expandable-content-wrapper",
  });
  const expandableContent = generateElement("div", {
    class: "expandable-content",
  });
  const taskNotes = generateElement("textarea", {
    class: "task-notes",
    rows: "1",
    placeholder: "Notes",
  });
  taskNotes.textContent = task.notes;

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
      popovertarget: task.id,
      style: `anchor-name: --${task.id}`,
    },
    "Priority"
  );
  // const priorityMenuWrapper = generateElement("div", {
  //   id: task.id,
  //   class: "cyberpunk-clip-wrapper-br priority-menu-wrapper",
  //   popover: "auto",
  //   style: `position-anchor: --${task.id}`,
  // });
  // const priorityMenu = generateElement("menu", {
  //   class: "priority-menu",
  // });
  // const priorityMenuOptionHigh = generateElement(
  //   "button",
  //   {
  //     class: "priority-menu-option high-priority",
  //   },
  //   "High Priority"
  // );
  // const priorityMenuOptionMedium = generateElement(
  //   "button",
  //   {
  //     class: "priority-menu-option medium-priority",
  //   },
  //   "Medium Priority"
  // );
  // const priorityMenuOptionLow = generateElement(
  //   "button",
  //   {
  //     class: "priority-menu-option low-priority",
  //   },
  //   "Low Priority"
  // );
  // const priorityMenuOptionNone = generateElement(
  //   "button",
  //   {
  //     class: "inner-cyberpunk-clip-wrapper-br priority-menu-option no-priority",
  //   },
  //   "No Priority"
  // );
  // const menuSpacer = generateElement("span", { class: "menu-spacer" });
  const taskPriorityColorPanel = generateElement("div", {
    class: `${task.priority} priority-panel`,
  });
  const taskPriorityInnerDiv = generateElement("div", {
    class: "inner-div",
  });
  const moreOptions = generateElement("div", { class: "more-options" });

  //////// ELEMENT EVENT LISTENER APPLICATION ////////

  // taskInput.addEventListener("blur", (e) => {
  //   e.stopPropagation();
  //   taskInput.style.width = `${taskInput.value.length + 2}ch`;
  // });

  // taskDate.addEventListener("blur", () => {
  //   taskDate.closest(".date-wrapper").classList.remove("focused");
  // });

  // taskNotes.addEventListener("input", (e) => {
  //   e.stopImmediatePropagation();
  //   taskNotes.style.height = "auto"; // shrinks to auto when content shrinks
  //   taskNotes.style.height = taskNotes.scrollHeight + "px"; // grows to fit content
  // });

  // taskDate.addEventListener("click", () => {
  //   taskDate.closest(".date-wrapper").classList.add("focused");
  // });

  // taskDate.addEventListener("change", () => {
  //   taskDate.closest(".date-wrapper").classList.remove("focused");
  // });

  // taskDate.addEventListener("keydown", (e) => {
  //   if (e.key === "Escape") {
  //     taskDate.closest(".date-wrapper").classList.remove("focused");
  //   }
  // });

  // taskNotes.addEventListener("keydown", (e) => {
  //   e.stopImmediatePropagation();
  //   if (e.key === "Escape") {
  //     taskNotes.blur();
  //   }
  // });

  // taskInput.addEventListener("keydown", (e) => {
  //   e.stopPropagation();
  //   if (e.key === "Enter" || e.key === "Escape") {
  //     taskInput.style.width = taskInput.value.length + "ch";
  //     taskInput.blur();
  //   }
  // });

  // taskCheckBox.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     taskCheckBox.click();
  //   }
  // });

  // taskPriorityWrapper.addEventListener("keydown", (e) => {
  //   if (e.key === "Enter") {
  //     priorityMenuWrapper.togglePopover();
  //   }
  // });
  //////// TASK ELEMENT ASSEMBLY ////////
  // priorityMenu.append(
  //   priorityMenuOptionHigh,
  //   priorityMenuOptionMedium,
  //   priorityMenuOptionLow,
  //   menuSpacer,
  //   priorityMenuOptionNone
  // );
  // priorityMenuWrapper.appendChild(priorityMenu);
  taskPriorityWrapper.append(taskPriority);
  taskPriorityColorPanel.appendChild(taskPriorityInnerDiv);
  taskDateWrapper.appendChild(taskDate);
  moreOptions.append(taskDateWrapper, taskPriorityWrapper);
  expandableContent.append(taskNotes, moreOptions);
  expandableContentWrapper.append(expandableContent);
  taskContent.append(taskCheckBox, taskInput, expandableContentWrapper);
  taskContentBorder.appendChild(taskContent);
  taskWrapper.append(
    taskPriorityColorPanel,
    taskContentBorder
    // priorityMenuWrapper
  );

  return taskWrapper;
}
