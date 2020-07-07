import React from 'react'

export default class PrefilledCanvas extends React.PureComponent<any> {
  canvasRef: HTMLCanvasElement
  assignCanvasRef = (node: HTMLCanvasElement) => this.canvasRef = node

  componentDidMount() {
    const { width, height } = this.canvasRef.getBoundingClientRect()

    this.canvasRef.width = width * 2
    this.canvasRef.height = height * 2

    const context = this.canvasRef.getContext('2d')

    if (context) {
      context.scale(2, 2) // TODO hack
      this.props.predicate(context, width, height)
    }
  }

  render () {
    const { predicate, ...props } = this.props

    return (
      <canvas {...props} ref={this.assignCanvasRef} />
    )
  }
}