const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');

  ipcMain.handle('open-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      filters: [{ name: 'Markdown', extensions: ['md'] }],
      properties: ['openFile']
    });
    if (canceled || filePaths.length === 0) return { content: null };
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return { content };
  });
}

app.whenReady().then(createWindow);
