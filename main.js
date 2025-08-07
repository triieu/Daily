const path = require('path');
const isMac = process.platform === 'darwin';
const { app, BrowserWindow } = require('electron');

const { ipcMain } = require('electron');
const { loadData, saveData } = require('./renderer/js/handler.js');

ipcMain.handle('loadData', () => loadData());
ipcMain.handle('saveData', (event, data) => {
    saveData(data);
    return { success: true};
})

function createMainWindow() {
    const win = new BrowserWindow({
        title: 'daily',
        width: 400,
        height: 500,
        minWidth: 300,
        minHeight: 350,
        titleBarStyle: 'hidden',
        ...(!isMac ? { titleBarOverlay: true } : {}),
        webPreferences: {
            preload: path.join(__dirname, './renderer/js/preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });


    // load HTML file
    win.loadFile(path.join(__dirname, './renderer/index.html'))

    // DEV TOOLS REMOVE WHEN DONE
    win.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
    createMainWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})