import generateElement from '../../utils/GenerateElement.js';
import createAddButton from '../AddingButton/CreateAddButton.js';
import './listTitle.css';

export default function createListTitle(title) {
	const listTitleWrapper = generateElement('div', {
		class: 'list-title-wrapper',
	});

	const listTitle = generateElement('h3', { class: 'list-section-title' }, title);

	listTitleWrapper.appendChild(listTitle);
	if (title === 'my lists') {
		const addButton = createAddButton({ class: 'addList' });
		listTitleWrapper.append(addButton);
	}

	return listTitleWrapper;
}
