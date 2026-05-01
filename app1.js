const input = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('todoList');
const footer = document.getElementById('todoFooter');
const countEl = document.getElementById('todoCount');
const clearBtn = document.getElementById('clearBtn');
const emptyState = document.getElementById('emptyState');

let tasks = JSON.parse(localStorage.getItem('ali_tasks') || '[]');

function save() {
  localStorage.setItem('ali_tasks', JSON.stringify(tasks));
}

function updateFooter() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  if (total === 0) {
    footer.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    footer.style.display = 'flex';
    emptyState.style.display = 'none';
    countEl.textContent = done + ' of ' + total + ' completed';
  }
}

function renderItem(task, index) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (task.done ? ' todo-item--done' : '');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.className = 'todo-checkbox';
  checkbox.addEventListener('change', () => {
    tasks[index].done = checkbox.checked;
    save();
    render();
  });

  const label = document.createElement('span');
  label.className = 'todo-label';
  label.textContent = task.text;

  const del = document.createElement('button');
  del.className = 'todo-delete';
  del.innerHTML = '&times;';
  del.title = 'Delete task';
  del.addEventListener('click', () => {
    tasks.splice(index, 1);
    save();
    render();
  });

  li.appendChild(checkbox);
  li.appendChild(label);
  li.appendChild(del);
  return li;
}

function render() {
  list.innerHTML = '';
  tasks.forEach((task, i) => list.appendChild(renderItem(task, i)));
  updateFooter();
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  input.value = '';
  save();
  render();
  input.focus();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  save();
  render();
});

render();
