import styled, { css } from 'styled-components'

export default styled.div`
  background: white;
  border-radius: 8px;

  overflow: hidden;

  ${(props: any) => props.noShadow ? '' : css`
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, .1);
  `}
` as any