import './index.html'

import CoreModule from './modules/core-module'
import ImageState from './modules/image-state'
import ToolsPalette from './modules/tools-palette'
import AdvancedEvents from './modules/advanced-events'

/* Import tools */

import DragTool from './tools/drag-tool'
import DrawTool from './tools/draw-tool'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app')

  const core = new CoreModule(root)
  const state = new ImageState(core)
  const tools = new ToolsPalette(core)
  const events = new AdvancedEvents(core)

  const dragTool = new DragTool(tools, events, state)
  const drawTool = new DrawTool(tools, events, state)
})

