import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .7);
  cursor: pointer;
`

const Positioned = styled.div`
  position: absolute;
  top: ${(props: any) => props.top}px;
  left: ${(props: any) => props.left}px;
` as any

type Props = { x: number, y: number, onClose: (...args: any) => void }

export default class DialogOverlay extends React.PureComponent<Props> {
  render () {
    const { x, y, children, onClose } = this.props

    return (
      <Wrap onClick={onClose}>
        <Positioned left={x} top={y} onClick={this.stopPropagation}>
          {children}
        </Positioned>
      </Wrap>
    )
  }

  stopPropagation = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopPropagation()
  }
}