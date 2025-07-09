import { onSettingsRequestResponse } from '../ui/uiSettings'
import { ipcRenderer } from 'electron'
import { toggleHbt } from '../ui/ui'
import { isAppHookedToGame } from '../game/gameProcessService'

export function initIncomingIpcEventListeners() {
  ipcRenderer.on('settings-request-response', (event, arg) => {
    onSettingsRequestResponse(arg)
  })

  ipcRenderer.on('toggle-hbt', () => {
    if (!isAppHookedToGame()) {
      return;
    }
    toggleHbt()
  })
}