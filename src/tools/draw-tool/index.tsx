import React from 'react'
import { MdBrush } from 'react-icons/md'

import ImageState from '../../modules/image-state'
import ToolsPalette from '../../modules/tools-palette'
import AdvancedEvents, { Point } from '../../modules/advanced-events'

export default class DragTool {
  constructor (private tools: ToolsPalette, private events: AdvancedEvents, private state: ImageState) {
    this.tools.onInitTools.subscribe(() => ({ icon: <MdBrush />, id: 'draw' }))

    this.events.onClick.subscribe(this.handleClick)
  }

  handleClick = (p: Point) => {
    if (this.tools.active === 'draw') {
      const x = Math.floor((p.x - this.state.offset.x) / this.state.zoom)
      const y = Math.floor((p.y - this.state.offset.y) / this.state.zoom)

      this.state.pixels.push({ position: { x, y }, color: { r: 255, g: 0, b: 100 }})
    }
  }
}
