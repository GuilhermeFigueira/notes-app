const createNoteForm = document.getElementById("createNoteForm");
const noteTextInput = document.getElementById("noteText");
const noteTitleInput = document.getElementById("noteTitle");
const notesDiv = document.getElementById("notes");

const noteHandler = createNoteHandler();

noteHandler.subscribe(renderItems);
noteHandler.subscribe(saveChangesOnBrowser);

document.addEventListener("DOMContentLoaded", () => {
	const notes = loadFromBrowser("notes");
	if (Object.keys(notes).length) {
		noteHandler.updateState(notes);
	}
});

createNoteForm.addEventListener("submit", (e) => {
	e.preventDefault();
	noteTitle = noteTitleInput.value;
	noteText = noteTextInput.value;
	if (noteTitle && noteText) {
		noteHandler.createNote({ text: noteText, title: noteTitle });
	}
});

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

	let notes = [];

	function updateState(newNotes) {
		Object.assign(notes, newNotes);
		notifyAll(notes);
	}

	function createNote(note) {
		const title = note.title;
		const text = note.text;
		const date = new Date();
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		const dateCreated = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;
		const noteId = `${dateCreated}_${Math.floor(Math.random() * 10000)}`;

		notes.push({
			noteId: noteId,
			title: title,
			text: text,
			date: dateCreated,
		});
		notifyAll(notes);
	}

	function deleteNote(noteId) {
		notes = notes.filter((note) => {
			return note.noteId !== noteId;
		});
		notifyAll(notes);
	}
	function editNote(noteId) {}

	return {
		createNote,
		deleteNote,
		editNote,
		subscribe,
		updateState,
	};
}
function saveChangesOnBrowser(object) {
	// const name = Object.name(object);
	object = JSON.stringify(object);
	localStorage.setItem("notes", object);
}

function loadFromBrowser(itemName) {
	const notes = JSON.parse(localStorage.getItem(itemName));
	return { ...notes };
}

function renderItems(items) {
	notesDiv.innerHTML = "";
	items.forEach((item) => {
		const title = item.title;
		const text = item.text;
		const itemDiv = document.createElement("div");
		itemDiv.id = item.noteId;
		itemDiv.classList.add("note");
		const itemTitleHTML = document.createElement("h1");
		const itemTextHTML = document.createElement("p");
		const deleteItemButton = document.createElement("button");
		const editItemButton = document.createElement("button");
		const itemDate = document.createElement("span");
		itemDate.textContent = item.date;
		deleteItemButton.addEventListener("click", () =>
			noteHandler.deleteNote(item.noteId)
		);
		deleteItemButton.textContent = "Delete Note";
		editItemButton.addEventListener("click", () =>
			noteHandler.editNote(item.noteId)
		);
		editItemButton.textContent = "Edit Note";
		editItemButton.classList.add("editButton");
		deleteItemButton.classList.add("deleteButton");
		itemTitleHTML.textContent = title;
		itemTextHTML.textContent = text;
		notesDiv.appendChild(itemDiv);
		itemDiv.appendChild(itemTitleHTML);
		itemDiv.appendChild(itemTextHTML);
		itemDiv.appendChild(itemDate);
		itemDiv.appendChild(deleteItemButton);
		itemDiv.appendChild(editItemButton);
	});
}
