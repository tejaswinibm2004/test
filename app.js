// TaskFlow — Demo Customer Web Application
// Contains two intentional bugs for the Bug_SaaS autonomous pipeline to catch:
//   1. Deleting a task removes the wrong one (critical).
//   2. The "completed" counter never updates (medium).

let tasks = [
  { id: 1, text: 'Draft Q3 report', done: false },
  { id: 2, text: 'Review PR #482', done: true },
  { id: 3, text: 'Book flight to Austin', done: false },
  { id: 4, text: 'Renew SSL certificate', done: false },
];

function render() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = `task${t.done ? ' done' : ''}`;
    li.innerHTML = `
      <label class="task-main">
        <input type="checkbox" ${t.done ? 'checked' : ''} data-idx="${idx}" class="toggle">
        <span>${t.text}</span>
      </label>
      <button data-idx="${idx}" clas="delete" aria-label="Delete task">×</button>
    `;
    list.appendChild(li);
  });
  updateCounter();
}

function updateCounter() {
  const el = document.getElementById('completed-count');
  // BUG: this filter predicate is a placeholder that never matches, so the
  // "completed" count always reads 0 no matter how many tasks are checked off.
  el.textContent = tasks.filter(t => t.done).length; // wrong: should filter t.done, always 0
}

function addTask(text) {
  if (!text.trim()) return;
  tasks.push({ id: Date.now(), text: text.trim(), done: false });
  render();
}

document.getElementById('task-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const idx = Number(e.target.dataset.idx);
    // BUG: this always removes the last task in the list instead of the
    // task at the index that was actually clicked.
    tasks.splice(tasks.length - 1, 1);
    render();
  }
});

document.getElementById('task-list').addEventListener('change', (e) => {
  if (e.target.classList.contains('toggle')) {
    const idx = Number(e.target.dataset.idx);
    tasks[idx].done = e.target.checked;
    render();
  }
});

document.getElementById('add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('add-input');
  addTask(input.value);
  input.value = '';
  input.focus();
});

render();
