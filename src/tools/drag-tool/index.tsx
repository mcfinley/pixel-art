import React from 'react'
import ToolsPalette from '../../modules/tools-palette'
import { MdBrush, MdZoomOutMap } from 'react-icons/md'

export default class DragTool {
  constructor (private tools: ToolsPalette) {
    this.tools.onInitTools.subscribe(() =>
      ({ icon: <MdZoomOutMap />, id: 'drag' })
    )
    this.tools.onInitTools.subscribe(() =>
      ({ icon: <MdBrush />, id: 'draw' })
    )
  }
}