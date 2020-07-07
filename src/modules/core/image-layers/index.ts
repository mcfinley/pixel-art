import CoreModule from '@/modules/core/core-module'

import { EventEmitter } from '@/utils/events'
import { Point } from '@/utils/graphic'
import { RGBAColor, rgbaToHex } from '@/utils/colors'

const GRID_COLOR = `#dfdfdf`

export type Pixel = { position: Point, color: RGBAColor, tags: string[] }
export type Layer = { name: string, pixels: Pixel[] }

export default class ImageLayers {
  public zoom: number = 10 /* How many real pixels fit in image pixel */
  public offset: Point = { x: 50, y: 120 }

  private layers: Layer[] = [{ name: 'base', pixels: [] }]

  constructor (private core: CoreModule) {
    this.core.onRender.subscribe(this.render)
  }

  render = (context: CanvasRenderingContext2D) => {
    this.renderGrid(context)
    this.renderLayers(context)
  }

  /**
   * Render the grid
   */
  renderGrid = (context: CanvasRenderingContext2D) => {
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

     context.lineWidth = .5 * 1 * (1.5 - relativeDistanceFromCenter) + .0001
     context.beginPath()
     context.moveTo(x * this.zoom + firstVerticalLineOffset, 0)
     context.lineTo(x * this.zoom + firstVerticalLineOffset, height)
     context.stroke()
    }

    for (let y = 0; y < horizontalLinesCount; ++y) {
     const distanceFromCenter = Math.abs(y - (horizontalLinesCount / 2))
     const relativeDistanceFromCenter = distanceFromCenter / (horizontalLinesCount / 2)

     context.lineWidth = .7 * 1 * (1.5 - relativeDistanceFromCenter) + .0001
     context.beginPath()
     context.moveTo(0, y * this.zoom + firstHorizontalLineOffset)
     context.lineTo(width, y * this.zoom + firstHorizontalLineOffset)
     context.stroke()
    }
  }

  /**
   * Rendering layers
   */
  renderLayers = (context: CanvasRenderingContext2D) => {
    context.translate(this.offset.x, this.offset.y)

    this.layers.forEach(({ name, pixels }) => {
      pixels.forEach(({ position, color }) => {
        context.beginPath()
        context.rect(position.x * this.zoom, position.y * this.zoom, this.zoom, this.zoom)
        context.fillStyle = rgbaToHex(color)
        context.fill()
      })
    })

    context.translate(-this.offset.x, -this.offset.y)
  }

  /**
   * Layers read/write API
   */
  getLayers = () =>
    this.layers

  updateLayers = (predicate: (layers: Layer[]) => Layer[]) => {
    this.layers = predicate(this.layers)
    this.onLayersUpdate.emitSync()
  }

  updateLayer = (index, predicate: (layer: Layer) => Layer) =>
    this.updateLayers((layers) => layers.map((layer, i) => i === index ? predicate(layer) : layer))

  onLayersUpdate = new EventEmitter<void>()

  /**
   * Active layer feature
   */
  private activeLayerIndex: number = 0

  setActiveLayerIndex = (index: number) =>
    this.activeLayerIndex = index
  getActiveLayerIndex = () =>
    this.activeLayerIndex

  updateActiveLayer = (predicate: (layer: Layer) => Layer) =>
    this.updateLayer(this.activeLayerIndex, predicate)
}




