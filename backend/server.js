const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./tasks.json";

/* Read tasks from file */
function readTasks() {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
}

/* Write tasks to file */
function writeTasks(tasks) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

/* GET all tasks */
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

/* POST new task */
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

/* PATCH task */
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title } = req.body;

  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title !== undefined) {
    task.title = title;
  } else {
    task.completed = !task.completed;
  }

  writeTasks(tasks);
  res.json(task);
});

/* DELETE task */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  let tasks = readTasks();

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);

  writeTasks(tasks);
  res.json({ message: "Task deleted" });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});