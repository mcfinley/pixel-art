import CoreModule from '@/modules/core/core-module'

import LayersManagerView from '@/components/organisms/LayersManager'
import { reactize } from '@/utils/reactize'

export default class LayersManager {
  constructor (private core: CoreModule) {
    this.core.onInitInterface.subscribe(this.setupInterface)
  }

  setupInterface = (root: HTMLElement) => {
    reactize(LayersManagerView, root, {
      layers: [
        { name: 'test', pixels: [
          { position: { x: 0, y: 0 }, color: { r: 255, g: 255, b: 0, a: 255 }}
        ]}
      ]
    })
  }
}