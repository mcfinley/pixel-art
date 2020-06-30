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

type Props = {}
type State = { dialog: { open: boolean, x: number, y: number} }

export default class ColorPicker extends React.PureComponent<Props, State> {
  state = { dialog: { open: false, x: 0, y: 0 } }

  openDialog = (e) =>
    this.setState({ dialog: { open: true, x: e.clientX + 10, y: e.clientY + 10 } })

  closeDialog = (e) =>
    this.setState({ dialog: { open: false, x: 0, y: 0 } })

  render () {
    const { dialog } = this.state

    return (
      <>
        <ColorSquare color="#069" onClick={this.openDialog} />
        {dialog.open && (
          <DialogOverlay x={dialog.x} y={dialog.y} onClose={this.closeDialog}>
            <Card noShadow>
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