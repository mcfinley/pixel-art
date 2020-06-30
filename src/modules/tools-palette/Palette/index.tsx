import React from 'react'
import styled, { css } from 'styled-components'
import { IconContext } from 'react-icons';

import { ToolView } from '..'
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
  width: 102px;
`

const Tool = styled.div`
  width: calc(50% - 24px);
  padding: 12px;
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
  padding: 20px 0;
`

const ColorPickerWrap = styled.div`
  width: 40px;
  height: 40px;
`

type Props = { tools: ToolView[], active: string | null, onChange: (tool: string) => void }

export default class Palette extends React.PureComponent<Props> {
  render () {
    return (
      <LeftSideContainer>
        <Card style={{ marginLeft: 12 }}>
          <Tools>
            <IconContext.Provider value={{ color: '#069', size: '24px' }}>
              {this.props.tools.map((tool) => (
                <Tool key={tool.id} active={tool.id === this.props.active} onClick={() => this.props.onChange(tool.id)}>
                  {tool.icon}
                </Tool>
              ))}
            </IconContext.Provider>
          </Tools>

          <ColorPickerArea>
            <ColorPickerWrap>
              <ColorPicker />
            </ColorPickerWrap>
          </ColorPickerArea>
        </Card>
      </LeftSideContainer>
    )
  }
}