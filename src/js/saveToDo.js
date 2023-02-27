export default class SaveToDo {
  static setTaskToLocalStorage(task, status = false) {
    const tasksString = localStorage.getItem("task");
    const tasks = tasksString ? JSON.parse(tasksString) : [];
    tasks.push({ task: task, status: status });
    localStorage.setItem("task", JSON.stringify(tasks));
  }

  static getTasksFromLocalStorage() {
    const tasksString = localStorage.getItem("task");
    const tasks = tasksString ? JSON.parse(tasksString) : [];
    return tasks;
  }

  static setTasksToLocalStorage(tasks) {
    localStorage.setItem("task", JSON.stringify(tasks));
  }
}
