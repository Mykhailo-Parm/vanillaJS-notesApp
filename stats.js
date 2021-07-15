import { data } from "./data.js";
let notesList = data;

const statsTableBody = document.getElementById("statsTableBody");

function renderStats(notesList) {
  const notesCategories = notesList.reduce((values, note) => {
    if (!values.includes(note.category)) {
      values.push(note.category);
    }
    return values;
  }, []);

  const stats = {
    Task: {
      Active: 0,
      Archived: 0,
    },
    "Random Thought": {
      Active: 0,
      Archived: 0,
    },
    Idea: {
      Active: 0,
      Archived: 0,
    },
    Quote: {
      Active: 0,
      Archived: 0,
    },
  };

  notesList.forEach((note) => {
    stats[note.category][note.status]++;
  });

  const displayedStats = notesCategories
    .map((category) => {
      return `<tr>
                <th>${
                  category === "Task"
                    ? `<i class="fas fa-tasks"></i>`
                    : category === "Random Thought"
                    ? `<i class="fas fa-comment"></i>`
                    : category === "Idea"
                    ? `<i class="fas fa-lightbulb"></i>`
                    : `<i class="fas fa-quote-right"></i>`
                }</th>
                <th>${category}</th>
                <th class="fw-light">${stats[category]["Active"]}</th>
                <th class="fw-light">${stats[category]["Archived"]}</th>
              </tr>`;
    })
    .join("");

  statsTableBody.innerHTML = displayedStats;
}

document.addEventListener("DOMContentLoaded", () => {
  renderStats(notesList);
});

export { renderStats };
