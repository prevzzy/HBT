import { app } from 'electron'
import { createAppWindows, APP_WINDOW_NAMES, getAppWindow, getAllAppWindowsArray } from '../browserWindows/browserWindows';
import { initIpcEvents } from '../events/listeners'
import { initSettings } from '../settings/settings';

export function setupApp() {
  // Handle creating/removing shortcuts on Windows when installing/uninstalling.
  if (require('electron-squirrel-startup')) {
    app.quit();
  }

  app.allowRendererProcessReuse = false
  const gotTheLock = app.requestSingleInstanceLock()
      
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', onSecondInstance)
    app.whenReady().then(() => start())
    
    setupAppEventListeners()
  }
}

function onSecondInstance() {
  const mainWindow = getAppWindow(APP_WINDOW_NAMES.MAIN)

  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    mainWindow.show()
    mainWindow.restore()
    mainWindow.focus()
  }
}

async function start() {
  // Create window browsers, load the rest of the app, etc...
  await initSettings()
  initIpcEvents()
  createAppWindows()
}

function setupAppEventListeners() {
  app.on('browser-window-created', (_, window) => {
    require("@electron/remote/main").enable(window.webContents)
  })

  app.on('will-quit', () => {
    const windows = getAllAppWindowsArray()
    windows.forEach(window => window.destroy())
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.exit()
    }
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    
    if (BrowserWindow.getAllWindows().length === 0) {
      createAppWindows();
    }
  });
}
