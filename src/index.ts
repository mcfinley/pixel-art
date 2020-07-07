import './index.html'

import CoreModule from '@/modules/core/core-module'
import AdvancedEvents from './modules/core/advanced-events'
import ImageLayers from '@/modules/core/image-layers'

import LayersManager from '@/modules/interface/layers-manager'
import ToolsManager from './modules/interface/tools-manager'

import DragTool from './modules/tools/drag-tool'
import DrawTool from './modules/tools/draw-tool'
import EraseTool from './modules/tools/erase-tool'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app')

  if (!root) {
    return console.error('There is no #app!')
  }

  const core = new CoreModule(root)
  const events = new AdvancedEvents(core)
  const layers = new ImageLayers(core)

  const layersManager = new LayersManager(core, layers)
  const toolsManager = new ToolsManager(core)

  const dragTool = new DragTool(toolsManager, events, layers)
  const drawTool = new DrawTool(toolsManager, events, layers)
  const eraseTool = new EraseTool(toolsManager, events, layers)
})

