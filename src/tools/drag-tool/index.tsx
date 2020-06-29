import React from 'react'
import { MdZoomOutMap } from 'react-icons/md'

import ImageState from '../../modules/image-state'
import ToolsPalette from '../../modules/tools-palette'
import AdvancedEvents, { Point } from '../../modules/advanced-events'

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
    if (this.tools.active === 'drag') {
      this.state.offset.x += x
      this.state.offset.y += y // * this.state.zoom
    }
  }

  handleZoom = ({ x, y, delta: _delta }: Point & { delta: number }) => {
    const delta = _delta / 100
    const changeRatio = ((this.state.zoom + delta) / this.state.zoom) - 1

    this.state.zoom += delta
    this.state.offset.x += (this.state.offset.x - x) * changeRatio
    this.state.offset.y += (this.state.offset.y - y) * changeRatio
  }

  oldActive: string | null = null
  handleKeyDown = (keyCode: number) => {
    if (keyCode === 32) {
      if (this.oldActive === null) {
        this.oldActive = this.tools.active
        this.tools.active = 'drag'
      }
    }
  }

  handleKeyUp = (keyCode: number) => {
    if (keyCode === 32) {
      if (this.oldActive !== null) {
        this.tools.active = this.oldActive
        this.oldActive = null
      }
    }
  }
}
