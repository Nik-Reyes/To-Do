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
    checked: true,
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
  const taskDate = generateElement("input", {
    class: "inner-cyberpunk-clip-wrapper-br task-date",
    type: "date",
    name: "due-date",
    min: "2025-01-01",
    max: "2025-12-31",
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
  const priorityMenuWrapper = generateElement("div", {
    id: task.id,
    class: "cyberpunk-clip-wrapper-br priority-menu-wrapper",
    popover: "auto",
    style: `position-anchor: --${task.id}`,
  });
  const priorityMenu = generateElement("menu", {
    class: "priority-menu",
  });
  const priorityMenuOptionHigh = generateElement(
    "button",
    {
      class: "priority-menu-option high-priority",
    },
    "High Priority"
  );
  const priorityMenuOptionMedium = generateElement(
    "button",
    {
      class: "priority-menu-option medium-priority",
    },
    "Medium Priority"
  );
  const priorityMenuOptionLow = generateElement(
    "button",
    {
      class: "priority-menu-option low-priority",
    },
    "Low Priority"
  );
  const priorityMenuOptionNone = generateElement(
    "button",
    {
      class: "inner-cyberpunk-clip-wrapper-br priority-menu-option no-priority",
    },
    "No Priority"
  );
  const menuSpacer = generateElement("span", { class: "menu-spacer" });
  const taskPriorityColorPanel = generateElement("div", {
    class: "no-priority priority-panel",
  });
  const taskPriorityInnerDiv = generateElement("div", {
    class: "inner-div",
  });
  const moreOptions = generateElement("div", { class: "more-options" });

  //////// ACTIVE STATE MANAGEMENT ////////
  const removeActiveState = () => {
    taskContent.classList.remove("active");
    taskInput.blur();
  };

  const addActiveState = () => {
    document.dispatchEvent(
      new CustomEvent("task:collapse-task", {
        detail: { activeTask: taskContent },
      })
    );
    taskContent.classList.add("active");
    taskInput.style.width = "100%";
  };

  document.addEventListener("task:collapse-task", (e) => {
    if (e.detail.activeTask !== taskContent) {
      removeActiveState();
    }
  });

  //////// ELEMENT EVENT LISTENER APPLICATION ////////
  taskWrapper.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.tagName === "BUTTON"
    )
      return;
    taskContent.classList.toggle("active");
  });

  taskCheckBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      taskCheckBox.click();
    }
  });

  taskInput.addEventListener("click", (e) => {
    e.stopPropagation();
    addActiveState();
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

  taskDate.addEventListener("click", () => {
    taskDate.closest(".date-wrapper").classList.add("focused");
  });

  taskDate.addEventListener("blur", () => {
    taskDate.closest(".date-wrapper").classList.remove("focused");
  });

  taskDate.addEventListener("change", () => {
    taskDate.closest(".date-wrapper").classList.remove("focused");
  });

  taskDate.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      taskDate.closest(".date-wrapper").classList.remove("focused");
    }
  });

  priorityMenu.addEventListener("click", (e) => {
    if (e.target.closest(".priority-menu-option")) {
      priorityMenuWrapper.hidePopover();
      taskPriority.blur();

      // Change the color of the priority panel
      const newPriority = Array.from(e.target.classList).find((className) => {
        return className.includes("-priority");
      });
      // if the user re-selects the current priortiy, no point in replacing, just return
      if (task.priority === newPriority) return;

      taskPriorityColorPanel.classList.forEach((className) => {
        if (className.includes("-priority")) {
          taskPriorityColorPanel.classList.replace(className, newPriority);
        }
      });
    }
  });

  taskPriorityWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      priorityMenuWrapper.togglePopover();
    }
  });

  // check if task wrapper is active and if the element clicked is outside the taskContent
  document.addEventListener("click", (e) => {
    if (e.target.closest(".priority-menu-option")) return;
    if (
      taskContent.classList.contains("active") &&
      !taskContent.contains(e.target)
    ) {
      taskContent.classList.remove("active");
    }
  });

  //////// TASK ELEMENT ASSEMBLY ////////
  priorityMenu.append(
    priorityMenuOptionHigh,
    priorityMenuOptionMedium,
    priorityMenuOptionLow,
    menuSpacer,
    priorityMenuOptionNone
  );
  priorityMenuWrapper.appendChild(priorityMenu);
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
    taskContentBorder,
    priorityMenuWrapper
  );

  return taskWrapper;
}
