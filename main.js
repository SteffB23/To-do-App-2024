import { taskService } from './src/services/taskService.js';

// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

// Event Listeners
addTaskBtn.addEventListener('click', openModal);
taskForm.addEventListener('submit', handleTaskSubmit);
searchInput.addEventListener('input', filterTasks);
filterCategory.addEventListener('change', filterTasks);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});

// UI Functions
function openModal(task = null) {
  const modalTitle = document.getElementById('modalTitle');
  const titleInput = document.getElementById('taskTitle');
  const dueDateInput = document.getElementById('taskDueDate');
  const priorityInput = document.getElementById('taskPriority');

  if (task) {
    modalTitle.textContent = 'Edit Task';
    titleInput.value = task.title;
    dueDateInput.value = task.dueDate;
    priorityInput.value = task.priority;
    taskForm.dataset.editId = task.id;
  } else {
    modalTitle.textContent = 'Add Task';
    taskForm.reset();
    delete taskForm.dataset.editId;
  }

  taskModal.classList.remove('hidden');
}

function closeModal() {
  taskModal.classList.add('hidden');
  taskForm.reset();
}

function handleTaskSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('taskTitle').value;
  const dueDate = document.getElementById('taskDueDate').value;
  const priority = document.getElementById('taskPriority').value;

  if (taskForm.dataset.editId) {
    taskService.updateTask(Number(taskForm.dataset.editId), { title, dueDate, priority });
  } else {
    taskService.createTask(title, dueDate, priority);
  }

  closeModal();
  renderTasks();
}

function renderTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sections = {
    today: document.querySelector('#todayTasks .task-list'),
    upcoming: document.querySelector('#upcomingTasks .task-list'),
    completed: document.querySelector('#completedTasks .task-list')
  };

  // Clear all sections
  Object.values(sections).forEach(section => {
    section.innerHTML = '';
  });

  // Filter and sort tasks
  const filteredTasks = filterTasks();

  filteredTasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const taskElement = createTaskElement(task);

    if (task.completed) {
      sections.completed.appendChild(taskElement);
    } else if (taskDate.getTime() === today.getTime()) {
      sections.today.appendChild(taskElement);
    } else if (taskDate > today) {
      sections.upcoming.appendChild(taskElement);
    }
  });
}

function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = 'task-item';
  
  const checkbox = document.createElement('div');
  checkbox.className = `checkbox ${task.completed ? 'checked' : ''}`;
  checkbox.addEventListener('click', () => {
    taskService.toggleTask(task.id);
    renderTasks();
  });

  const content = document.createElement('div');
  content.className = 'flex-1';
  
  const title = document.createElement('h3');
  title.className = `font-medium ${task.completed ? 'line-through text-gray-400' : ''}`;
  title.textContent = task.title;

  const dueDate = document.createElement('p');
  dueDate.className = 'text-sm text-gray-500';
  dueDate.textContent = new Date(task.dueDate).toLocaleString();

  const priority = document.createElement('div');
  priority.className = `priority-indicator priority-${task.priority}`;

  const actions = document.createElement('div');
  actions.className = 'flex gap-2';

  const editBtn = document.createElement('button');
  editBtn.className = 'p-2 hover:bg-gray-100 rounded-lg transition-colors';
  editBtn.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  `;
  editBtn.addEventListener('click', () => openModal(task));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-500';
  deleteBtn.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  `;
  deleteBtn.addEventListener('click', () => {
    taskService.deleteTask(task.id);
    renderTasks();
  });

  content.appendChild(title);
  content.appendChild(dueDate);
  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  div.appendChild(checkbox);
  div.appendChild(content);
  div.appendChild(priority);
  div.appendChild(actions);

  return div;
}

function filterTasks() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  const tasks = taskService.getAllTasks();

  return tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);
    const matchesCategory = category === 'all' || 
      (category === 'completed' && task.completed) ||
      (category === 'today' && isToday(new Date(task.dueDate))) ||
      (category === 'upcoming' && isFuture(new Date(task.dueDate))) ||
      (category === 'history' && isPast(new Date(task.dueDate)));

    return matchesSearch && matchesCategory;
  });
}

// Utility Functions
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

function isFuture(date) {
  return date > new Date();
}

function isPast(date) {
  return date < new Date();
}

// Close modal when clicking outside
taskModal.addEventListener('click', (e) => {
  if (e.target === taskModal) {
    closeModal();
  }
});