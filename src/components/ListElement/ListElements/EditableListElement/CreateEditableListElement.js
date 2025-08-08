import generateElement from '../../../../utils/GenerateElement.js';
import '../../list.css';
import './editableList.css';

export default function createEditableListElement() {
	const listButtonWrapper = generateElement('div', {
		class: 'list-btn-wrapper my-list editable-list-element',
	});

	//////// TITLE PORTION OF THE LIST BUTTON ////////
	const listElementTitle = generateElement('div', {
		class: 'list-element-title',
	});

	const svgWrapper = generateElement('svg', {
		class: 'svg-wrapper stacked',
		overflow: 'visible',
		preserveAspectRatio: 'none',
	});

	const svgStroke = generateElement('polygon', {
		'fill': 'none',
		'vector-effect': 'non-scaling-stroke',
	});

	const input = generateElement('input', {
		type: 'text',
		id: 'editable-list-input',
		class: 'editable-list-input',
		maxlength: '17',
		placeholder: 'List Name',
		required: '',
	});

	const listElement = generateElement('div', {
		class: 'editable-list text-layer stacked',
	});

	//////// EDIT LIST ACTION BUTTONS ////////
	const confirmCancelWrapper = generateElement('div', {
		class: 'confirm-cancel-wrapper',
	});

	const confirmEditBtn = generateElement(
		'button',
		{
			'class': 'cyberpunk-clip-wrapper-bl confirm-edit-btn',
			'data-btn-type': 'confirm-edit',
		},
		'confirm',
	);

	const cancelEditBtn = generateElement(
		'button',
		{
			'class': 'cyberpunk-clip-wrapper-br cancel-edit-btn',
			'data-btn-type': 'cancel-edit',
		},
		'cancel',
	);

	//////// ELEMENT ASSEMBLY ////////
	listElement.append(input);
	svgWrapper.appendChild(svgStroke);
	listElementTitle.append(svgWrapper, listElement);
	confirmCancelWrapper.append(confirmEditBtn, cancelEditBtn);
	listButtonWrapper.append(listElementTitle, confirmCancelWrapper);

	return listButtonWrapper;
}
