
import url from 'url';
import electron, { BrowserWindow, app } from 'electron';
import { mainWindowConfig } from './windowsConfig';
import { pipeLogsToRenderer } from '../utils/helpers';

let mainWindow

export const APP_WINDOW_NAMES = {
  MAIN: 'MAIN',
}

export function getAppWindow(name) {
  switch (name) {
    case APP_WINDOW_NAMES.MAIN:
      return mainWindow;
    default: 
      console.error(`Could not find '${name}' window`)
      return;
  }
}

export function getAllAppWindowsArray() {
  return BrowserWindow.getAllWindows()
}

function createBrowserWindow(config) {
  // needed for relative window position
  const display = electron.screen.getPrimaryDisplay()

  const windowConfig = config.getBrowserWindowConfig(display)

  let win = new BrowserWindow(windowConfig)
  win.loadURL(url.format(config.url))

  if (windowConfig.alwaysOnTop) {
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.setAlwaysOnTop(true, 'screen-saver');
  }

  if (config.showOnAppLaunch) {
    win.once('ready-to-show', () => {
      win.show()
    })
  }

  if (config.preventMultiple) {
    win.webContents.on('new-window', (event, url) => {
      event.preventDefault()
    })
  }

  return win
}

export function createAppWindows() {
  mainWindow = createBrowserWindow(mainWindowConfig)

  setupWindowEventHandlers()
}

export function showMainWindow() {
  mainWindow.show()
  mainWindow.restore()
  mainWindow.focus()
}

function setupWindowEventHandlers() {
  pipeLogsToRenderer(mainWindow)

  mainWindow.on('close', () => {
    app.exit();
  })

  mainWindow.on('ready-to-show', () => {
    showMainWindow()
  })
}
