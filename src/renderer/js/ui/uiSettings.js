import {
  requestSettingValue,
  requestSettingUpdate,
} from '../events/outgoingIpcEvents'
import { mapKeyToAccelerator } from '../utils/hotkeyMapper'
import { isAppHookedToGame } from '../game/gameProcessService'

const settingFields = document.querySelectorAll('.user-setting')

function getSettingFieldsOfType(typeClass) {
  return Array.from(settingFields).filter(field => field.classList.contains(typeClass))
}

function getSettingNameAttribute(field) {
  return field.attributes['data-setting-name'].value
}

function initSettings() {
  requestSettingValue()
  initHotkeyChangeListeners()
}

function onSettingsRequestResponse(settings) {
  settingFields.forEach(field => {
    const fieldSettingName = getSettingNameAttribute(field)

    if (settings.hasOwnProperty(fieldSettingName)) {
      applySetting(field, settings[fieldSettingName])
    }
  })
}

function applySetting(field, settingValue) {
  field[getSettingValuePropertyName(field)] = settingValue
}

function getSettingValue(key) {
  const settingField = Array.from(settingFields).find(field => {
    const fieldSettingName = getSettingNameAttribute(field)

    return fieldSettingName === key
  })

  return settingField[getSettingValuePropertyName(settingField)]
}

function getSettingValuePropertyName(field) {
  if (field.classList.contains('user-setting-switch')) {
    return 'checked'
  }

  if (field.classList.contains('user-setting-text')) {
    return 'textContent'
  }

  if (field.classList.contains('user-setting-input')) {
    return 'value'
  }
}

function initHotkeyChangeListeners() {
  getSettingFieldsOfType('hotkey').forEach((hotkeyElement) => {
    const hotkeyEditElement = hotkeyElement.parentElement.querySelectorAll('.hotkey-edit')[0]
    const hotkeyOverlayElement = hotkeyElement.parentElement.querySelectorAll('.hotkey-overlay')[0]

    
    if (hotkeyEditElement) {
      hotkeyEditElement.addEventListener('click', (e) => {
        onHotkeyEditClick(hotkeyElement, hotkeyOverlayElement)
      })
    }
  })
}

function onHotkeyEditClick(hotkeyElement, hotkeyOverlayElement) {
  const hotkeyListenerElement = document.getElementById('hotkey-listener')

  hotkeyListenerElement.addEventListener('blur', () => {
    hotkeyOverlayElement.classList.remove('hotkey-edited')
    hotkeyListenerElement.value = ''
    hotkeyListenerElement.replaceWith(hotkeyListenerElement.cloneNode(true))
  })

  hotkeyListenerElement.addEventListener('keyup', (e) => {
    onHotkeyChange(e, hotkeyElement, hotkeyElement.value)
  })

  hotkeyOverlayElement.classList.add('hotkey-edited')

  hotkeyListenerElement.focus({
    preventScroll: true
  })
}

function getHotkeyElementIndex(accelerator) {
  return getSettingFieldsOfType('hotkey').findIndex(hotkeyElement =>
    hotkeyElement.value === accelerator
  )
}

function onHotkeyChange(e, hotkeyElement, currentHotkey) {
  e.preventDefault()

  const hotkeyListenerElement = e.target
  const accelerator = mapKeyToAccelerator(e.key, e.shiftKey, e.altKey, e.ctrlKey, e.metaKey)
  
  if (typeof accelerator === 'string' && accelerator.length !== 0) {
    hotkeyListenerElement.blur()    
    handleNewHotkeyRegistering(accelerator, hotkeyElement, currentHotkey)
  }
}

function handleNewHotkeyRegistering(accelerator, hotkeyElement, currentHotkey) {
  const currentHotkeyElementIndex = getHotkeyElementIndex(currentHotkey)
  const alreadyUsedHotkeyElementIndex = getHotkeyElementIndex(accelerator)
  
  applySetting(hotkeyElement, accelerator)
  let hotkeysToUpdate = {
    [getSettingNameAttribute(hotkeyElement)]: accelerator,
  }
  
  if (
    alreadyUsedHotkeyElementIndex !== -1 &&
    currentHotkeyElementIndex !== alreadyUsedHotkeyElementIndex
  ) {
    const alreadyUsedHotkeyElement = Array.from(getSettingFieldsOfType('hotkey'))[alreadyUsedHotkeyElementIndex]
    
    applySetting(alreadyUsedHotkeyElement, currentHotkey)
    hotkeysToUpdate = {
      ...hotkeysToUpdate,
      [getSettingNameAttribute(alreadyUsedHotkeyElement)]: currentHotkey,
    }
  }
    
  requestSettingUpdate(hotkeysToUpdate, { skipRegisteringShortcuts: !isAppHookedToGame() })
}

export {
  initSettings,
  onSettingsRequestResponse,
  getSettingValue,
}
