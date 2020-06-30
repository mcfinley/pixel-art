import React from 'react'
import styled from 'styled-components'

import DialogOverlay from '../DialogOverlay'
import Card from '../../elements/Card'

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

type Props = { onChange: any }
type State = { dialog: { open: boolean, x: number, y: number} }

class PrefilledCanvas extends React.PureComponent<any> {
  canvasRef: HTMLCanvasElement = null
  assignCanvasRef = (node: HTMLCanvasElement) => this.canvasRef = node

  componentDidMount() {
    const { width, height } = this.canvasRef.getBoundingClientRect()

    this.canvasRef.width = width * 2
    this.canvasRef.height = height * 2

    const context = this.canvasRef.getContext('2d')

    context.scale(2, 2)

    this.props.fillPredicate(context, width, height)
  }

  render () {
    const { fillPredicate, ...props } = this.props

    return (
      <canvas {...props} ref={this.assignCanvasRef} style={{ width: '100%', height: '100%' }} />
    )
  }
}

export type HSLColor = { h: number, s: number, l: number }
export type RGBAColor = { r: number, g: number, b: number, a: number }

function _hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const hslToRgba = (hslColor: HSLColor) => {
  const [r,g,b] = _hslToRgb(hslColor.h, hslColor.s, hslColor.l)
  return { r,g,b,a: 255 }
}

let setPixelData: ImageData | null = null
const setPixel = (context: CanvasRenderingContext2D, x: number, y: number, color: RGBAColor) => {
  setPixelData = setPixelData ? setPixelData : context.createImageData(1, 1)

  if (setPixelData !== null) {
    setPixelData.data[0] = Math.floor(color.r)
    setPixelData.data[1] = Math.floor(color.g)
    setPixelData.data[2] = Math.floor(color.b)
    setPixelData.data[3] = Math.floor(color.a)
  }

  console.log('set')

  context.putImageData(setPixelData, x, y)
}

export default class ColorPicker extends React.PureComponent<Props, State> {
  state = { dialog: { open: false, x: 0, y: 0 } }

  openDialog = (e) =>
    this.setState({ dialog: { open: true, x: e.clientX + 10, y: e.clientY + 10 } })

  closeDialog = (e) =>
    this.setState({ dialog: { open: false, x: 0, y: 0 } })

  fillHue = (context: CanvasRenderingContext2D, width: number, height: number) => {
    for (let x = 0; x <= width; ++x) {
      const value = Math.floor((x / width) * 256)

      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, height)
      context.strokeStyle = `hsl(${value}, 100%, 40%)`
      context.stroke()
    }
  }

  fillRest = (value: number) => (context: CanvasRenderingContext2D, width: number, height: number) => {
    // console.log(width, height)
    const imageData = context.createImageData(width * 2, height * 2)
    for (let x = 0; x < width * 2; ++x) {
      for (let y = 0; y < height * 2; ++y) {
        const h = value / 256
        const s = x / width
        const l = 1 - ((y / height) / 2)

        const { r, g, b, a } = hslToRgba({ h, s, l })

        imageData.data[(x + y * width * 2) * 4 + 0] = r
        imageData.data[(x + y * width * 2) * 4 + 1] = g
        imageData.data[(x + y * width * 2) * 4 + 2] = b
        imageData.data[(x + y * width * 2) * 4 + 3] = a
      }
    }

    context.putImageData(imageData, 0, 0)
  }

  pickColor = (e) => {
    this.props.onChange(((e.clientX / 200) * 256) % 256)
  }

  render () {
    const { dialog } = this.state

    return (
      <>
        <ColorSquare color="#069" onClick={this.openDialog} />
        {dialog.open && (
          <DialogOverlay x={dialog.x} y={dialog.y} onClose={this.closeDialog}>
            <Card noShadow style={{ width: 200 }}>
              <div style={{ width: '100%', height: '30px' }}>
                <PrefilledCanvas fillPredicate={this.fillHue} onClick={this.pickColor} />
              </div>

              <div style={{ width: '100%', height: '100px' }}>
                <PrefilledCanvas fillPredicate={this.fillRest(160)} />
              </div>

              <div style={{ padding: 20 }}>
                It works!
              </div>
            </Card>
          </DialogOverlay>
        )}
      </>
    )
  }
}