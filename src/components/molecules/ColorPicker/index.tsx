import React from 'react'
import styled from 'styled-components'

import DialogOverlay from '../DialogOverlay'
import Card from '@/components/elements/Card'
import GeneratedCanvas from '@/components/elements/GeneratedCanvas'

import { RGBAColor, hslToRgb, rgbaToHex, hslaToRgba } from '../../../utils/colors'

const ColorSquare = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: ${props => props.color};
  cursor: pointer;

  transform: scale(1);
  transition: transform 50ms ease;

  &:hover {
    transform: scale(1.06);
  }
` as any

type Props = { value: RGBAColor, onChange: (color: RGBAColor) => void }
type State = { dialog: { open: boolean, x: number, y: number }, hue: number }

/**
 * Color Picker class
 */
export default class ColorPicker extends React.PureComponent<Props, State> {
  state = { dialog: { open: false, x: 0, y: 0 }, hue: 0 }

  openDialog = (e) =>
    this.setState({ dialog: { open: true, x: e.clientX + 10, y: e.clientY + 10 } })

  closeDialog = () =>
    this.setState({ dialog: { open: false, x: 0, y: 0 } })

  fillHue = (context: CanvasRenderingContext2D, width: number, height: number) => {
    for (let x = 0; x <= width; ++x) {
      const value = Math.floor((x / width) * 360)

      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, height)
      context.strokeStyle = `hsl(${value}, 100%, 40%)`
      context.stroke()
    }
  }

  fillRest = (value: number) => (context: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = context.createImageData(width * 2, height * 2)

    for (let x = 0; x < width * 2; ++x) {
      for (let y = 0; y < height * 2; ++y) {
        const h = value
        const s = x / width
        const l = 1 - ((y / height) / 2)

        const { r, g, b } = hslToRgb({ h, s, l })

        imageData.data[(x + y * width * 2) * 4 + 0] = r
        imageData.data[(x + y * width * 2) * 4 + 1] = g
        imageData.data[(x + y * width * 2) * 4 + 2] = b
        imageData.data[(x + y * width * 2) * 4 + 3] = 255
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  changeHue = (e) => {
    const rect = e.target.getBoundingClientRect()
    const hue = (e.clientX - rect.left) / rect.width

    this.setState({ hue })
  }

  pickColor = (e) => {
    const rect = e.target.getBoundingClientRect()
    const { hue } = this.state
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    this.props.onChange(hslaToRgba({ h: hue, s: x, l: 1-y, a: 1}))
    this.closeDialog()
  }

  render () {
    const { value } = this.props
    const { dialog } = this.state

    return (
      <>
        <ColorSquare color={rgbaToHex(value)} onClick={this.openDialog} />

        {dialog.open && (
          <DialogOverlay x={dialog.x} y={dialog.y} onClose={this.closeDialog}>
            <Card noShadow style={{ width: 200, height: 165 }}>
              <h4 style={{ padding: 8, margin: 0 }}>Color</h4>

              <GeneratedCanvas style={{ width: '100%', height: '30px' }} predicate={this.fillHue} onClick={this.changeHue} />
              <GeneratedCanvas key={this.state.hue} style={{ width: '100%', height: '100px' }} predicate={this.fillRest(this.state.hue)} onClick={this.pickColor} />
            </Card>
          </DialogOverlay>
        )}
      </>
    )
  }
}