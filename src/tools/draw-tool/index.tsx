import React from 'react'
import { MdBrush } from 'react-icons/md'

import ImageState from '../../modules/image-state'
import ToolsPalette from '../../modules/tools-palette'
import AdvancedEvents, { Point } from '../../modules/advanced-events'

export type Line = { from: Point, to: Point }

export default class DragTool {
  constructor (private tools: ToolsPalette, private events: AdvancedEvents, private state: ImageState) {
    this.tools.onInitTools.subscribe(() => ({ icon: <MdBrush />, id: 'draw' }))
    this.events.onMouseDown.subscribe(this.handleMouseDown)
    this.events.onMouseMove.subscribe(this.handleMouseMove)
    this.events.onMouseUp.subscribe(this.handleMouseUp)
  }

  colorPixel = (p: Point) => {
    const x = Math.floor((p.x - this.state.offset.x) / this.state.zoom)
    const y = Math.floor((p.y - this.state.offset.y) / this.state.zoom)

    this.state.pixels.push({ position: { x, y }, color: this.tools.activeColor })
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
      pixelizeLine({ from: this.lastpos, to: p }).forEach((p) => this.colorPixel(p))
      this.lastpos = p
    }
  }

  handleMouseUp = (p: Point) => {
    this.drawing = false
  }
}

/* Helpers */
const pixelizeLine = (line: Line): Point[] => {
  /* Decide whether we should go horizontal or vertical */
  if (Math.abs(line.to.x - line.from.x) > Math.abs(line.to.y - line.from.y)) {
    /* Go horizontal left to right */
    const startx = Math.min(line.to.x, line.from.x) // always increases
    const starty = startx === line.from.x ? line.from.y : line.to.y
    const ydiff = startx === line.from.x ? (line.to.y - line.from.y) : (line.from.y - line.to.y)

    const length = Math.abs(line.to.x - line.from.x)

    return new Array(length).fill(0).map((_, index) => (
      { x: index + startx, y: starty + ydiff * (index / length) }
    ))
  } else {
    /* Go vertical bottom to top */
    const starty = Math.min(line.to.y, line.from.y) // always increases
    const startx = starty === line.from.y ? line.from.x : line.to.x
    const xdiff = starty === line.from.y ? (line.to.x - line.from.x) : (line.from.x - line.to.x)

    const length = Math.abs(line.to.y - line.from.y)

    return new Array(length).fill(0).map((_, index) => (
      { y: index + starty, x: startx + xdiff * (index / length) }
    ))
  }

}
