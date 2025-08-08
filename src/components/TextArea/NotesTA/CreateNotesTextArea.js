import generateElement from '../../../utils/GenerateElement.js';

export default function createNotesTextArea(task) {
	const taskNotes = generateElement(
		'textarea',
		{
			class: 'task-notes',
			placeholder: 'Notes',
			disabled: task.checked,
		},
		task.notes.toLowerCase() === 'notes' ? '' : task.notes,
	);

	requestAnimationFrame(() => {
		taskNotes.setAttribute('style', `height: 1px`);
		taskNotes.setAttribute('style', `height: ${taskNotes.scrollHeight}px`);
	});

	return taskNotes;
}
