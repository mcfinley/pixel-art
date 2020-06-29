import React from 'react'
import ReactDOM from 'react-dom'

import CoreModule from '../core-module'
import { EventEmitter } from '../../utils/events'

import Palette from './Palette'

export type ToolView = { icon: React.ReactNode, id: string }

export default class ToolsPalette {
  public onInitTools = new EventEmitter<void>()
  public active: string | null = 'drag'

  constructor (private core: CoreModule) {
    this.core.onInitInterface.subscribe(this.initPalette)
  }

  initPalette = (node: HTMLElement) => {
    const paletteHost = document.createElement('div')
    node.appendChild(paletteHost)

    const tools = this.onInitTools.emitParallelSync() as ToolView[]

    const updateTool = (tool: string) => {
      this.active = tool
      rerender()
    }

    let rerender = () => {
      ReactDOM.render((
        <Palette
          tools={tools}
          active={this.active}
          onChange={updateTool}
        />
      ), paletteHost)
    }

    rerender()
  }
}