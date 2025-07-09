import { SETTINGS_STRINGS } from './defaultSettings'
import { globalShortcut } from 'electron'
import { APP_WINDOW_NAMES, getAppWindow } from '../browserWindows/browserWindows'

export const settingChangeHandlers = new Map([
  [SETTINGS_STRINGS.HBT_TOGGLE_HOTKEY, registerNewShortcut],
])

export const shortcutCallbacks = new Map([
  [SETTINGS_STRINGS.HBT_TOGGLE_HOTKEY, onToggleHbtShortcut]
])

async function registerNewShortcut(settingKey, newShortcut) {
  if (!newShortcut) {
    return;
  }

  try {
    const mainWindow = getAppWindow(APP_WINDOW_NAMES.MAIN)
    globalShortcut.register(newShortcut, () => {
      shortcutCallbacks.get(settingKey)(mainWindow)
    })
  } catch (error) {
    console.error(error)
  }
}

function onToggleHbtShortcut() {
  const mainWindow = getAppWindow(APP_WINDOW_NAMES.MAIN)
  mainWindow.webContents.send('toggle-hbt')
}
