const {
    app,
    BrowserWindow,
    ipcMain
  } = require("electron");
  const si = require('systeminformation');
  const path = require('path');
  
  const createWindow = () => {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    })
    mainWindow.loadFile('index.html')
  
  }
  
  app.whenReady().then(() => {
    createWindow()
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })