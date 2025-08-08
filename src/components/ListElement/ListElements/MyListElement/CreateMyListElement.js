import generateElement from '../../../../utils/GenerateElement.js';
import './myListElement.css';
import '../../list.css';

export default function createMyListElement(list, attributes) {
	//////// ELEMENT CREATION ////////
	const listButtonWrapper = generateElement('div', {
		'class': 'list-btn-wrapper my-list',
		'data-id': list.id,
	});

	//////// TITLE PORTION OF THE LIST BUTTON ////////
	const listElementTitle = generateElement('div', {
		class: 'list-element-title',
	});

	const svgEditOptions = generateElement('div', { class: 'edit-list' });

	const svgWrapper = generateElement('svg', {
		class: 'svg-wrapper stacked',
		overflow: 'visible',
		preserveAspectRatio: 'none',
	});

	const svgStroke = generateElement('polygon', {
		'fill': 'none',
		'vector-effect': 'non-scaling-stroke',
	});

	const buttonName = generateElement('span', { class: 'list-title' }, list.title);

	const taskCount = generateElement('span', { class: 'task-count' }, list.numberOfTasks.toString());

	const listButton = generateElement('button', {
		'class': attributes?.class || 'list-btn stacked',
		'data-btn-type': 'my-list-btn',
	});

	//////// EXPANDABLE BY HOVERING PORTION OF THE LIST BUTTON ////////
	const hoverableListContentWrapper = generateElement('div', {
		class: 'hoverable-list-content-wrapper',
	});

	const hoverableListContent = generateElement('div', {
		class: 'hoverable-list-content',
	});

	const editListButton = generateElement(
		'button',
		{
			'class': 'cyberpunk-clip-wrapper-bl edit-list-btn',
			'data-btn-type': 'edit-list',
		},
		'edit',
	);

	const deleteListButton = generateElement(
		'button',
		{
			'class': 'cyberpunk-clip-wrapper-br delete-list-btn',
			'data-btn-type': 'delete-list',
		},
		'delete',
	);

	//////// ELEMENT ASSEMBLY ////////
	listButton.append(buttonName, taskCount);
	svgWrapper.appendChild(svgStroke);
	listElementTitle.append(svgEditOptions, svgWrapper, listButton);
	hoverableListContent.append(editListButton, deleteListButton);
	hoverableListContentWrapper.appendChild(hoverableListContent);
	listButtonWrapper.append(listElementTitle, hoverableListContentWrapper);

	return listButtonWrapper;
}
