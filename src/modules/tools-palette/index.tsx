import React from 'react'
import ReactDOM from 'react-dom'

import CoreModule from '../core-module'
import { EventEmitter } from '../../utils/events'

import Palette from './Palette'

export type Tool = { icon: React.ReactNode, id: string }

/*

  connect(() => ({
    active: this.active,
    onChange: () => this.
  }))(Palette)

*/

const connect = (propsResolver) => (Component) => class extends React.PureComponent {
  resolvedProps: any

  constructor (props) {
    super(props)

    this.resolvedProps = propsResolver()
  }

  render () {
    return <Component {...this.resolvedProps} />
  }
}

export default class ToolsPalette {
  public onInitTools = new EventEmitter<void>()
  public active: string | null = 'drag'

  constructor (private core: CoreModule) {
    this.core.onInitInterface.subscribe(this.initPalette)
  }

  initPalette = (node: HTMLElement) => {
    const paletteHost = document.createElement('div')
    node.appendChild(paletteHost)

    const tools = this.onInitTools.emitParallelSync() as Tool[]
    // const palette = new Palette({
    //   tools, active: this.active, onChange: (tool) => {
    //     this.active = tool
    //     palette.forceUpdate()
    //   }
    // })


    let palette: Palette

    ReactDOM.render((
      <Palette
        tools={tools}
        active={this.active}
        onChange={(tool) => {
          this.active = tool
          // palette.props.active = this.active
          palette.setActive()
        }}
        ref={(node) => palette = node}
      />
    ), paletteHost)
  }
}