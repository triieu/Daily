// taskHandler.js
const fs = require('fs');
const path = require('path');
const os = require('os');


// path to documents in fs
const documentsPath = path.join(os.homedir(), 'Documents', 'daily-tasks.json');

function loadData() {
  if (!fs.existsSync(documentsPath)) {
    return { quote:`"today will be a great day."`, tasks: [] };
  }

  const rawData = fs.readFileSync(documentsPath, 'utf-8');
  const parsed = JSON.parse(rawData);

  if (!parsed.hasOwnProperty("quote")) {
    parsed.quote = "";
  }

  return parsed;
}

function saveData(data) {
  try {
    fs.writeFileSync(documentsPath, JSON.stringify(data, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message }
  }
}

module.exports = { loadData, saveData };
