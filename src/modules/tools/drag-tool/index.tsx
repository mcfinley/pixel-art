import React from 'react'
import { MdZoomOutMap } from 'react-icons/md'

import { Point } from '@/utils/graphic'

import ImageLayers from '@/modules/core/image-layers'
import AdvancedEvents from '@/modules/core/advanced-events'
import ToolsManager from '@/modules/interface/tools-manager'

/**
 * Dragging tool uses advanced events to change offset and zoom
 */
export default class DragTool {
  constructor (
    private toolsManager: ToolsManager, private events: AdvancedEvents, private layers: ImageLayers
  ) {
    this.toolsManager.onInitTools.subscribe(() => ({ icon: <MdZoomOutMap />, id: 'drag' }))

    this.events.onDrag.subscribe(this.handleDrag)
    this.events.onZoom.subscribe(this.handleZoom)

    this.events.onKeyDown.subscribe(this.handleKeyDown)
    this.events.onKeyUp.subscribe(this.handleKeyUp)
  }

  handleDrag = ({ x, y }: Point) => {
    if (this.toolsManager.getTool() === 'drag') {
      this.layers.offset.x += x
      this.layers.offset.y += y
    }
  }

  handleZoom = ({ x, y, delta: _delta }: Point & { delta: number }) => {
    const delta = _delta / 100
    const oldZoomValue = this.layers.zoom

    this.layers.zoom += delta
    this.layers.zoom = Math.max(1, Math.min(100, this.layers.zoom))

    const changeRatio = (this.layers.zoom / oldZoomValue) - 1

    this.layers.offset.x += (this.layers.offset.x - x) * changeRatio
    this.layers.offset.y += (this.layers.offset.y - y) * changeRatio
  }

  oldActive: string | null = null
  handleKeyDown = (keyCode: number) => {
    if (keyCode === 32) {
      if (this.oldActive === null) {
        this.oldActive = this.toolsManager.getTool()
        this.toolsManager.setTool('drag')
      }
    }
  }

  handleKeyUp = (keyCode: number) => {
    if (keyCode === 32) {
      if (this.oldActive !== null) {
        this.toolsManager.setTool(this.oldActive)
        this.oldActive = null
      }
    }
  }
}
