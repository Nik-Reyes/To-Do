import generateElement from '../../utils/GenerateElement.js';
import createHamburger from '../Hamburger/CreateHamburger.js';
import './header.css';

export default function createHeader(listName) {
	const header = generateElement('header', { class: 'header' });
	const headerTagLabel = generateElement('div', { class: 'header-tag-label' });
	const hamburger = createHamburger();

	const titleWrapper = generateElement('div', {
		class: 'header-title-wrapper',
	});

	const headerTitle = generateElement('h2', { class: 'header-title' }, listName);

	titleWrapper.appendChild(headerTitle);
	headerTagLabel.appendChild(titleWrapper);

	header.append(headerTagLabel, hamburger);

	return header;
}
