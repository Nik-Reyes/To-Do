import createClearCompletedBtn from '../../Buttons/ClearCompleted/CreateClearCompletedButton.js';
import createAddButton from '../../AddingButton/CreateAddButton.js';
import generateElement from '../../../utils/GenerateElement.js';
import '.././navStyles.css';

export default function createGenericNav() {
	const addTaskBtn = createAddButton({ class: 'add-task', text: 'Add Task' });
	const clearCompletedBtn = createClearCompletedBtn();
	const nav = generateElement('nav', { class: 'navigation toolbar' });
	nav.append(clearCompletedBtn, addTaskBtn);

	return nav;
}
