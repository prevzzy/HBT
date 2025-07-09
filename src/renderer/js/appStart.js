import * as GameProcessService from './game/gameProcessService'
import { showApp } from './ui/ui'
import { initIncomingIpcEventListeners } from './events/incomingIpcEvents'
import * as SettingsUI from './ui/uiSettings'

let isRunning = false

async function startApp() {
  if (isRunning) {
    return
  }

  initIncomingIpcEventListeners()
  SettingsUI.initSettings()
  runCoreLogic()
}

function runCoreLogic() {
  try {
    isRunning = true
    GameProcessService.mainLoop()
    showApp()
  } catch(error) {
    console.error(error)
  }
}

export {
  startApp,
}
