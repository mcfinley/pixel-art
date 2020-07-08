import React from 'react'
import { MdBrush } from 'react-icons/md'

import { Point, pixelizeLine } from '@/utils/graphic'
import { RGBAColor } from '@/utils/colors'

import ImageLayers from '@/modules/core/image-layers'

import AdvancedEvents from '@/modules/core/advanced-events'
import ToolsManager from '@/modules/interface/tools-manager'

/**
 * Draw Tool - used to put pixels on layers
 */
export default class DrawTool {
  constructor (
    private toolsManager: ToolsManager, private events: AdvancedEvents, private layers: ImageLayers
  ) {
    /* Add a tool to tools manager */
    this.toolsManager.onInitTools.subscribe(() => ({ icon: <MdBrush />, id: 'draw' }))

    /* Handle events to actually draw */
    this.events.onMouseDown.subscribe(this.handleMouseDown)
    this.events.onMouseMove.subscribe(this.handleMouseMove)
    this.events.onMouseUp.subscribe(this.handleMouseUp)
  }

  /**
   * Transform coords from mouse to in-app
   */
  pixelPositionFromMousePosition = (mousePosition: Point) => ({
    x: Math.floor((mousePosition.x - this.layers.offset.x) / this.layers.zoom),
    y: Math.floor((mousePosition.y - this.layers.offset.y) / this.layers.zoom),
  })

  /**
   * Pixels manipulations API
   */
  addPixel = (position: Point, color: RGBAColor, tags: string[] = []) =>
    this.layers.updateActiveLayer((layer) => ({
      ...layer, pixels: layer.pixels.concat([{ position, color, tags }])
    }))

  filterPixels = (filterPredicate) =>
    this.layers.updateActiveLayer((layer) => ({
      ...layer, pixels: layer.pixels.filter(filterPredicate)
    }))

  /**
   * Events handling code
   */
  private drawing = false
  private lastpos: Point | null = null

  handleMouseDown = (p: Point) => {
    if (this.toolsManager.getTool() === 'draw') {
      this.drawing = true
      this.lastpos = p

      this.addPixel(this.pixelPositionFromMousePosition(p), this.toolsManager.getColor())
    }
  }

  handleMouseMove = (p: Point) => {
    if (this.drawing) {
      if (this.lastpos) {
        pixelizeLine({
          from: this.pixelPositionFromMousePosition(this.lastpos),
          to: this.pixelPositionFromMousePosition(p),
        }).forEach((p) => {
          this.addPixel(p, this.toolsManager.getColor())
        })
      }

      this.lastpos = p
    }
  }

  handleMouseUp = (p: Point) => {
    this.drawing = false
  }
}
