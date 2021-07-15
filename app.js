import { data } from "./data.js";
import { renderStats } from "./stats.js";
let notesList = data;

const notesTableBody = document.getElementById("notesTableBody");
const place = document.getElementById("place");
const openFormBtn = document.getElementById("open-form-btn");
const clearPlaceBtn = document.getElementById("clear-place-btn");
const openArchiveBtn = document.getElementById("open-archive-btn");

document.addEventListener("DOMContentLoaded", () => {
  renderNotes(notesList);
});

clearPlaceBtn.addEventListener("click", () => {
  clearPlace();
});

openFormBtn.addEventListener("click", () => {
  renderForm(null, notesList);
});

openArchiveBtn.addEventListener("click", () => {
  renderArchive(notesList);
});

function renderNotes(notesList) {
  const displayedNotes = notesList.map((note) => {
    if (note["status"] === "Archived") {
      return;
    }
    const mentionedDates =
      searchDates(note.id) === null ? "" : searchDates(note.id);
    return `<tr id="${note.id}" class="note">
                <th>${
                  note.category === "Task"
                    ? `<i class="fas fa-tasks"></i>`
                    : note.category === "Random Thought"
                    ? `<i class="fas fa-comment"></i>`
                    : note.category === "Idea"
                    ? `<i class="fas fa-lightbulb"></i>`
                    : `<i class="fas fa-quote-right"></i>`
                }</th>
                <th class="h5 note__title"><span>${note.title}</span></th>
                <th class="fw-light"><span>${note.creation}</span></th>
                <th class="fw-light">${note.category}</th>
                <th class="fw-light note__content"><span>${
                  note.content
                }</span></th>
                <th class="fw-light note__mentioned-dates"><span>${mentionedDates}</span></th>
                <th class="fs-5"><i class="fas fa-pen-square"></i></th>
                <th class="fs-5"><i class="fas fa-archive"></i></th>
                <th class="fs-5"><i class="fas fa-trash-alt"></i></th>
              </tr>`;
  });
  notesTableBody.innerHTML = displayedNotes.join("");
  updateNotesListeners();
}

function updateNotesListeners() {
  const notes = document.querySelectorAll(".note");
  notes.forEach((note) => {
    note.addEventListener("click", (e) => {
      renderNote(e.currentTarget.id, notesList);
    });
  });
  const btns = document.querySelectorAll(".note .fas");
  btns.forEach((btn) => {
    if (btn.classList.contains("fa-pen-square")) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderForm(e.currentTarget.parentNode.parentNode.id, notesList);
      });
    } else if (btn.classList.contains("fa-archive")) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (notesList[e.currentTarget.parentNode.parentNode.id]["status"] === "Archived") {
          unArchiveNote(e.currentTarget.parentNode.parentNode.id);
        } else {
          archiveNote(e.currentTarget.parentNode.parentNode.id);
        }
        renderNotes(notesList);
        renderStats(notesList);
        clearPlace();
      });
    } else if (btn.classList.contains("fa-trash-alt")) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteNote(e.currentTarget.parentNode.parentNode.id);
        renderNotes(notesList);
        renderStats(notesList);
        clearPlace();
      });
    }
  });
}

function renderNote(id, notesList) {
  place.innerHTML = `<div class="bg-light p-5 mt-5">
                      <h1>${notesList[id]["title"]}, <span class="h4">from <span class="text-info">${notesList[id]["category"]}</span> category</span></h1>
                      <h5 class="fw-light">${notesList[id]["creation"]}</h5>
                      <p class="fs-2">${notesList[id]["content"]}</p>
                    </div>`;
}

function renderForm(id, notesList) {
  let startContent;
  if (id === null) {
    startContent = { category: "", title: "", content: "" };
  } else {
    startContent = {
      category: notesList[id]["category"],
      title: notesList[id]["title"],
      content: notesList[id]["content"],
    };
  }
  place.innerHTML = `<form class="w-50 m-auto add-edit-form">
                      <div class="mb-3">
                        <label for="category" class="form-label">Category</label>
                        <select class="form-select" id="category">
                          ${
                            startContent.category == "Task"
                              ? `<option value="Task">Task</option>`
                              : startContent.category == "Random Thought"
                              ? `<option value="Random Thought">Random Thought</option>`
                              : startContent.category == "Idea"
                              ? `<option value="Idea">Idea</option>`
                              : startContent.category == "Idea"
                              ? `<option value="Quote">Quote</option>`
                              : `<option value="Task">Task</option>
                                <option value="Random Thought">Random Thought</option>
                                <option value="Idea">Idea</option>
                                <option value="Quote">Quote</option>`
                          }
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title" value="${
                          startContent.title
                        }">
                      </div>
                      <div class="mb-3">
                        <label for="content" class="form-label">Content</label>
                        <textarea class="form-control" id="content">${
                          startContent.content
                        }</textarea>
                      </div>
                      <button type="submit" class="btn btn-primary" id="submit-btn">Submit</button>
                    </form>`;
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const categoryOption = document.getElementById("category").value;
    const titleOption = document.getElementById("title").value;
    const contentOption = document.getElementById("content").value;
    if (id === null) {
      createNewNote(categoryOption, titleOption, contentOption);
    } else {
      updateNote(id, categoryOption, titleOption, contentOption);
    }
    renderNotes(notesList);
    renderStats(notesList);
    clearPlace();
  });
}

function renderArchive(notesList) {
  place.innerHTML = `<table class="table table-hover">
                      <thead class="table-dark">
                        <tr>
                          <th scope="col" class="icon"></th>
                          <th scope="col">Name</th>
                          <th scope="col">Created</th>
                          <th scope="col">Category</th>
                          <th scope="col">Content</th>
                          <th scope="col">Dates</th>
                          <th scope="col" class="icon"></th>
                          <th scope="col" class="fs-5 icon"><i class="fas fa-archive"></i></th>
                          <th scope="col" class="fs-5 icon"><i class="fas fa-trash-alt"></i></th>
                        </tr>
                      </thead>
                      <tbody id="archiveTableBody"></tbody>
                    </table>`;
  const archiveTableBody = document.getElementById("archiveTableBody");
  const displayedArchive = notesList.map((note) => {
    if (note.status === "Archived") {
      const mentionedDates =
        searchDates(note.id) === null ? "" : searchDates(note.id);
      return `<tr id="${note.id}" class="note">
                <th>${
                  note.category === "Task"
                    ? `<i class="fas fa-tasks"></i>`
                    : note.category === "Random Thought"
                    ? `<i class="fas fa-comment"></i>`
                    : note.category === "Idea"
                    ? `<i class="fas fa-lightbulb"></i>`
                    : `<i class="fas fa-quote-right"></i>`
                }</th>
                <th class="h5 note__title"><span>${note.title}</span></th>
                <th class="fw-light"><span>${note.creation}</span></th>
                <th class="fw-light">${note.category}</th>
                <th class="fw-light note__content"><span>${
                  note.content
                }</span></th>
                <th class="fw-light note__mentioned-dates"><span>${mentionedDates}</span></th>
                <th class="fs-5"><i class="fas fa-pen-square"></i></th>
                <th class="fs-5"><i class="fas fa-archive"></i></th>
                <th class="fs-5"><i class="fas fa-trash-alt"></i></th>
              </tr>`;
    }
  });
  archiveTableBody.innerHTML = displayedArchive.join("");

  updateNotesListeners();
}

function createNewNote(category, title, content) {
  const d = new Date();
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  notesList.push({
    id: notesList.length,
    status: "Active",
    category: category,
    title: title,
    creation: `${mo} ${da}, ${ye}`,
    content: content,
  });
}

function updateNote(id, category, title, content) {
  notesList[id] = {
    id: notesList[id]["id"],
    status: "Active",
    category: category,
    title: title,
    creation: notesList[id]["creation"],
    content: content,
  };
}

function deleteNote(id) {
  notesList.splice(id, 1);
  notesList = notesList.map((note, index) => {
    note["id"] = index;
    return note;
  });
}

function archiveNote(id) {
  notesList[id]["status"] = "Archived";
}

function unArchiveNote(id) {
  notesList[id]["status"] = "Active";
}

function searchDates(id) {
  const str = notesList[id]["content"];
  const result = str.match(
    /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/g
  );
  if (result === null) {
    return result;
  } else {
    return result.join(", ");
  }
}

function chekForEmptiness(displayedNotes) {
  if (displayedNotes.length === 0) {
    alert("Your notes list is empty!");
  }
}

function clearPlace() {
  place.innerHTML = "";
}
