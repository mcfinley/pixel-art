import React from 'react'
import { MdBrush } from 'react-icons/md'

import { Point, pixelizeLine } from '@/utils/graphic'

import ImageState from '@/modules/core/image-state'
import ToolsPalette from '@/modules/core/tools-palette'
import AdvancedEvents from '@/modules/core/advanced-events'

export default class DragTool {
  constructor (private tools: ToolsPalette, private events: AdvancedEvents, private state: ImageState) {
    this.tools.onInitTools.subscribe(() => ({ icon: <MdBrush />, id: 'draw' }))
    this.events.onMouseDown.subscribe(this.handleMouseDown)
    this.events.onMouseMove.subscribe(this.handleMouseMove)
    this.events.onMouseUp.subscribe(this.handleMouseUp)
  }

  getPixelPosition = (mousePosition: Point) => {
    const x = Math.floor((mousePosition.x - this.state.offset.x) / this.state.zoom)
    const y = Math.floor((mousePosition.y - this.state.offset.y) / this.state.zoom)

    return { x, y }
  }

  colorPixel = (p: Point) => {
    this.state.pixels.push({ position: this.getPixelPosition(p), color: this.tools.activeColor })
  }

  private placeholderPixel: Point | null = null
  setPlaceholderPixel = (p: Point) => {
    if (p !== this.placeholderPixel) {
      this.state.pixels = this.state.pixels.filter(({ tags }) => !(tags || []).includes('draw-placeholder'))
      this.state.pixels.push({ position: this.getPixelPosition(p), color: { r: 200, g: 200, b: 200 }, tags: ['draw-placeholder'] })
      this.placeholderPixel = p
    }
  }

  private drawing = false
  private lastpos: Point | null = null
  handleMouseDown = (p: Point) => {
    if (this.tools.activeTool === 'draw') {
      this.drawing = true

      this.lastpos = p
      this.colorPixel(p)
    }
  }

  handleMouseMove = (p: Point) => {
    if (this.drawing) {
      /* Build a line of all pixels between */
      if (this.lastpos) {
        pixelizeLine({ from: this.lastpos, to: p }).forEach((p) => this.colorPixel(p))
      }

      this.lastpos = p
    }

    if (this.tools.activeTool === 'draw') {
      this.setPlaceholderPixel(p)
    }
  }

  handleMouseUp = (p: Point) => {
    this.drawing = false
  }
}
