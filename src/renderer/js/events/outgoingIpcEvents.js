import { ipcRenderer } from 'electron'

export function requestSettingValue(key) {
  ipcRenderer.send('get-setting-request', {
    payload: {
      key
    }
  })
}

export function requestSettingUpdate(settingsToUpdate, params) {
  ipcRenderer.send('set-setting-request', {
    payload: {
      settingsToUpdate,
      params
    }
  })
}


export function requestAppMinimize() {
  ipcRenderer.send('request-app-minimize')
}

export function requestAppExit() {
  ipcRenderer.send('request-app-exit')
}
