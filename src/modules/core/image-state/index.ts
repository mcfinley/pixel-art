import CoreModule from '@/modules/core/core-module'

import { Point } from '@/utils/graphic'
import { RGBColor, rgbToHex } from '@/utils/colors'
import { AnimatedValue } from '@/utils/animations'

export type Pixel = { position: Point, color: RGBColor, tags?: string[] }

const GRID_COLOR = `#dfdfdf`

export default class ImageState {
  public zoom: number = 10 /* How many real pixels fit in image pixel */
  public offset: Point = { x: 50, y: 120 }

  /* Allow manupilating pixels directly TODO fix that */
  public pixels: Pixel[] = []

  /* Animation value for first show of grid */
  private gridOpacity = new AnimatedValue(0, 500)

  constructor (private core: CoreModule) {
    this.core.onRender.subscribe(this.renderImage)
    this.gridOpacity.set(0)
    setTimeout(() => this.gridOpacity.set(1), 300)
  }

  renderImage = (context: CanvasRenderingContext2D) => {
    const opacity = this.gridOpacity.get()

    /**
     * Render the grid
     */
    const { width, height } = this.core.rect
    const verticalLinesCount = Math.ceil(width / this.zoom) + 1
    const horizontalLinesCount = Math.ceil(height / this.zoom) + 1
    const firstVerticalLineOffset = this.offset.x % this.zoom
    const firstHorizontalLineOffset = this.offset.y % this.zoom

    context.globalAlpha = this.zoom < 2 ? 0 : ((1/10) * (this.zoom - 2) * (this.zoom - 2))
    context.strokeStyle = GRID_COLOR

    for (let x = 0; x < verticalLinesCount; ++x) {
      const distanceFromCenter = Math.abs(x - (verticalLinesCount / 2))
      const relativeDistanceFromCenter = distanceFromCenter / (verticalLinesCount / 2)

      context.lineWidth = .5 * opacity * (1.5 - relativeDistanceFromCenter) + .0001
      context.beginPath()
      context.moveTo(x * this.zoom + firstVerticalLineOffset, 0)
      context.lineTo(x * this.zoom + firstVerticalLineOffset, height)
      context.stroke()
    }

    for (let y = 0; y < horizontalLinesCount; ++y) {
      const distanceFromCenter = Math.abs(y - (horizontalLinesCount / 2))
      const relativeDistanceFromCenter = distanceFromCenter / (horizontalLinesCount / 2)

      context.lineWidth = .7 * opacity * (1.5 - relativeDistanceFromCenter) + .0001
      context.beginPath()
      context.moveTo(0, y * this.zoom + firstHorizontalLineOffset)
      context.lineTo(width, y * this.zoom + firstHorizontalLineOffset)
      context.stroke()
    }

    context.globalAlpha = 1

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
