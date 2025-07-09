import { registerAllShortcuts, unregisterAllShortcuts, setSettings, getSetting } from '../settings/settings'
import { APP_WINDOW_NAMES, getAppWindow} from '../browserWindows/browserWindows'

export async function onGetSettingRequest(event, arg) {
  const { key } = arg.payload
  const settings = await getSetting(key)
  const mainWindow = getAppWindow(APP_WINDOW_NAMES.MAIN)

  mainWindow.webContents.send('settings-request-response', settings)
}

export function onSetSettingRequest(event, arg) {
  const { settingsToUpdate, params } = arg.payload

  setSettings(settingsToUpdate, params)
}

export function onCleanupAllShortcutsRequest() {
  unregisterAllShortcuts();
}

export function onRegisterAllShortcutsRequest() {
  registerAllShortcuts();
}
