import Task from "./task";
import LocalStorageService from "./localStorageService";
import Sortable from "sortablejs";

export default class TasksController {
  constructor(container) {
    this.newTaskInputEl = container.querySelector("#task__input");
    this.tasksAdd = Array.from(container.querySelectorAll(".tasks__add"));
    this.tasksList = container.querySelector("#tasks__list");
    this.loadPage();
    this.addCreateTaskEventListener();
    this.startDragAndDrop();
  }

  loadPage() {
    while (this.tasksList.firstChild) {
      this.tasksList.removeChild(this.tasksList.firstChild);
    }

    const tasks = LocalStorageService.getTasks();
    if (tasks.length > 0) {
      tasks.forEach((saveTask) => {
        this.createHtmlElement(saveTask, true);
      });
    }
  }

  addCreateTaskEventListener() {
    this.tasksAdd.forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (this.newTaskInputEl.value) {
          const task = new Task(this.newTaskInputEl.value);
          this.newTaskInputEl.value = "";
          this.createHtmlElement(task, false);
        }
      });
    });
  }

  createHtmlElement(task, isPageLoaded) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.setAttribute("data-id", task.id);

    const taskNameElement = document.createElement("div");
    taskNameElement.classList.add("task__title");
    taskNameElement.textContent = task.name;
    taskElement.appendChild(taskNameElement);

    this.createTaskChangeForm(taskElement);
    this.createTaskUpdatingToggle(taskElement);
    this.createTaskStatusCheckbox(taskElement, task);
    this.createTaskRemoveButton(taskElement);
    this.tasksList.appendChild(taskElement);

    if (!isPageLoaded) {
      LocalStorageService.pushTask(task);
    }
  }

  createTaskChangeForm(taskElement) {
    const taskChangeForm = document.createElement("form");
    taskChangeForm.classList.add("task__change");

    const taskChangeInput = document.createElement("input");
    taskChangeInput.setAttribute("type", "text");
    taskChangeInput.classList.add("task__input__change");
    taskChangeForm.appendChild(taskChangeInput);

    const taskChangeButton = document.createElement("button");
    taskChangeButton.setAttribute("type", "submit");
    taskChangeButton.classList.add("task__input__button");
    taskChangeButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.updateTask(taskElement);
      taskChangeInput.value = "";
    });
    taskChangeForm.appendChild(taskChangeButton);

    taskElement.appendChild(taskChangeForm);
  }

  createTaskUpdatingToggle(taskElement) {
    const taskUpdatingToggle = document.createElement("div");
    taskUpdatingToggle.classList.add("change");
    taskUpdatingToggle.addEventListener("click", () => {
      this.toggleTaskUpdating(taskElement);
    });

    taskElement.appendChild(taskUpdatingToggle);
  }

  createTaskStatusCheckbox(taskElement, task) {
    const taskStatusCheckbox = document.createElement("div");
    taskStatusCheckbox.classList.add("checkbox");
    if (task.status) {
      taskStatusCheckbox.classList.add("checkbox__active");
    }

    taskStatusCheckbox.addEventListener("click", () => {
      this.toggleTaskStatus(taskElement);
    });

    taskElement.appendChild(taskStatusCheckbox);
  }

  createTaskRemoveButton(taskElement) {
    const taskRemoveButton = document.createElement("a");
    taskRemoveButton.setAttribute("href", "#");
    taskRemoveButton.classList.add("task__remove");
    taskRemoveButton.addEventListener("click", () => {
      this.removeTask(taskElement);
    });
    taskElement.appendChild(taskRemoveButton);
  }

  updateTask(taskElement) {
    const tasks = LocalStorageService.getTasks();
    const id = taskElement.getAttribute("data-id");
    const task = tasks.find((t) => t.id === id);
    const taskChangeInput = taskElement.querySelector(".task__input__change");
    if (task && taskChangeInput && taskChangeInput.value) {
      task.name = taskChangeInput.value;
      LocalStorageService.setTasks(tasks);
      this.loadPage();
    }
  }

  toggleTaskUpdating(taskElement) {
    const taskNameElement = taskElement.querySelector(".task__title");
    const taskChangeForm = taskElement.querySelector(".task__change");

    const isTaskUpdatingToggle = taskChangeForm.classList.contains(
      "task__change__active"
    );
    taskNameElement.style.display = isTaskUpdatingToggle ? "block" : "none";

    if (isTaskUpdatingToggle) {
      taskChangeForm.classList.remove("task__change__active");
    } else {
      taskChangeForm.classList.add("task__change__active");
    }
  }

  toggleTaskStatus(taskElement) {
    const tasks = LocalStorageService.getTasks();
    const id = taskElement.getAttribute("data-id");
    const task = tasks.find((t) => t.id === id);

    if (task) {
      const taskIndex = tasks.findIndex((t) => t.id === id);
      task.status = !task.status;

      const newTask = JSON.parse(JSON.stringify(task));
      tasks.splice(taskIndex, 1);

      if (task.status) {
        tasks.push(newTask);
      } else {
        tasks.unshift(newTask);
      }

      LocalStorageService.setTasks(tasks);
      this.loadPage();
    }
  }

  removeTask(taskElement) {
    const id = taskElement.getAttribute("data-id");
    const tasks = LocalStorageService.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index >= 0) {
      tasks.splice(index, 1);
      LocalStorageService.setTasks(tasks);
      this.loadPage();
    }
  }

  startDragAndDrop() {
    new Sortable(this.tasksList, {
      animation: 300,
    });
  }
}
