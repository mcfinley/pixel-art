import React from 'react'
import styled, { css } from 'styled-components'
import { IconContext } from 'react-icons';

import { ToolView } from '..'
import { RGBAColor } from '../../../utils/colors'
import Card from '../../../components/elements/Card'
import ColorPicker from '../../../components/molecules/ColorPicker'

const LeftSideContainer = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: tranlsateY(-50%);
`

const Tools = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direciton: column;
  flex-wrap: wrap;
  width: 68px;
`

const Tool = styled.div`
  width: calc(50% - 12px);
  padding: 6px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }

  ${(props: any) => !!props.active && css`
    background: #eee;
  `}
` as any

const ColorPickerArea = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`

const ColorPickerWrap = styled.div`
  width: 30px;
  height: 30px;
`

type Props = {
  tools: ToolView[],
  tool: string | null,
  color: RGBAColor | null,
  onChangeTool: (tool: string) => void,
  onChangeColor: any
}

export default class Palette extends React.PureComponent<Props> {
  pickColor = (v) => this.props.onChangeColor(v)

  render () {
    return (
      <LeftSideContainer>
        <Card style={{ marginLeft: 12 }}>
          <Tools>
            <IconContext.Provider value={{ color: '#069', size: '20px' }}>
              {this.props.tools.map((tool) => (
                <Tool key={tool.id} active={tool.id === this.props.tool} onClick={() => this.props.onChangeTool(tool.id)}>
                  {tool.icon}
                </Tool>
              ))}
            </IconContext.Provider>
          </Tools>

          <ColorPickerArea>
            <ColorPickerWrap>
              <ColorPicker value={this.props.color} onChange={this.props.onChangeColor} />
            </ColorPickerWrap>
          </ColorPickerArea>
        </Card>
      </LeftSideContainer>
    )
  }
}