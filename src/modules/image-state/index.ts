import CoreModule from '../core-module'

import { Point } from '../advanced-events'
import { RGBColor, rgbToHex } from '../../utils/colors'

export type Pixel = { position: Point, color: RGBColor }

const GRID_COLOR = `#ccc`

export default class ImageState {
  public zoom: number = 10 /* How many real pixels fit in image pixel */
  public offset: Point = { x: 50, y: 120 }

  /* Allow manupilating pixels directly TODO fix that */
  public pixels: Pixel[] = []

  constructor (private core: CoreModule) {
    this.core.onRender.subscribe(this.renderImage)
  }

  renderImage = (context: CanvasRenderingContext2D) => {
    /**
     * Render the grid
     */
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

    /**
     * Render pixels // TODO make it a put image data
     */
    context.translate(this.offset.x, this.offset.y)

    this.pixels.forEach(({ position, color }) => {
      context.beginPath()
      context.rect(position.x * this.zoom, position.y * this.zoom, this.zoom, this.zoom)
      context.fillStyle = rgbToHex(color)
      context.fill()
    })

    context.translate(-this.offset.x, -this.offset.y)
  }
}
