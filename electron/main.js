const { app, BrowserWindow, ipcMain } = require('electron')
const server = require('./server');
const path = require('path')

const DEBUG = true;

if (!DEBUG) {
  server.start(51001);
}

let serialDeviceSelected = null;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // to allow require
      contextIsolation: false, // allow use with Electron 12+
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.webContents.session.on('select-serial-port', (event, portList, webContents, callback) => {
    // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
    // is called.
    mainWindow.webContents.session.on('serial-port-added', (event, port) => {
      portList.push(port);
      mainWindow.webContents.send('onSerialDeviceFound', portList);
      // Optionally update portList to add the new port
    })

    mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
      portList.push(port);
      mainWindow.webContents.send('onSerialDeviceFound', portList);
      // Optionally update portList to remove the port
    })
    event.preventDefault()
    if (portList && portList.length > 0) {
      try {
        // eslint-disable-next-line n/no-callback-literal
        serialDeviceSelected("") // Already have a device selected
      } catch (e) {
        // Ignore
      }
      serialDeviceSelected = callback;
      mainWindow.webContents.send('onSerialDeviceFound', portList);
    } else {
      // eslint-disable-next-line n/no-callback-literal
      callback("") // Could not find any matching devices
    }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial' && details.requestingUrl === `${server.basePath}/serial-tool`) {
      return true
    }
    return false
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial' && details.origin === server.basePath) {
      return true
    }
    return false
  })

  mainWindow.setMenu(null);
  mainWindow.loadURL(server.basePath);

  if (DEBUG) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('onCanceledSerialDevice', (event, error) => {
  if (serialDeviceSelected) {
    try {
      serialDeviceSelected("");
      serialDeviceSelected = null;
    } catch (e) {
      console.log(e);
    }
  }
});

ipcMain.on('onSelectedSerialDevice', (event, id) => {
  if (serialDeviceSelected) {
    serialDeviceSelected(id);
  }
})
