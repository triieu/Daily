// taskHandler.js
const fs = require('fs');
const path = require('path');
const os = require('os');


// path to documents in fs
const documentsPath = path.join(os.homedir(), 'Documents', 'daily-tasks.json');

function loadTasks() {
  if (!fs.existsSync(documentsPath)) return [];
  return JSON.parse(fs.readFileSync(documentsPath, 'utf-8'));
}

function saveTasks(tasks) {
  fs.writeFileSync(documentsPath, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTasks };
