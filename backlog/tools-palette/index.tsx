import React from 'react'

import CoreModule from '@/modules/core/core-module'

import { EventEmitter } from '@/utils/events'
import { reactize } from '@/utils/reactize'
import { RGBAColor } from '@/utils/colors'

import Palette from './Palette'

export type ToolView = { icon: React.ReactNode, id: string }

export default class ToolsPalette {
  public onInitTools = new EventEmitter<void>()
  public activeTool: string = 'drag'
  public activeColor: RGBAColor = { r: 0, g: 60, b: 90, a: 255 }

  constructor (private core: CoreModule) {
    this.core.onInitInterface.subscribe(this.initPalette)
  }

  private instance: any = null

  updateTool = (toolId: string) => {
    this.activeTool = toolId
    this.instance.update({ tool: this.activeTool })
  }

  updateColor = (color: RGBAColor) => {
    console.log(color)
    this.activeColor = color
    this.instance.update({ color: this.activeColor })
  }

  initPalette = (node: HTMLElement) => {
    const paletteHost = document.createElement('div')
    node.appendChild(paletteHost)

    const tools = this.onInitTools.emitParallelSync() as ToolView[]

    /* Mount React Component */
    this.instance = reactize(Palette, paletteHost, {
      tools,
      tool: this.activeTool,
      color: this.activeColor,
      onChangeTool: this.updateTool,
      onChangeColor: this.updateColor
    })
  }
}