const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const taskCounter = document.getElementById("taskCounter");
const completeCounter = document.getElementById("completecounter");
const resetButton = document.getElementById("reset");
const prioritySelect = document.getElementById("priority");
const progressBar = document.getElementById("progress");

function updateTaskCounter() {
  const count = pendingTasks.querySelectorAll("li").length;
  taskCounter.textContent = `${count} pending task${count === 1 ? "" : "s"}`;
  const complete = completedTasks.querySelectorAll("li").length;
  completeCounter.textContent = `${complete} completed task${complete === 1 ? "" : "s"}`;
  updateProgressBar();
}

function addTask() {
  const task = taskInput.value.trim();
  if (!task) { taskInput.focus(); return; }

  const listItem = document.createElement("li");
  const checkbox = document.createElement("input");
  const taskText = document.createElement("span");
  const deleteButton = document.createElement("button");
  const priority = prioritySelect.value;

  checkbox.type = "checkbox";
  taskText.className = "task-text";
  taskText.textContent = task;
  const priorityTag = document.createElement("span");
  priorityTag.className = `priority ${priority}`;
  priorityTag.textContent = priority;
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";

  checkbox.addEventListener("change", () => {
    listItem.classList.toggle("completed", checkbox.checked);
    (checkbox.checked ? completedTasks : pendingTasks).appendChild(listItem);
    updateTaskCounter();
    saveTasks();
  });
  deleteButton.addEventListener("click", () => { listItem.remove(); updateTaskCounter(); });
  listItem.append(checkbox, taskText, priorityTag, deleteButton);
  pendingTasks.appendChild(listItem);
  taskInput.value = "";
  taskInput.focus();
  updateTaskCounter();
  saveTasks();
  listItem.append(checkbox, taskText, priorityTag, deleteButton);
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => { if (event.key === "Enter") addTask(); });
resetButton.addEventListener("click", () => {
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";
  updateTaskCounter();
  saveTasks();
});

function saveTasks() {
  const tasks = [];
  pendingTasks.querySelectorAll("li").forEach((task) => {
    tasks.push({ text: task.querySelector(".task-text").textContent, priority: task.querySelector(".priority").textContent, completed: false });
  });
  completedTasks.querySelectorAll("li").forEach((task) => {
    tasks.push({ text: task.querySelector(".task-text").textContent, priority: task.querySelector(".priority").textContent, completed: true });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const taskText = document.createElement("span");
    const deleteButton = document.createElement("button");
    const priorityTag = document.createElement("span");

    priorityTag.className = `priority ${task.priority}`;
    priorityTag.textContent = task.priority;
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    listItem.classList.toggle("completed", task.completed);
    taskText.className = "task-text";
    taskText.textContent = task.text;
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    checkbox.addEventListener("change", () => {
      listItem.classList.toggle("completed", checkbox.checked);
      (checkbox.checked ? completedTasks : pendingTasks).appendChild(listItem);
      updateTaskCounter();
      saveTasks();
    });

    deleteButton.addEventListener("click", () => { listItem.remove(); updateTaskCounter(); saveTasks(); });
    listItem.append(checkbox, taskText, priorityTag, deleteButton);
    (task.completed ? completedTasks : pendingTasks).appendChild(listItem);
  });

  updateTaskCounter(); 
  saveTasks();
}

window.addEventListener("beforeunload", saveTasks);
window.addEventListener("load", loadTasks);   

function updateDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  document.getElementById("date").textContent = date;
  document.getElementById("time").textContent = time;
}

setInterval(updateDateTime, 1000);
updateDateTime();
resetButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all tasks?")) {
    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";
    updateTaskCounter();
    saveTasks();
  }
});
function updateProgressBar() {
  const pending=pendingTasks.querySelectorAll("li").length;
  const completed=completedTasks.querySelectorAll("li").length;
  const total=pending+completed;
  const percentage=total>0?(completed/total)*100:0;
  progressBar.style.width=percentage+"%";
  progressBar.textContent=Math.floor(percentage)+"%";
}

function startProgressBar() {
  updateProgressBar();
}
