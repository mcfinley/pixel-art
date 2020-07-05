import React from 'react'
import { MdZoomOutMap } from 'react-icons/md'

import { Point } from '@/utils/graphic'

import ImageState from '@/modules/core/image-state'
import ToolsPalette from '@/modules/core/tools-palette'
import AdvancedEvents from '@/modules/core/advanced-events'

/**
 * Dragging tool uses advanced events to change offset and zoom
 */
export default class DragTool {
  constructor (
    private tools: ToolsPalette, private events: AdvancedEvents, private state: ImageState
  ) {
    this.tools.onInitTools.subscribe(() => ({ icon: <MdZoomOutMap />, id: 'drag' }))

    this.events.onDrag.subscribe(this.handleDrag)
    this.events.onZoom.subscribe(this.handleZoom)

    this.events.onKeyDown.subscribe(this.handleKeyDown)
    this.events.onKeyUp.subscribe(this.handleKeyUp)
  }

  handleDrag = ({ x, y }: Point) => {
    if (this.tools.activeTool === 'drag') {
      this.state.offset.x += x
      this.state.offset.y += y
    }
  }

  handleZoom = ({ x, y, delta: _delta }: Point & { delta: number }) => {
    const delta = _delta / 100
    const oldZoomValue = this.state.zoom

    this.state.zoom += delta
    this.state.zoom = Math.max(1, Math.min(100, this.state.zoom))

    const changeRatio = (this.state.zoom / oldZoomValue) - 1

    this.state.offset.x += (this.state.offset.x - x) * changeRatio
    this.state.offset.y += (this.state.offset.y - y) * changeRatio
  }

  oldActive: string | null = null
  handleKeyDown = (keyCode: number) => {
    if (keyCode === 32) {
      if (this.oldActive === null) {
        this.oldActive = this.tools.activeTool
        this.tools.activeTool = 'drag'
      }
    }
  }

  handleKeyUp = (keyCode: number) => {
    if (keyCode === 32) {
      if (this.oldActive !== null) {
        this.tools.activeTool = this.oldActive
        this.oldActive = null
      }
    }
  }
}
