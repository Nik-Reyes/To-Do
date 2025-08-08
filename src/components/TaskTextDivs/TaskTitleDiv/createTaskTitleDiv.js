import generateElement from '../../../utils/GenerateElement.js';

export default function createTaskTitleDiv(task) {
	const taskTitle = generateElement(
		'div',
		{
			class: 'task-input',
			readonly: task.checked,
		},
		task.title,
	);

	return taskTitle;
}
