import React from 'react'
import { MdBrush, MdRemoveCircleOutline } from 'react-icons/md'

import { Point, pixelizeLine } from '@/utils/graphic'

import ImageState from '@/modules/core/image-state'
import ToolsPalette from '@/modules/core/tools-palette'
import AdvancedEvents from '@/modules/core/advanced-events'

export default class EraseTool {
  constructor (private tools: ToolsPalette, private events: AdvancedEvents, private state: ImageState) {
    this.tools.onInitTools.subscribe(() => ({ icon: <MdRemoveCircleOutline />, id: 'erase' }))
    this.events.onMouseDown.subscribe(this.handleMouseDown)
    this.events.onMouseMove.subscribe(this.handleMouseMove)
    this.events.onMouseUp.subscribe(this.handleMouseUp)
  }

  erasePixel = (mousepos: Point) => {
    const x = Math.floor((mousepos.x - this.state.offset.x) / this.state.zoom)
    const y = Math.floor((mousepos.y - this.state.offset.y) / this.state.zoom)

    this.state.pixels = this.state.pixels.filter(({ position: p }) => p.x !== x || p.y !== y)
  }

  private drawing = false
  private lastpos: Point | null = null

  handleMouseDown = (p: Point) => {
    if (this.tools.activeTool === 'erase') {
      this.drawing = true

      this.lastpos = p
      this.erasePixel(p)
    }
  }

  handleMouseMove = (p: Point) => {
    if (this.drawing) {
      /* Build a line of all pixels between */
      if (this.lastpos) {
        pixelizeLine({ from: this.lastpos, to: p }).forEach((p) => this.erasePixel(p))
      }

      this.lastpos = p
    }
  }

  handleMouseUp = (p: Point) => {
    this.drawing = false
  }
}
