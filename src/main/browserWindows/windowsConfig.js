import { isAppInDebugMode } from "../utils/helpers"

export const mainWindowConfig = {
  getBrowserWindowConfig(display) {
    return {
      height: 300,
      width: 250,
      minWidth: 250,
      minHeight: 300,
      show: false,
      frame: false,
      resizable: isAppInDebugMode(),
      movable: true,
      transparent: true,
      frame: false, // isAppInDebugMode(),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        backgroundThrottling: false,
        devTools: isAppInDebugMode()
      },
    }
  },
  url: {
    pathname: MAIN_WINDOW_WEBPACK_ENTRY,
  },
  preventMultiple: true,
}
