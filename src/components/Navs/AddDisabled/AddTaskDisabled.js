import createClearCompletedBtn from '../../Buttons/ClearCompleted/CreateClearCompletedButton.js';
import generateElement from '../../../utils/GenerateElement.js';
import '.././navStyles.css';

export default function createDisabledNav() {
	const nav = generateElement('nav', { class: 'navigation toolbar' });
	const clearCompletedBtn = createClearCompletedBtn();
	nav.appendChild(clearCompletedBtn);

	return nav;
}
