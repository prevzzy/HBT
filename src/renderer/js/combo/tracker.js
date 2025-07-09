import { Score } from './score'
import * as MemoryController from '../game/memory'
import { log } from '../debug/debugHelpers'
import { hbtLevel, isHbtOn } from '../ui/ui'
import { getHookedGameProcessName } from '../game/gameProcessService'
import { getHbtLevel } from '../utils/constants'

let isTrackerRunning = false
let isSuspended = true

let score = new Score()
let trackingInterval = null
let datasetsUpdatingInterval = null
let hasStartedWithHBT = false
let hbtLevelOnStart = hbtLevel;

function isComboTrackingSuspended() {
  return isSuspended
}

function shouldSuspendComboTracking(value) {
  isSuspended = value
}

function resetTracker() {
  score = new Score(),
  hasStartedWithHBT = false,
  hbtLevelOnStart = hbtLevel;
  clearInterval(trackingInterval)
  clearInterval(datasetsUpdatingInterval)
}

async function listenForComboStart() {
  if (isComboTrackingSuspended()) {
    isTrackerRunning = false;
    return
  }

  setTimeout(async () => {
    try {
      // log('base: ', MemoryController.getBasePoints())
      // log('multi: ', MemoryController.getMultiplier())
      // log('grind: ', MemoryController.getGrindTime())
      // log('manual: ', MemoryController.getManualTime())
  
      if (isComboInProgress()) {
        log('start')
        await startTracking()
      } else {
        await listenForComboStart()
      }
    } catch(error) {
      console.error(error)
    }
  }, 16)
}

async function startTracking() {
  hasStartedWithHBT = isHbtOn;
  if (isHbtOn) {
    startHBT()
  }
  startDatasetUpdating()

  await track()
}

function startHBT() {
  log('HBT LEVEL:', hbtLevel)
  const hbtLevels = getHbtLevel(getHookedGameProcessName(), hbtLevel)
  hbtLevelOnStart = hbtLevel

  MemoryController.setHardBalance(hbtLevels)
}

function startDatasetUpdating() {
  datasetsUpdatingInterval = setInterval(() =>  {
    if (isComboInProgress()) {
      updateDatasets()
    } 
  }, 1000)
}

async function track() {
  trackingInterval = setInterval(async () => {
    if (isComboInProgress()) {
      updateComboValues()
    } else {
      clearInterval(trackingInterval)
      clearInterval(datasetsUpdatingInterval)
      restart()
    }
  }, 16)
}

function restart() {
  log('restart')

  resetTracker()
  setTimeout(async () => {
    await listenForComboStart()
  }, 250)
}

function isComboInProgress() {
  // There is an in-game bug where if you do a manual not longer than 0.27s and then get off board, the game won't reset the manual balance timer. Despite being off board with 0 multiplier and 0 base, you will still (kinda) be in a combo. Technically this means that this function may return incorrect value, which can cause combo tracking logic to loop itself. Not a big deal since idle detector will end the combo every 10 seconds anyways.

  if (
    !isComboTrackingSuspended() &&
    (MemoryController.getRevertPenalty() < 10 && MemoryController.getRevertPenalty() >= 0) &&
    (MemoryController.getMultiplier() > 0 ||
    MemoryController.getBasePoints() > 0 ||
    MemoryController.getManualTime() > 0)
  ) {  
    return !score.hasNewComboStartedUnnoticed()
  } 
  return false
}

function updateDatasets() {
  score.updateDatasets()
}

function updateComboValues() {
  score.update()

  // todo update jak spadnie poniżej minimalnych wartości
}

async function resumeComboTracking() {
  if (!isSuspended || isTrackerRunning) {
    return
  }

  log('resuming HBT')

  shouldSuspendComboTracking(false)
  await listenForComboStart()
  isTrackerRunning = true;
}

export {
  listenForComboStart,
  shouldSuspendComboTracking,
  isComboTrackingSuspended,
  resumeComboTracking,
  isComboInProgress,
}
