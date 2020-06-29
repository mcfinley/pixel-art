import CoreModule from '../core-module'

import { Point } from '../advanced-events'

// export type Point = { x: number, y: number }
export type Color = { r: number, g: number, b: number }
export type Pixel = { position: Point, color: Color }

const GRID_COLOR = `#ccc`

export default class ImageState {
  pixels: Pixel[] = [
    { position: { x: 0, y: 0 }, color: { r: 255, g: 255, b: 0 }},
    // { position: { x: 2, y: 0 }, color: { r: 255, g: 255, b: 0 }},
  ]
  public zoom: number = 10 /* How many real pixels fit in image pixel */
  public offset: Point = { x: 50, y: 120 }

  constructor (private core: CoreModule) {
    this.core.onRender.subscribe(this.renderImage)
  }

  renderImage = (context: CanvasRenderingContext2D) => {
    /* Render the grid */

    const { width, height } = this.core.rect
    const verticalLinesCount = Math.ceil(width / this.zoom) + 1
    const horizontalLinesCount = Math.ceil(height / this.zoom) + 1
    const firstVerticalLineOffset = this.offset.x % this.zoom
    const firstHorizontalLineOffset = this.offset.y % this.zoom

    context.lineWidth = 0.7
    context.strokeStyle = GRID_COLOR

    for (let x = 0; x < verticalLinesCount; ++x) {
      context.beginPath()
      context.moveTo(x * this.zoom + firstVerticalLineOffset, 0)
      context.lineTo(x * this.zoom + firstVerticalLineOffset, height)
      context.stroke()
    }

    for (let y = 0; y < horizontalLinesCount; ++y) {
      context.beginPath()
      context.moveTo(0, y * this.zoom + firstHorizontalLineOffset)
      context.lineTo(width, y * this.zoom + firstHorizontalLineOffset)
      context.stroke()
    }

    /* Render pixels */

    context.translate(this.offset.x, this.offset.y)

    this.pixels.forEach(({ position, color }) => {
      context.beginPath()
      context.rect(position.x * this.zoom, position.y * this.zoom, this.zoom, this.zoom)
      context.fillStyle = colorToString(color)
      context.fill()
    })

    context.translate(-this.offset.x, -this.offset.y)
  }
}

/* Helpers */

const colorToString = (color: Color) => `rgb(${color.r},${color.g},${color.b})`