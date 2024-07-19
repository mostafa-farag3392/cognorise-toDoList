// script.js
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const searchInput = document.getElementById('searchInput');
    const filterInput = document.getElementById('filterInput');
    const taskList = document.getElementById('taskList');
    const completedTaskList = document.getElementById('completedTaskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;

        if (taskText) {
            const task = {
                text: taskText,
                priority,
                dueDate,
                completed: false,
                id: Date.now(),
            };
            tasks.push(task);
            saveTasks();
            renderTasks();
            taskForm.reset();
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const taskId = e.target.parentElement.dataset.id;
            const task = tasks.find(task => task.id == taskId);
            task.completed = true;
            completedTasks.push(task);
            tasks = tasks.filter(task => task.id != taskId);
            saveTasks();
            renderTasks();
        }
    });

    completedTaskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const taskId = e.target.parentElement.dataset.id;
            completedTasks = completedTasks.filter(task => task.id != taskId);
            saveTasks();
            renderTasks();
        }
    });

    searchInput.addEventListener('input', renderTasks);
    filterInput.addEventListener('change', renderTasks);

    function renderTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const filter = filterInput.value;

        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            return (
                task.text.toLowerCase().includes(searchTerm) &&
                (filter === 'All' || task.priority === filter)
            );
        });

        const filteredCompletedTasks = completedTasks.filter(task => {
            return task.text.toLowerCase().includes(searchTerm);
        });

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = 'list-group-item d-flex justify-content-between align-items-center';
            taskElement.dataset.id = task.id;
            taskElement.innerHTML = `
                <span>${task.text} (${task.priority}) - ${task.dueDate}</span>
                <button class="btn btn-success btn-sm">Complete</button>
            `;
            taskList.appendChild(taskElement);
        });

        filteredCompletedTasks.forEach(task => {
            const taskElement = document.createElement('li');
            taskElement.className = 'list-group-item d-flex justify-content-between align-items-center completed';
            taskElement.dataset.id = task.id;
            taskElement.innerHTML = `
                <span>${task.text} (${task.priority}) - ${task.dueDate}</span>
                <button class="btn btn-danger btn-sm">Remove</button>
            `;
            completedTaskList.appendChild(taskElement);
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    renderTasks();
});


