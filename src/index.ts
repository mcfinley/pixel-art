import './index.html'

import CoreModule from './modules/core/core-module'
import ImageState from './modules/core/image-state'
import ToolsPalette from './modules/core/tools-palette'
import AdvancedEvents from './modules/core/advanced-events'

/* Import tools */

import DragTool from './modules/tools/drag-tool'
import DrawTool from './modules/tools/draw-tool'
import EraseTool from './modules/tools/erase-tool'

/* Import miscellaneous stuff */

import HelloUser from './modules/miscellaneous/hello-user'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app')

  if (!root) {
    return
  }

  const core = new CoreModule(root)
  const state = new ImageState(core)
  const tools = new ToolsPalette(core)
  const events = new AdvancedEvents(core)

  const dragTool = new DragTool(tools, events, state)
  const drawTool = new DrawTool(tools, events, state)
  const eraseTool = new EraseTool(tools, events, state)

  const hello = new HelloUser(core)
})

