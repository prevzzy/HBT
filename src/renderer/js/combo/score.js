import * as MemoryController from '../game/memory'

export class Score {
  constructor () {
    this.multiplier = 0
    this.multiplierDataset = []
  }

  update() {
    this.multiplier = MemoryController.getMultiplier()
    this.multiplierDataset.push(MemoryController.getMultiplier())
  }

  updateDatasets() {
    this.multiplierDataset.push(MemoryController.getMultiplier())
  }
  
  hasNewComboStartedUnnoticed() {
    // In some cases a new combo can be started without multiplier being 0 for even a single frame (e.g. no comply instead of a manual), so an extra check is needed.

    let currentMultiplier = MemoryController.getMultiplier()
    if (currentMultiplier >= 1 && this.multiplierDataset.length > 0) { 
      return this.multiplierDataset[this.multiplierDataset.length - 1] / currentMultiplier > 2
    }
    return false
  }
}
