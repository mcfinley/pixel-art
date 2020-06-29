import './index.html'

import CoreModule from './modules/core-module'
import ImageState from './modules/image-state'
import ToolsPalette from './modules/tools-palette'

/* Import tools */

import DragTool from './tools/drag-tool'

document.addEventListener('DOMContentLoaded', (e) => {
  const root = document.getElementById('app')

  const core = new CoreModule(root)
  const state = new ImageState(core)
  const tools = new ToolsPalette(core)

  const dragTool = new DragTool(tools)
})

