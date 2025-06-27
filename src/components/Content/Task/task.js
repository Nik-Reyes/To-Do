import { utils } from "../../../utils/createElement.js";

export default function task(task) {
  //////// ELEMENT CREATION ////////
  const taskWrapper = utils.generateElement("div", { class: "task-wrapper" });
  const taskContentBorder = utils.generateElement("div", {
    class: "cyberpunk-clipped-wrapper-br",
  });
  const taskContent = utils.generateElement("div", { class: "task-content" });
  const taskInput = utils.generateElement("input", {
    class: "task-input",
    type: "text",
    name: "task",
    placeholder: " ",
    value: task.title,
    style: `width: ${task.title.length + 2.5}ch`,
  });
  const taskCheckBox = utils.generateElement("input", {
    class: "task-checkbox",
    type: "checkbox",
    name: task.title,
    value: task.title,
    checked: true,
  });
  const expandableContentWrapper = utils.generateElement("div", {
    class: "expandable-content-wrapper",
  });
  const expandableContent = utils.generateElement("div", {
    class: "expandable-content",
  });
  const taskNotes = utils.generateElement("textarea", {
    class: "task-notes",
    rows: "1",
    placeholder: "Notes",
  });
  const taskDate = utils.generateElement("input", {
    class: "task-date",
    type: "date",
    name: "due-date",
    min: "2025-01-01",
    max: "2025-12-31",
  });
  const taskPriorityWrapper = utils.generateElement("div", {
    class: "cyberpunk-clipped-wrapper-br priority-btn-wrapper",
  });
  const taskDateWrapper = utils.generateElement("div", {
    class: "cyberpunk-clipped-wrapper-br date-wrapper",
  });
  const taskPriority = utils.generateElement(
    "button",
    {
      class: "task-priority",
    },
    "Priority"
  );
  const taskPriorityColorPanel = utils.generateElement("div", {
    class: "no-priority priority-panel",
  });
  const taskPriorityInnerDiv = utils.generateElement("div", {
    class: "inner-div",
  });
  const moreOptions = utils.generateElement("div", { class: "more-options" });

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
  taskCheckBox.addEventListener("input", () => {
    task.completed ? console.log("checked") : console.log("unchecked");
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
  taskDateWrapper.appendChild(taskDate);
  taskPriorityWrapper.appendChild(taskPriority);
  taskPriorityColorPanel.appendChild(taskPriorityInnerDiv);
  moreOptions.append(taskDateWrapper, taskPriorityWrapper);
  expandableContent.append(taskNotes, moreOptions);
  expandableContentWrapper.append(expandableContent);
  taskContent.append(taskCheckBox, taskInput, expandableContentWrapper);
  taskContentBorder.appendChild(taskContent);
  taskWrapper.append(taskPriorityColorPanel, taskContentBorder);

  return taskWrapper;
}
