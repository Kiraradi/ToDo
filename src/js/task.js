export default class Task {
  constructor(container) {
    this.tasksInput = container.querySelector("#task__input");
    this.tasksAdd = Array.from(container.querySelectorAll(".tasks__add"));
    this.tasksList = container.querySelector("#tasks__list");
    this.loadPage();
    this.createTasks();
  }

  loadPage() {
    const tasks = this.getTasksFromLocalStorage();
    if (tasks.length > 0) {
      tasks.forEach((task) => {
        this.createHtmlElement(task, true);
      });
    }
  }

  createTasks() {
    this.tasksAdd.forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        if (this.tasksInput.value) {
          this.createHtmlElement(this.tasksInput.value, false);
        }
      });
    });
  }

  createHtmlElement(task, isPageLoaded) {
    const toDoTask = document.createElement("div");
    toDoTask.classList.add("task");

    const toDoTitle = document.createElement("div");
    toDoTitle.classList.add("task__title");
    toDoTitle.textContent = task;
    toDoTask.appendChild(toDoTitle);

    const taskChangeInput = document.createElement("form");
    taskChangeInput.classList.add('task__change');
    const taskInputChange = document.createElement("input");
    taskInputChange.setAttribute('type','text');
    taskInputChange.classList.add('task__input__change');
    taskChangeInput.appendChild(taskInputChange);
    const taskInputButton = document.createElement('button');
    taskInputButton.setAttribute('type','submit');
    taskInputButton.classList.add('task__input__button');
    taskChangeInput.appendChild(taskInputButton);
    toDoTask.appendChild(taskChangeInput);

    const taskChange = document.createElement("div");
    taskChange.classList.add("change");
    toDoTask.appendChild(taskChange);
    
    const taskCheck = document.createElement("div");
    taskCheck.classList.add("checkbox");
    toDoTask.appendChild(taskCheck);

    const taskRemove = document.createElement("a");
    taskRemove.setAttribute("href", "#");
    taskRemove.classList.add("task__remove");
    toDoTask.appendChild(taskRemove);

    this.tasksList.appendChild(toDoTask);
    this.tasksInput.value = "";

    taskInputButton.addEventListener('click', () => {
      //metod
      console.log(taskInputChange)
      console.log(taskInputChange.value);
      this.clickButton(taskChangeInput, toDoTitle, taskInputChange.value)
    })

    taskChange.addEventListener("click", () => {
      this.changeTask(taskChangeInput, toDoTitle);
    });

    taskCheck.addEventListener("click", () => {
      this.checkTask(taskCheck,toDoTask,task);
    });

    taskRemove.addEventListener("click", () => {
      this.removeTask(toDoTask, task);
    });

    if (!isPageLoaded) {
      this.setTaskToLocalStorage(task);
    }
  }

  clickButton(taskChangeInput, toDoTitle, value) {
    console.log(value)
    toDoTitle.style.display = 'block';
    toDoTitle.textContent = value;
    taskChangeInput.classList.remove('task__change__active');
  }
  changeTask(taskChangeInput, toDoTitle) {
    toDoTitle.style.display = 'none';
    taskChangeInput.classList.add('task__change__active');
  }

  checkTask(taskCheck,toDoTask,task) {
    if (taskCheck.classList.contains("checkbox__active")) {
      taskCheck.classList.remove("checkbox__active");
      this.removeTask(toDoTask, task);
      this.tasksList.prepend(toDoTask);
    } else {
      taskCheck.classList.add("checkbox__active");
      this.removeTask(toDoTask, task);
      this.tasksList.append(toDoTask);
    }
    this.setTaskToLocalStorage(task);
  }

  removeTask(taskHtml, task) {
    taskHtml.remove();
    const tasks = this.getTasksFromLocalStorage();
    const index = tasks.findIndex((el) => el === task);
    if (index >= 0) {
      tasks.splice(index, 1);
      this.setTasksToLocalStorage(tasks);
    }
  }

  setTaskToLocalStorage(task) {
    const tasksString = localStorage.getItem("task");
    const tasks = tasksString ? JSON.parse(tasksString) : [];
    tasks.push(task);
    localStorage.setItem("task", JSON.stringify(tasks));
  }

  getTasksFromLocalStorage() {
    const tasksString = localStorage.getItem("task");
    const tasks = tasksString ? JSON.parse(tasksString) : [];
    return tasks;
  }

  setTasksToLocalStorage(tasks) {
    localStorage.setItem("task", JSON.stringify(tasks));
  }
}
