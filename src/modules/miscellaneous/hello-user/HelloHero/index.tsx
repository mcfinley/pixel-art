import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  flex-direction: column;
  user-select: none;
`

const Heading = styled.h1`
  margin-bottom: 0
`

const Paragraph = styled.p`
  margin-bottom: 0;
  font-weight: 300;
  text-align: center;
  line-height: 1.5;
`

export default () => (
  <Container>
    <Heading>Hi, User 👋</Heading>
    <Paragraph>
      Welcome to demo 2D pixel art design tool.{' '}
      <a href="#">Take a quick tour</a> or{' '}
      <a href="#">Visit project page</a>
    </Paragraph>
  </Container>
)