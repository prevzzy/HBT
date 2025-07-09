import memoryjs from 'memoryjs'
import { CustomError } from '../utils/customError'
import {
  grindTimeAddressData,
  manualTimeAddressData,
  lipTimeAddressData,
  basePointsAddressData,
  multiplierAddressData,
  gameScoreAddressData,
  revertPenaltyAddressData,
  currentMapScriptAddressData,
} from './offsets'
import { isInMainMenu } from './interGameUtils'
import { log } from '../debug/debugHelpers'

let gameHandle
let processBaseAddress
let grindTimeAddress
let manualTimeAddress
let lipTimeAddress
let currentMapAddress
let basePointsAddress
let multiplierAddress
let gameScoreAddress
let revertPenaltyAddress

function initAddresses (_gameHandle, _processBaseAddress, gameProcessName) {
  gameHandle = _gameHandle
  processBaseAddress = _processBaseAddress

  grindTimeAddress = getAddress(gameHandle, processBaseAddress, grindTimeAddressData[gameProcessName])
  manualTimeAddress = getAddress(gameHandle, processBaseAddress, manualTimeAddressData[gameProcessName])
  lipTimeAddress = getAddress(gameHandle, processBaseAddress, lipTimeAddressData[gameProcessName])
  basePointsAddress = getAddress(gameHandle, processBaseAddress, basePointsAddressData[gameProcessName])
  multiplierAddress = getAddress(gameHandle, processBaseAddress, multiplierAddressData[gameProcessName])
  gameScoreAddress = getAddress(gameHandle, processBaseAddress, gameScoreAddressData[gameProcessName])
  revertPenaltyAddress = getAddress(gameHandle, processBaseAddress, revertPenaltyAddressData[gameProcessName])
  currentMapAddress = getAddress(gameHandle, processBaseAddress, currentMapScriptAddressData[gameProcessName])

}

// It's hard to predict whether this function will always work. Current checks depend only on relations between incorrectly initialized values that I noticed.
function testInitializedAddresses(gameProcessName) {
  const floatValues = [
    getGrindTime(),
    getManualTime(),
    getLipTime()
  ] // skipping getMultiplier() because for whatever reason it's broken when joining a server with a game in progress. 
  
  const integerValues = [
    getBasePoints(),
    getGameScore(),
    getRevertPenalty()
  ]

  function isEveryValueInArrayTheSameAndNot0(array) {
    return array.every(value => {
      return value === array[0] && value !== 0
    })
  }
  
  const hasValidIntegerAddresses = !isEveryValueInArrayTheSameAndNot0(integerValues)
  const hasValidFloatAddresses = !isEveryValueInArrayTheSameAndNot0(floatValues)

  const currentMapScript = getCurrentMapScript()

  const currentMultiplier = getMultiplier()
  const currentBasePoints = getBasePoints()
  const gameScore = getGameScore()

  if (
    currentMapScript === '' || 
    isInMainMenu(currentMapScript) &&
    (!hasValidFloatAddresses &&
    !hasValidIntegerAddresses ||
    lipTimeAddress === lipTimeAddressData[gameProcessName].offsets[0])
  ) {
    throw new CustomError('Game loading...', 2)
  }

  if (
    (
      (currentBasePoints === 0 && currentMultiplier !== 0 && gameScore === 0) ||
      (currentMultiplier % 1 !== 0 && currentMultiplier % 1 !== 0.5)
    ) ||
    !hasValidFloatAddresses ||
    !hasValidIntegerAddresses
  ) {
    throw new CustomError('Reinitializing addresses. Restart the game if the problem persists.', 1)
  }
}

function getAddress(gameHandle, processBaseAddress, addressData) {
  const { startAddress, offsets } = addressData
  
  const offsetArray = [...offsets]
  
  let address = processBaseAddress + startAddress
  let finalOffset = offsetArray.pop()
  const hasValidFinalOffset = !Number.isNaN(parseInt(finalOffset))

  if (hasValidFinalOffset) {
    address = memoryjs.readMemory(gameHandle, address, memoryjs.PTR)
  }

  if (offsetArray.length) {
    offsetArray.forEach((offset) => {
      address = memoryjs.readMemory(gameHandle, address + offset, memoryjs.PTR)
    })
  }

  if (hasValidFinalOffset) {
    address += finalOffset
  }

  return address
}

function getGrindTime() {
  return memoryjs.readMemory(gameHandle, grindTimeAddress, memoryjs.FLOAT)
}

function getManualTime() {
  return memoryjs.readMemory(gameHandle, manualTimeAddress, memoryjs.FLOAT)
}

function getLipTime() {
  return memoryjs.readMemory(gameHandle, lipTimeAddress, memoryjs.FLOAT)
}

function getCurrentMapScript() {
  return memoryjs.readMemory(gameHandle, currentMapAddress, memoryjs.STRING)
}

function getMultiplier() {
  return memoryjs.readMemory(gameHandle, multiplierAddress, memoryjs.FLOAT)
}

function getBasePoints() {
  return memoryjs.readMemory(gameHandle, basePointsAddress, memoryjs.INT)
}

function getGameScore() {
  return memoryjs.readMemory(gameHandle, gameScoreAddress, memoryjs.INT)
}

function getRevertPenalty() {
  return memoryjs.readMemory(gameHandle, revertPenaltyAddress, memoryjs.INT)
}

function setHardBalance(hbtLevels) {
  log(`Starting HBT
    GRIND: ${hbtLevels.GRIND}
    MANUAL: ${hbtLevels.MANUAL}
    LIP: ${hbtLevels.LIP}
  `)

  memoryjs.writeMemory(gameHandle, grindTimeAddress, hbtLevels.GRIND, memoryjs.FLOAT)
  memoryjs.writeMemory(gameHandle, manualTimeAddress, hbtLevels.MANUAL, memoryjs.FLOAT)
  memoryjs.writeMemory(gameHandle, lipTimeAddress, hbtLevels.LIP, memoryjs.FLOAT)
}

export {
  initAddresses,
  testInitializedAddresses,
  getCurrentMapScript,
  getMultiplier,
  getGrindTime,
  getManualTime,
  getLipTime,
  getBasePoints,
  getGameScore,
  getRevertPenalty,
  setHardBalance
}
