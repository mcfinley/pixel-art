import React from 'react'
import { MdBrush, MdRemoveCircleOutline } from 'react-icons/md'

import { Point, pixelizeLine } from '@/utils/graphic'

import ImageLayers from '@/modules/core/image-layers'
import ToolsManager from '@/modules/interface/tools-manager'
import AdvancedEvents from '@/modules/core/advanced-events'

export default class EraseTool {
  constructor (private toolsManager: ToolsManager, private events: AdvancedEvents, private layers: ImageLayers) {
    this.toolsManager.onInitTools.subscribe(() => ({ icon: <MdRemoveCircleOutline />, id: 'erase' }))

    this.events.onMouseDown.subscribe(this.handleMouseDown)
    this.events.onMouseMove.subscribe(this.handleMouseMove)
    this.events.onMouseUp.subscribe(this.handleMouseUp)
  }

  erasePixel = (mousepos: Point) => {
    const x = Math.floor((mousepos.x - this.layers.offset.x) / this.layers.zoom)
    const y = Math.floor((mousepos.y - this.layers.offset.y) / this.layers.zoom)

    this.layers.updateActiveLayer((layer) => ({
      ...layer, pixels: layer.pixels.filter(({ position: p }) => p.x !== x || p.y !== y)
    }))
  }

  private drawing = false
  private lastpos: Point | null = null

  handleMouseDown = (p: Point) => {
    if (this.toolsManager.getTool() === 'erase') {
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
