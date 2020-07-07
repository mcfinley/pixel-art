import CoreModule from '@/modules/core/core-module'
import ImageLayers from '@/modules/core/image-layers'

import LayersManagerView from '@/components/organisms/LayersManager'
import { reactize } from '@/utils/reactize'

export default class LayersManager {
  constructor (private core: CoreModule, private layers: ImageLayers) {
    this.core.onInitInterface.subscribe(this.setupInterface)
  }

  private instance: any = null
  setupInterface = (root: HTMLElement) => {
    this.instance = reactize(LayersManagerView, root, {
      layers: this.layers.layers
    })
  }
}