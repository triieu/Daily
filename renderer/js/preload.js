const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('taskAPI', {
  loadData: () => ipcRenderer.invoke('loadData'),
  saveData: (data) => ipcRenderer.invoke('saveData', data)
});
