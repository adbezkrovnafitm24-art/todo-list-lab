const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const emptyMessage = document.getElementById('empty-message');
const STORAGE_KEY = 'todo-lab-items';

// Кожна справа: { id: число, text: рядок, completed: логічне значення }.
let todos = [];
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(saved)) {
    todos = saved.filter(todo => todo && Number.isSafeInteger(todo.id) &&
      typeof todo.text === 'string' && typeof todo.completed === 'boolean');
  }
} catch (error) {
  console.warn('Не вдалося прочитати збережені справи:', error);
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.warn('Не вдалося зберегти справи:', error);
  }
}

function newTodo() {
  const input = prompt('Введіть назву нової справи:');
  if (input === null) return;
  const text = input.trim();
  if (!text) {
    alert('Назва справи не може бути порожньою.');
    return;
  }
  const id = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
  todos.push({ id, text, completed: false });
  saveTodos();
  render(todos);
  updateCounter();
}

// Екрануємо введений користувачем текст перед додаванням до HTML.
function escapeHTML(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function renderTodo(todo) {
  return `
    <li class="list-group-item d-flex align-items-center gap-2">
      <input class="form-check-input mt-0" type="checkbox" id="todo-${todo.id}"
        ${todo.completed ? 'checked' : ''} onchange="checkTodo(${todo.id})">
      <label class="flex-grow-1 todo-text" for="todo-${todo.id}">
        <span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">${escapeHTML(todo.text)}</span>
      </label>
      <button class="btn btn-outline-danger btn-sm" type="button"
        onclick="deleteTodo(${todo.id})" aria-label="Видалити справу">Видалити</button>
    </li>`;
}

function render(todos) {
  const markup = todos.map(renderTodo).join('');
  list.innerHTML = markup;
  emptyMessage.hidden = todos.length > 0;
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.completed).length;
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render(todos);
  updateCounter();
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  render(todos);
  updateCounter();
}

render(todos);
updateCounter();
