import React from 'react'
import { MdBrush } from 'react-icons/md'

import { Point, pixelizeLine } from '@/utils/graphic'
import { RGBAColor } from '@/utils/colors'

import ImageLayers from '@/modules/core/image-layers'

import AdvancedEvents from '@/modules/core/advanced-events'
import ToolsManager from '@/modules/interface/tools-manager'

export default class DragTool {
  constructor (private toolsManager: ToolsManager, private events: AdvancedEvents, private layers: ImageLayers) {
    this.toolsManager.onInitTools.subscribe(() => ({ icon: <MdBrush />, id: 'draw' }))

    this.events.onMouseDown.subscribe(this.handleMouseDown)
    this.events.onMouseMove.subscribe(this.handleMouseMove)
    this.events.onMouseUp.subscribe(this.handleMouseUp)
  }

  getPixelPosition = (mousePosition: Point) => {
    const x = Math.floor((mousePosition.x - this.layers.offset.x) / this.layers.zoom)
    const y = Math.floor((mousePosition.y - this.layers.offset.y) / this.layers.zoom)

    return { x, y }
  }

  addPixel = (position: Point, color: RGBAColor, tags: string[] = []) =>
    this.layers.updateActiveLayer((layer) => ({
      ...layer, pixels: layer.pixels.concat([{ position, color, tags }])
    }))

  filterPixels = (filterPredicate) =>
    this.layers.updateActiveLayer((layer) => ({
      ...layer, pixels: layer.pixels.filter(filterPredicate)
    }))

  // colorPixel = (p: Point) =>

  // private placeholderPixel: Point | null = null
  // setPlaceholderPixel = (p: Point) => {
  //   if (p !== this.placeholderPixel) {
  //     this.filterPixels(({ tags }) => !tags.includes('draw-placeholder'))
  //     this.addPixel(this.getPixelPosition(p), { r: 200, g: 200, b: 200, a: 255 })
  //     this.placeholderPixel = p
  //   }
  // }

  private drawing = false
  private lastpos: Point | null = null
  handleMouseDown = (p: Point) => {
    if (this.toolsManager.getTool() === 'draw') {
      this.drawing = true

      this.lastpos = p
      this.addPixel(this.getPixelPosition(p), this.toolsManager.getColor())
    }
  }

  handleMouseMove = (p: Point) => {
    if (this.drawing) {
      /* Build a line of all pixels between */
      if (this.lastpos) {
        pixelizeLine({ from: this.lastpos, to: p }).forEach((p) => {
          this.addPixel(this.getPixelPosition(p), this.toolsManager.getColor())
        })
      }

      this.lastpos = p
    }

    // if (this.toolsManager.getTool() === 'draw') {
    //   this.setPlaceholderPixel(p)
    // }
  }

  handleMouseUp = (p: Point) => {
    this.drawing = false
  }
}
