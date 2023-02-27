import SaveToDo from "./saveToDo";
import Sortable from "sortablejs";

export default class Task {
  constructor(container) {
    this.tasksInput = container.querySelector("#task__input");
    this.tasksAdd = Array.from(container.querySelectorAll(".tasks__add"));
    this.tasksList = container.querySelector("#tasks__list");
    this.loadPage();
    this.createTasks();
    this.dregAndDrop();
  }

  loadPage() {
    const tasks = SaveToDo.getTasksFromLocalStorage();
    if (tasks.length > 0) {
      tasks.forEach((saveTask) => {
        this.createHtmlElement(saveTask.task, saveTask.status, true);
      });
    }
  }

  createTasks() {
    this.tasksAdd.forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (this.tasksInput.value) {
          this.createHtmlElement(this.tasksInput.value, false, false);
        }
      });
    });
  }

  createHtmlElement(task, status, isPageLoaded) {
    const toDoTask = document.createElement("div");
    toDoTask.setAttribute('draggable','true')
    toDoTask.classList.add("task");

    const toDoTitle = document.createElement("div");
    toDoTitle.classList.add("task__title");
    toDoTitle.textContent = task;
    toDoTask.appendChild(toDoTitle);

    const taskChangeInput = document.createElement("form");
    taskChangeInput.classList.add("task__change");
    const taskInputChange = document.createElement("input");
    taskInputChange.setAttribute("type", "text");
    taskInputChange.classList.add("task__input__change");
    taskChangeInput.appendChild(taskInputChange);
    const taskInputButton = document.createElement("button");
    taskInputButton.setAttribute("type", "submit");
    taskInputButton.classList.add("task__input__button");
    taskChangeInput.appendChild(taskInputButton);
    toDoTask.appendChild(taskChangeInput);

    const taskChange = document.createElement("div");
    taskChange.classList.add("change");
    toDoTask.appendChild(taskChange);

    const taskCheck = document.createElement("div");
    taskCheck.classList.add("checkbox");
    if (status) {
      taskCheck.classList.add("checkbox__active");
    }
    toDoTask.appendChild(taskCheck);

    const taskRemove = document.createElement("a");
    taskRemove.setAttribute("href", "#");
    taskRemove.classList.add("task__remove");
    toDoTask.appendChild(taskRemove);

    this.tasksList.appendChild(toDoTask);
    this.tasksInput.value = "";

    taskInputButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.clickButton(taskChangeInput, toDoTitle, taskInputChange.value);
      taskInputChange.value = "";
    });

    taskChange.addEventListener("click", () => {
      this.changeTask(taskChangeInput, toDoTitle);
    });

    taskCheck.addEventListener("click", () => {
      this.checkTask(taskCheck, toDoTask);
    });

    taskRemove.addEventListener("click", () => {
      this.removeTask(toDoTask, task);
    });

    if (!isPageLoaded) {
      SaveToDo.setTaskToLocalStorage(task, false);
    }
  }

  clickButton(taskChangeInput, toDoTitle, value) {
    const tasks = SaveToDo.getTasksFromLocalStorage();
    const index = tasks.findIndex((saveTask) => saveTask.task === toDoTitle.textContent);
    tasks[index].task = value;
    SaveToDo.setTasksToLocalStorage(tasks);
    toDoTitle.style.display = "block";
    toDoTitle.textContent = value;
    taskChangeInput.classList.remove("task__change__active");
  }

  changeTask(taskChangeInput, toDoTitle) {
    if (taskChangeInput.classList.contains("task__change__active")) {
      toDoTitle.style.display = "block";
      taskChangeInput.classList.remove("task__change__active");
    } else {
      toDoTitle.style.display = "none";
      taskChangeInput.classList.add("task__change__active");
    }
  }

  checkTask(taskCheck, toDoTask) {
    const value = toDoTask.querySelector(".task__title").textContent;
    if (taskCheck.classList.contains("checkbox__active")) {
      taskCheck.classList.remove("checkbox__active");
      this.removeTask(toDoTask, value);
      this.tasksList.prepend(toDoTask);
      SaveToDo.setTaskToLocalStorage(value, false);
    } else {
      taskCheck.classList.add("checkbox__active");
      this.removeTask(toDoTask, value);
      this.tasksList.append(toDoTask);
      SaveToDo.setTaskToLocalStorage(value,true);
    }
    
  }

  removeTask(taskHtml, task) {
    taskHtml.remove();
    const tasks = SaveToDo.getTasksFromLocalStorage();
    const index = tasks.findIndex((saveTask) => saveTask.task === task);
    if (index >= 0) {
      tasks.splice(index, 1);
      SaveToDo.setTasksToLocalStorage(tasks);
    }
  }

  dregAndDrop() {
    new Sortable(this.tasksList, {
      animation: 300
    } ) 
  }
}
