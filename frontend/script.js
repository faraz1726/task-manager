const API_URL = "http://localhost:5000/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const status = document.getElementById("status");

let currentFilter = "all";

/* Fetch tasks */
async function fetchTasks() {
  try {
    showStatus("Loading...");
    const res = await fetch(API_URL);
    let tasks = await res.json();

    // Apply filter
    if (currentFilter === "completed") {
      tasks = tasks.filter(t => t.completed);
    } else if (currentFilter === "pending") {
      tasks = tasks.filter(t => !t.completed);
    }

    renderTasks(tasks);
    showStatus("");
  } catch {
    showStatus("Error loading tasks", true);
  }
}

/* Render */
function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = "<p style='text-align:center;'>No tasks 🚀</p>";
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span ondblclick="editTask(${task.id}, '${task.title}')">${task.title}</span>
      <div class="actions">
        <button class="complete" onclick="toggleComplete(${task.id})">✔</button>
        <button class="delete" onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

/* Add task */
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return showStatus("Empty task", true);

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });

  taskInput.value = "";
  fetchTasks();
});

/* Toggle */
async function toggleComplete(id) {
  await fetch(`${API_URL}/${id}`, { method: "PATCH" });
  fetchTasks();
}

/* Delete */
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTasks();
}

/* Edit Task */
async function editTask(id, oldTitle) {
  const newTitle = prompt("Edit task:", oldTitle);

  if (!newTitle || newTitle.trim() === "") return;

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle })
  });

  fetchTasks();
}

/* Filter */
function setFilter(filter) {
  currentFilter = filter;
  fetchTasks();
}

/* Status */
function showStatus(msg, err = false) {
  status.textContent = msg;
  status.style.color = err ? "red" : "#00ffcc";
  setTimeout(() => status.textContent = "", 2000);
}

fetchTasks();