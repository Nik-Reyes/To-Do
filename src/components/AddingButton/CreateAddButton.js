import generateElement from '../../utils/GenerateElement.js';
import './addButton.css';

export default function createAddButton(attributes) {
	const addListButtonWrapper = generateElement('div', {
		class: `${attributes.class}-wrapper add-btn-wrapper`,
	});
	const addListButton = generateElement('button', { class: `${attributes.class}-btn add-btn` }, attributes.text || '+');

	addListButtonWrapper.appendChild(addListButton);
	return addListButtonWrapper;
}
