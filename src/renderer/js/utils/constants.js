export const GAME_PROCESSES = {
  THUGPRO: 'THUGPro.exe',
  RETHAWED: 'reTHAWed.exe',
  THUG2: 'THUG2.exe',
  THAW: 'THAW.exe',
}

export const GAMES = {
  THUGPRO: 'THUG Pro',
  RETHAWED: 'reTHAWed',
  THUG2: 'THUG2',
  THAW: 'THAW',
}

export const GAMES_BY_PROCESS_NAME = {
  [GAME_PROCESSES.THUGPRO]: GAMES.THUGPRO,
  [GAME_PROCESSES.RETHAWED]: GAMES.RETHAWED,
  [GAME_PROCESSES.THUG2]: GAMES.THUG2,
  [GAME_PROCESSES.THAW]: GAMES.THAW,
}

export const HBT_LEVELS = {
  MID: 'MID',
  HARD: 'HARD',
  SICK: 'SICK',
  LOL: 'LOL'
}

export function getHbtLevel(gameProcessName, hbtLevel) {
  return HBT_VALUES_BY_PROCESS_NAME_AND_LEVEL[gameProcessName][hbtLevel];
}

export const HBT_VALUES_BY_PROCESS_NAME_AND_LEVEL = {
  [GAME_PROCESSES.THUGPRO]: {
    [HBT_LEVELS.MID]: {
      GRIND: 27,
      MANUAL: 22,
      LIP: 13,
    },
    [HBT_LEVELS.HARD]: {
      GRIND: 37,
      MANUAL: 32,
      LIP: 17,
    },
    [HBT_LEVELS.SICK]: {
      GRIND: 46,
      MANUAL: 41,
      LIP: 21,
    },
    [HBT_LEVELS.LOL]: {
      GRIND: 70,
      MANUAL: 65,
      LIP: 25,
    }
  },
  [GAME_PROCESSES.RETHAWED]: {
    [HBT_LEVELS.MID]: {
      GRIND: 32,
      MANUAL: 27,
      LIP: 13,
    },
    [HBT_LEVELS.HARD]: {
      GRIND: 42,
      MANUAL: 37,
      LIP: 15,
    },
    [HBT_LEVELS.SICK]: {
      GRIND: 51,
      MANUAL: 46,
      LIP: 20,
    },
    [HBT_LEVELS.LOL]: {
      GRIND: 75,
      MANUAL: 70,
      LIP: 25,
    }
  },
  [GAME_PROCESSES.THUG2]: {
    [HBT_LEVELS.MID]: {
      GRIND: 27,
      MANUAL: 22,
      LIP: 13,
    },
    [HBT_LEVELS.HARD]: {
      GRIND: 37,
      MANUAL: 32,
      LIP: 17,
    },
    [HBT_LEVELS.SICK]: {
      GRIND: 46,
      MANUAL: 41,
      LIP: 21,
    },
    [HBT_LEVELS.LOL]: {
      GRIND: 70,
      MANUAL: 65,
      LIP: 25,
    }
  },
  [GAME_PROCESSES.THAW]: {
    [HBT_LEVELS.MID]: {
      GRIND: 32,
      MANUAL: 27,
      LIP: 13,
    },
    [HBT_LEVELS.HARD]: {
      GRIND: 42,
      MANUAL: 37,
      LIP: 15,
    },
    [HBT_LEVELS.SICK]: {
      GRIND: 51,
      MANUAL: 46,
      LIP: 20,
    },
    [HBT_LEVELS.LOL]: {
      GRIND: 75,
      MANUAL: 70,
      LIP: 25,
    }
  }
}

export const GAME_CONSTANTS = {
  THUGPRO_CAP_SCRIPT: 'sk5ed',
  THUGPRO_MAIN_MENU_SCRIPT: 'skateshop',
  RETHAWED_CAP_SCRIPT: '5ed',
  RETHAWED_MAIN_MENU_SCRIPT: 'mainmenu'
}
