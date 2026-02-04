// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');

// Load todos from localStorage or initialize empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update task count display
function updateTaskCount() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    taskCount.textContent = `${pending} pending, ${completed} completed`;
}

// Create todo item element
function createTodoElement(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <button class="delete-btn" title="Delete">×</button>
    `;
    
    // Toggle completion
    const checkbox = li.querySelector('.todo-checkbox');
    checkbox.addEventListener('change', () => {
        todos[index].completed = checkbox.checked;
        li.classList.toggle('completed', checkbox.checked);
        saveTodos();
        updateTaskCount();
    });
    
    // Delete todo
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        li.style.transform = 'translateX(100%)';
        li.style.opacity = '0';
        setTimeout(() => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }, 200);
    });
    
    return li;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Render all todos
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        todoList.appendChild(createTodoElement(todo, index));
    });
    updateTaskCount();
}

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    todos.push({
        text: text,
        completed: false,
        createdAt: Date.now()
    });
    
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

// Clear completed todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

// Event listeners
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

// Initial render
renderTodos();
