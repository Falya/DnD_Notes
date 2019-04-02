'use strict';
let notes = new Set();

let board = document.getElementById('board'),
	newNoteBtn = document.getElementById('newnote');
console.log(localStorage);


class Note {
	constructor(board, args = {}) {

		let {text, posX, posY} = Object.keys(args).length ? args : {
			text: 'New text is here',
			posX: 10,
			posY: 10,
		};

		this.text = text;
		this.posX = posX;
		this.posY = posY;
		this.board = board;

	}

	createNote(notes, createHtml) {
		let newNote = document.createElement('div');
		newNote.classList.add('note');
		newNote.style.cssText = `left: ${this.posX}; top: ${this.posY}; transform: rotate(${15 - [...notes].indexOf(this)}deg)`;

		let textDiv = document.createElement('div');
		textDiv.innerHTML = this.text;
		newNote.appendChild(textDiv);

		let textarea = document.createElement('textarea');
		if (this.text !== 'New text is here') {
			textarea.value = this.text;
		}
		newNote.appendChild(textarea);

		let removeBtn = document.createElement('span');
		removeBtn.classList.add('remove-btn');
		removeBtn.innerHTML = 'X';
		removeBtn.addEventListener('click', () => {
			notes.delete(this);
			createHtml(); //
		}, {once: true});
		newNote.appendChild(removeBtn);

		newNote.ondblclick = () => {
			newNote.style.transform = '';
			textDiv.style.display = 'none';
			textarea.style.display = 'block';
			textarea.focus();
		};

		textarea.onkeypress = (ev) => {
			if (ev.key === 'Enter' && ev.shiftKey === false) {
				ev.preventDefault();
				entriesText.call(this);
			}
		};


		textarea.addEventListener('focusout', () => {
			entriesText.call(this);
		});

		function entriesText() {
			console.log(this);
			textarea.removeAttribute('style');
			textDiv.removeAttribute('style');
			this.text = textarea.value ? textarea.value : this.text;
			newNote.style.transform = `transform: rotate(${15 - [...notes].indexOf(this)}deg)`;//////
			createHtml();/////
		}

		newNote.onmousedown = (ev) => {
			this.deltaX = ev.pageX - newNote.offsetLeft;
			this.deltaY = ev.pageY - newNote.offsetTop;
			this.noteWidth = newNote.offsetWidth;
			this.noteHeight = newNote.offsetHeight;
			window.addEventListener('mousemove', this);
		};

		window.addEventListener('mouseup', () => {
			console.log();
			window.removeEventListener('mousemove', this);
		});

		this.board.appendChild(newNote);


	}

	getMousePos(e) {
		let pX = e.pageX;
		let pY = e.pageY;
		if (pX - this.deltaX < 0) {
			this.posX = 0;

			if (pY - this.deltaY < 0) {
				this.posY = 0;

			} else if ((pY - this.deltaY + this.noteHeight) > this.board.offsetHeight) {////????
				this.posY = `${this.board.offsetHeight - this.noteHeight}px`;

			} else {
				this.posY = `${pY - this.deltaY}px`;
			}
		} else if (pY - this.deltaY < 0) {
			this.posY = 0;

			if (pX - this.deltaX < 0) {
				this.posX = 0;

			} else if ((pX - this.deltaX + this.noteWidth) > this.board.offsetWidth) {
				this.posX = `${this.board.offsetWidth - this.noteWidth}px`;

			} else {
				this.posX = `${pX - this.deltaX}px`;
			}
		} else if ((pX - this.deltaX + this.noteWidth) > this.board.offsetWidth) {
			this.posX = `${this.board.offsetWidth - this.noteWidth}px`;

			if ((pY - this.deltaY + this.noteHeight) > this.board.offsetHeight) {
				this.posY = `${this.board.offsetHeight - this.noteHeight}px`;

			} else {
				this.posY = `${pY - this.deltaY}px`;
			}


		} else if ((pY - this.deltaY + this.noteHeight) > this.board.offsetHeight) {
			this.posY = `${this.board.offsetHeight - this.noteHeight}px`;
			this.posX = `${pX - this.deltaX}px`;
		} else {
			this.posX = `${pX - this.deltaX}px`;
			this.posY = `${pY - this.deltaY}px`;
		}

		createHtml();
	}

	handleEvent(e) {
		this.getMousePos(e);
	}

}

if (localStorage.length) {
	for (let i = 0; i < localStorage.length; i++) {
		let args = JSON.parse(localStorage.getItem(`${i}`));
		console.log(args);
		let newNote = new Note(board, args);
		notes.add(newNote);
	}
	localStorage.clear();
	createHtml();
}

function createHtml() {
	board.innerHTML = '';
	if (localStorage.length) {
		localStorage.clear();
	}

	[...notes].forEach((note, index) => {
		note.createNote(notes, createHtml);
		localStorage.setItem(index, JSON.stringify({text: note.text, posX: note.posX, posY: note.posY}));
	});

}

newNoteBtn.addEventListener('click', () => {
	let newNote = new Note(board);
	notes.add(newNote);
	console.log(notes);
	createHtml();
});

