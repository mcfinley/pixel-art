import React from 'react'
import styled from 'styled-components'

import { rgbaToHex } from '@/utils/colors'
import { Layer } from '@/modules/core/image-layers'
import GeneratedCanvas from '@/components/elements/GeneratedCanvas'

const InlineWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`

const LayerWindow = styled(GeneratedCanvas)`
  width: 40px;
  height: 40px;
`

const LayerName = styled.div`
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: capitalize;
`

/**
 * Layer Row Preview (inline display)
 */
export default class LayerPreview extends React.PureComponent<{ layer: Layer }> {
  render () {
    const { layer } = this.props

    return (
      <InlineWrap>
        <LayerWindow key={Math.random()} predicate={this.generateCanvas(layer)} />
        <LayerName style={{ marginLeft: 12 }}>{layer.name}</LayerName>
      </InlineWrap>
    )
  }

  generateCanvas = (layer: Layer) =>
    (context: CanvasRenderingContext2D, width: number, height: number) => {
      let minx = layer.pixels.reduce((acc, { position }) => Math.min(acc, position.x), Infinity) - 1
      let miny = layer.pixels.reduce((acc, { position }) => Math.min(acc, position.y), Infinity) - 1
      let maxx = layer.pixels.reduce((acc, { position }) => Math.max(acc, position.x), -Infinity) + 1
      let maxy = layer.pixels.reduce((acc, { position }) => Math.max(acc, position.y), -Infinity) + 1

      const pixelSize = Math.min(width, height) / Math.max(maxx - minx, maxy - miny)
      const offsetx = (maxx + minx) / 2
      const offsety = (maxy + miny) / 2

      context.translate(width / 2 - pixelSize / 2, height / 2 - pixelSize / 2)

      layer.pixels.forEach(({ position, color }) => {
        context.beginPath()
        context.rect((position.x - offsetx) * pixelSize, (position.y - offsety) * pixelSize, pixelSize, pixelSize)
        context.fillStyle = rgbaToHex(color)
        context.fill()
      })

      context.translate(-width / 2 + pixelSize / 2, -height / 2 + pixelSize / 2)
    }
}