import React from 'react'
import styled from 'styled-components'

import { Layer } from '@/modules/core/image-layers'
import Card from '@/components/elements/Card'
import LayerPreview from '@/components/molecules/LayerPreview'

const BottomCenterContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`

const ManagerHeading = styled.div`
  font-weight: 300;
  letter-spacing: 1px;
  font-size: 16px;
  padding: 8px 16px;
  background: #673ab7;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none
`

type Props = {
  layers: Layer[]
}

export default class LayersManager extends React.PureComponent<Props> {
  render () {
    const { layers } = this.props

    return (
      <BottomCenterContainer>
        <Card style={{ width: 300, padding: 0 }}>
          <ManagerHeading>
            <span>Layers</span>
            <strong>{layers.length}</strong>
          </ManagerHeading>

          {layers.map((layer, index) => (
            <LayerPreview key={index} layer={layer} />
          ))}
        </Card>
      </BottomCenterContainer>
    )
  }
}