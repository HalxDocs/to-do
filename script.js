document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const tasksLeftSpan = document.getElementById('tasks-left');
    const completedCountSpan = document.getElementById('completed-count');

    // State
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    // Initialize the app
    function init() {
        renderTodos();
        updateStats();
        addBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTodo();
        });
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTodos();
            });
        });
        
        clearCompletedBtn.addEventListener('click', clearCompleted);
    }

    // Add a new todo
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            updateStats();
            todoInput.value = '';
            todoInput.focus();
        }
    }

    // Render todos based on current filter
    function renderTodos() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });
        
        if (filteredTodos.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet. Add one above!' :
                                      currentFilter === 'active' ? 'No active tasks!' :
                                      'No completed tasks!';
            emptyMessage.classList.add('empty-message');
            todoList.appendChild(emptyMessage);
        } else {
            filteredTodos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.className = 'todo-item';
                if (todo.completed) todoItem.classList.add('completed');
                
                todoItem.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <button class="delete-btn" data-id="${todo.id}"><i class="fas fa-trash"></i></button>
                `;
                
                todoList.appendChild(todoItem);
            });
        }
        
        // Add event listeners to checkboxes and delete buttons
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTodo);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTodo);
        });
    }

    // Toggle todo completion status
    function toggleTodo(e) {
        const id = parseInt(e.target.dataset.id);
        todos = todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        saveTodos();
        renderTodos();
        updateStats();
    }

    // Delete a todo
    function deleteTodo(e) {
        const id = parseInt(e.target.dataset.id || e.target.parentElement.dataset.id);
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateStats();
    }

    // Clear all completed todos
    function clearCompleted() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateStats();
    }

    // Update the stats (tasks left and completed count)
    function updateStats() {
        const activeCount = todos.filter(todo => !todo.completed).length;
        const completedCount = todos.length - activeCount;
        
        tasksLeftSpan.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;
        completedCountSpan.textContent = `${completedCount} completed`;
    }

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Initialize the app
    init();
});