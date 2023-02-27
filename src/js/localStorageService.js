const tasksLocalStorageItem = "tasks";

export default class LocalStorageService {
  static pushTask(task) {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem(tasksLocalStorageItem, JSON.stringify(tasks));
  }

  static getTasks() {
    const tasksString = localStorage.getItem(tasksLocalStorageItem);
    const tasks = tasksString ? JSON.parse(tasksString) : [];
    return tasks;
  }

  static setTasks(tasks) {
    localStorage.setItem(tasksLocalStorageItem, JSON.stringify(tasks));
  }
}
