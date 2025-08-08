import generateElement from '../../../utils/GenerateElement.js';

export default function createClearCompletedBtn() {
	const clearCompletedWrapper = generateElement('div', {
		class: `clear-btn-wrapper`,
	});

	const clearCompleted = generateElement('button', { class: `clear-btn` }, 'Clear Completed');

	clearCompletedWrapper.appendChild(clearCompleted);
	return clearCompletedWrapper;
}
