import generateElement from '../../../utils/GenerateElement.js';

export default function createTaskNotesDiv(task) {
	const taskNotes = generateElement(
		'div',
		{
			class: 'task-notes',
			placeholder: 'Notes',
			disabled: task.checked,
		},
		task.notes || 'Notes',
	);

	return taskNotes;
}
