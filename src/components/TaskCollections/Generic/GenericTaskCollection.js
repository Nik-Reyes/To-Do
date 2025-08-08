import generateElement from '../../../utils/GenerateElement.js';
import './genericCollection.css';

export default function createGenericTaskCollection(collectionState) {
	const section = generateElement('section', {
		'class': 'task-collection generic',
		'data-collection-state': collectionState,
	});

	const tagRow = generateElement('div', { class: 'tag-row' });
	section.append(tagRow);

	return section;
}
