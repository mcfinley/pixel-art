import _ from 'lodash'

import CoreModule from '@/modules/core/core-module'
import ImageLayers from '@/modules/core/image-layers'

import LayersManagerView from '@/components/organisms/LayersManager'
import { reactize } from '@/utils/reactize'

export default class LayersManager {
  constructor (private core: CoreModule, private layers: ImageLayers) {
    this.core.onInitInterface.subscribe(this.setupInterface)
    this.layers.onLayersUpdate.subscribe(this.updateInstance)
  }

  private instance: any = null
  setupInterface = (root: HTMLElement) => {
    this.instance = reactize(LayersManagerView, root, {
      layers: this.layers.getLayers()
    })
  }

  updateInstance = _.debounce(() => {
    if (this.instance !== null) {
      this.instance.update({
        layers: this.layers.getLayers()
      })
    }
  }, 500)
}