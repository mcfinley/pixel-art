import './index.html'

import CoreModule from './core-module'
import ImageState from './image-state'
// import QuintusElements from './quintus-elements'
// import MainRender from './main-render'
// import CellsEngine from './cells-engine'
// import AdvancedEvents from './advanced-events'
// import GameMode from './game-mode'
// import MapNavigation from './map-navigation'

// import BottomInterface from './bottom-interface'
// import InstrumentsPalette from './instruments-palette'

// import GameActions from './game-actions'

document.addEventListener('DOMContentLoaded', (e) => {
  const root = document.getElementById('app')

  const core = new CoreModule(root)
  const state = new ImageState(core)
  // const elements = new QuintusElements()

  // const engine = new CellsEngine(state)
  // const events = new AdvancedEvents(html)
  // const mode = new GameMode()
  // const map = new MapNavigation(html)

  // const render = new MainRender(map, elements)
  // const bottomUI = new BottomInterface(html, engine, events)
  // const palette = new InstrumentsPalette(html, mode, events)

  // const actions = new GameActions(mode, events, map, state, html, render)
})

