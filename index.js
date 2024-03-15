const createNoteForm = document.getElementById("createNoteForm");
const noteTextInput = document.getElementById("noteText");
const noteTitleInput = document.getElementById("noteTitle");

const noteHandler = createNoteHandler();

createNoteForm.addEventListener("submit", (e) => {
	e.preventDefault();
	noteTitle = noteTitleInput.value;
	noteText = noteTextInput.value;
	noteHandler.createNote({ text: noteText, title: noteTitle });
});

noteHandler.subscribe(saveChangesOnBrowser);

function createNoteHandler() {
	let observers = [];

	function subscribe(observerFunction) {
		observers.push(observerFunction);
	}

	function notifyAll(info) {
		let modifiedInfo = info;
		for (const observerFunction of observers) {
			const result = observerFunction(modifiedInfo);
			if (result) {
				modifiedInfo = result;
			}
		}
	}

	const notes = {};

	function createNote(note) {
		const title = note.title;
		const text = note.text;
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = date.getMinutes();

		const dateCreated = `${day}-${month}-${year}-${hours}-${minutes}`;
		const noteId = `${dateCreated}_${Math.floor(Math.random() * 10000)}`;

		notes[noteId] = {
			title: title,
			text: text,
			date: dateCreated,
		};

		notifyAll(notes);
	}

	function renderNote(note) {}
	function deleteNote(noteId) {}
	function editNote(noteId) {}

	return {
		createNote,
		renderNote,
		deleteNote,
		editNote,
		subscribe,
	};
}
function saveChangesOnBrowser(object) {
	// const name = Object.name(object);
	object = JSON.stringify(object);
	localStorage.setItem("notes", object);
}
function loadSaveBrowser() {
	const notesss = JSON.parse(localStorage.getItem("notes"));
}
