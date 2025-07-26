const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskAPI', {
  loadTasks: () => ipcRenderer.invoke('loadTasks'),
  saveTasks: (tasks) => ipcRenderer.invoke('saveTasks', tasks)
});
