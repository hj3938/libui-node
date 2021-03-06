const {readFileSync, writeFileSync} = require('fs');
const libui = require('../index.js');
libui.Ui.init();
const {
	label,
	window,
	tab,
	menu,
	multilineEntry
} = require('./utils.js');

const onClosing = () => libui.stopLoop();

const winProps = {
	hasMenubar: true,
	title: 'Node Pad',
	width: 640,
	height: 480,
	onClosing
};

libui.Ui.init();

let win;
let editor;
let status;
let currentFileName = '';

function newFile() {
	editor.text = '';
	currentFileName = '';
}

function openFile() {
	const filename = libui.UiDialogs.openFile(win);
	if (filename) {
		const content = readFileSync(filename, 'utf8');
		editor.text = content;
		currentFileName = filename;
	}
}

function saveFileAs() {
	const filename = libui.UiDialogs.saveFile(win);
	if (filename) {
		currentFileName = filename;
		writeFileSync(currentFileName, editor.text);
	}
}

function saveFile() {
	if (!currentFileName) {
		return saveFileAs();
	}
	writeFileSync(currentFileName, editor.text);
}

menu([{
	label: 'File',
	submenu: [
		{
			label: 'New file',
			click: newFile
		}, {
			label: 'Open',
			click: openFile
		}, {
			label: 'Close current tab',
			click: () => {}
		}, {
			label: 'Save',
			click: saveFile
		}, {
			label: 'Save as',
			click: saveFileAs
		}, {
			role: 'quit'
		}
	]
}, {
	label: 'Edit',
	submenu: [
		{
			label: 'Copy'
		}, {
			label: 'Paste'
		}, {
			label: 'Cut'
		}, {
			label: 'Select all'
		}
	]
}, {
	label: 'Help',
	submenu: [
		{
			label: 'Help',
			click: () => {}
		}, {
			role: 'about'
		}
	]
}]);

win = window(winProps,
	tab({stretchy: true},
		editor = multilineEntry({stretchy: true, tabTitle: 'New file'})
	),
	status = label({stretchy: false, text: 'File not changed'})
);

win.show();
libui.startLoop();

