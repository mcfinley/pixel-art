import React from 'react'
import styled, { css } from 'styled-components'
import { IconContext } from 'react-icons';

import { ToolView } from '..'

const LeftSideContainer = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: tranlsateY(-50%);
`

const Card = styled.div`
  background: white;
  border-radius: 5px;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, .1);
  overflow: hidden;
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
        </Card>
      </LeftSideContainer>
    )
  }
}