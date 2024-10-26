import { taskStorage } from './storage.js';

class TaskService {
  constructor() {
    this.tasks = taskStorage.getAll();
  }

  getAllTasks() {
    return this.tasks;
  }

  createTask(title, dueDate, priority) {
    const task = {
      id: Date.now(),
      title,
      dueDate,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  updateTask(id, updates) {
    this.tasks = this.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    this.saveTasks();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }

  saveTasks() {
    taskStorage.save(this.tasks);
  }
}

export const taskService = new TaskService();