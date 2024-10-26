// Storage keys
const STORAGE_KEYS = {
  TASKS: 'tasks'
};

// Storage service
class StorageService {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  save(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

// Task storage instance
export const taskStorage = new StorageService(STORAGE_KEYS.TASKS);

// Export storage keys for reuse
export { STORAGE_KEYS };