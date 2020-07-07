import CoreModule from '@/modules/core/core-module'

import { EventEmitter } from '@/utils/events'
import { reactize } from '@/utils/reactize'
import { RGBAColor } from '@/utils/colors'

import ToolsManagerView from '@/components/organisms/ToolsManager'

export type ToolView = { icon: React.ReactNode, id: string }

export default class ToolsManager {
  public onInitTools = new EventEmitter<void>()

  constructor (private core: CoreModule) {
    this.core.onInitInterface.subscribe(this.setupToolsManager)
  }

  private tool = 'drag'
  setTool = (tool) => { this.tool = tool; this.updateInstance(); }
  getTool = () => this.tool

  private color: RGBAColor = { r: 255, g: 100, b: 20, a: 255 }
  setColor = (color) => { this.color = color; this.updateInstance(); }
  getColor = () => this.color

  private instance: any = null
  setupToolsManager = (host: HTMLElement) => {
    const tools = this.onInitTools.emitParallelSync() as ToolView[]

    this.instance = reactize(ToolsManagerView, host, {
      tools,
      tool: this.getTool(),
      color: this.getColor(),
      onChangeTool: this.setTool,
      onChangeColor: this.setColor
    })
  }

  updateInstance = () => {
    if (this.instance !== null) {
      this.instance.update({
        tool: this.getTool(),
        color: this.getColor()
      })
    }
  }
}


