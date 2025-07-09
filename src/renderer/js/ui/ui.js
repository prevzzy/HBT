import {
  requestAppMinimize, 
  requestAppExit
} from '../events/outgoingIpcEvents'
import { HBT_LEVELS } from "../utils/constants";

const toggleButton = document.getElementById('toggle-button');
const levelMidButton = document.getElementById('level-button-mid');
const levelHardButton = document.getElementById('level-button-hard');
const levelSickButton = document.getElementById('level-button-sick');
const levelLolButton = document.getElementById('level-button-lol');

const levelButtons = [
  levelMidButton,
  levelHardButton,
  levelSickButton,
  levelLolButton,
]

let isHbtOn = false;
let hbtLevel = HBT_LEVELS.HARD;

function showApp() {
  const spinner = document.getElementById('initial-spinner')
  const page = document.getElementById('app')

  spinner.style.display = 'none'
  page.style.display = 'block'
}

function toggleHbt() {
  isHbtOn = !isHbtOn;
  toggleButton.textContent = isHbtOn ? 'HBT is ON' : 'HBT is OFF';
}

function setupToolbarListeners() {
  document.getElementById('toolbar-minimize-button').addEventListener('click', requestAppMinimize)
  document.getElementById('toolbar-close-button').addEventListener('click', requestAppExit)
}

function setHbtLevel(e, level) {
  levelButtons.forEach((button) => {
    button.classList.remove('active')
  })
  e.target.classList.add('active')
  hbtLevel = level;
  localStorage.setItem('hbtLevel', level);
}

function initUI() {
  toggleButton.addEventListener('click', toggleHbt);
  levelMidButton.addEventListener('click', (e) => setHbtLevel(e, HBT_LEVELS.MID));
  levelHardButton.addEventListener('click', (e) => setHbtLevel(e, HBT_LEVELS.HARD));
  levelSickButton.addEventListener('click', (e) => setHbtLevel(e, HBT_LEVELS.SICK));
  levelLolButton.addEventListener('click', (e) => setHbtLevel(e, HBT_LEVELS.LOL));

  const savedHbtLevel = localStorage.getItem('hbtLevel');

  if (savedHbtLevel) {
    const savedLevelButton = levelButtons.find((button) => button.textContent === savedHbtLevel);
  
    if (savedLevelButton) {
      savedLevelButton.click();
    }
  }

  setupToolbarListeners()
}

initUI()

export {
  isHbtOn,
  hbtLevel,
  toggleHbt,
  showApp,
}