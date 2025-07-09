import memoryjs from 'memoryjs'
import { GAME_PROCESSES } from '../utils/constants'
import { CustomError } from '../utils/customError'
import * as MemoryController from './memory'
import * as Tracker from '../combo/tracker'
import { log } from '../debug/debugHelpers'

const supportedGames = [
  GAME_PROCESSES.THUGPRO,
  GAME_PROCESSES.RETHAWED,
  GAME_PROCESSES.THUG2,
  GAME_PROCESSES.THAW,
]

let hookedGameProcessName

function getHookedGameProcessName() {
  return hookedGameProcessName
}

function isAppHookedToGame() {
  return !!hookedGameProcessName
}

function isGameRunning() {
  try {
    // memoryjs.openProcess(Number(process.env.GAME_PROCESS_NAME))
    memoryjs.openProcess(hookedGameProcessName)
    return true
  } catch {
    return false
  }
}

function scanProcessesForSupportedGame() {
  const gameProcess = memoryjs.getProcesses().find(process =>
    supportedGames.find(game => game === process.szExeFile)
  );

  if (!gameProcess) {
    log('No active game found.')
  }

  return gameProcess?.szExeFile
}

function openProcess(gameProcessName) {
  if (isAppHookedToGame()) {
    onBeforeGameHookChange() // clean after previously hooked game before hooking to a new one
  }

  return new Promise((resolve, reject) => {
    // memoryjs.openProcess(Number(process.env.GAME_PROCESS_NAME), (error, processObject) => {
    memoryjs.openProcess(gameProcessName, (error, processObject) => {
      if (error) {
        console.error(error)
        reject(new CustomError(`Could not find any active supported game process.`, 1));
      } else {
        MemoryController.initAddresses(processObject.handle, processObject.modBaseAddr, gameProcessName)
        MemoryController.testInitializedAddresses(gameProcessName)
  
        onHookingToGameSuccess(gameProcessName)
        log(`openProcess ${gameProcessName} OK`)
        resolve(true);
      }
    })
  })
}

async function handleHookingToGameProcess(gameProcessName) {
  log('...handleHookingToGameProcess')

  try {
    await openProcess(gameProcessName)
  } catch (error) {
    log(`openProcess ${gameProcessName} FAIL`)
    console.error(error)
  }
}

function onHookingToGameSuccess(gameProcessName) {    
  hookedGameProcessName = gameProcessName
  
  log('HOOKED TO:', gameProcessName)
  
  if (Tracker.isComboTrackingSuspended()) {
    Tracker.resumeComboTracking()
  }
}

function onBeforeGameHookChange() {
  log('UNHOOKING FROM:', hookedGameProcessName)
  hookedGameProcessName = ''

  Tracker.shouldSuspendComboTracking(true)
}

async function checkMemoryControllerHealth() {
  try {
    MemoryController.testInitializedAddresses(hookedGameProcessName);

    if (Tracker.isComboTrackingSuspended()) {
      await Tracker.resumeComboTracking()
    }
  } catch (error) {
    log('healthCheck FAIL - suspending HBT')
    console.error(error);
    await handleHookingToGameProcess(hookedGameProcessName)
    Tracker.shouldSuspendComboTracking(true)
  }
}

async function mainLoop() {
  mainLoopLogic()

  setInterval(async () => {
    await mainLoopLogic()
  }, 5000)
}

async function mainLoopLogic() {
  if (isAppHookedToGame() && isGameRunning()) {
    await checkMemoryControllerHealth()
  } else {
    const gameProcessName = scanProcessesForSupportedGame()
    await handleHookingToGameProcess(gameProcessName || '')
  }
}

export {
  getHookedGameProcessName,
  isAppHookedToGame,
  mainLoop,
}
