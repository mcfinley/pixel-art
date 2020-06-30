import React from 'react'
import { MdBrush } from 'react-icons/md'

import ImageState from '../../modules/image-state'
import ToolsPalette from '../../modules/tools-palette'
import AdvancedEvents, { Point } from '../../modules/advanced-events'

import { hslToRgba } from '../../components/molecules/ColorPicker'

export default class DragTool {
  constructor (private tools: ToolsPalette, private events: AdvancedEvents, private state: ImageState) {
    this.tools.onInitTools.subscribe(() => ({ icon: <MdBrush />, id: 'draw' }))
    this.events.onClick.subscribe(this.handleClick)
  }

  handleClick = (p: Point) => {
    if (this.tools.active === 'draw') {
      const x = Math.floor((p.x - this.state.offset.x) / this.state.zoom)
      const y = Math.floor((p.y - this.state.offset.y) / this.state.zoom)

      const { r, g, b } = hslToRgba({ h: this.tools.color / 256, s: 1, l: 0.5 })

      this.state.pixels.push({ position: { x, y }, color: { r, g, b }})
    }
  }
}
