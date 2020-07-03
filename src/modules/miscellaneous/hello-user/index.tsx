// import React from 'react'

import CoreModule from '../../core/core-module'

import { reactize } from '../../../utils/reactize'

import HelloHero from './HelloHero'

export default class ToolsPalette {
  constructor (private core: CoreModule) {
    this.core.onInitInterface.subscribe(this.initPalette)
  }

  private instance: any = null

  initPalette = (node: HTMLElement) => {
    const host = document.createElement('div')
    node.appendChild(host)

    /* Mount React Component */
    this.instance = reactize(HelloHero, host, {})
  }
}