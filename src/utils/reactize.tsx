import React from 'react'
import ReactDOM from 'react-dom'

export const reactize = (Component, host, props) => {
  let ref = null
  let rerender = (p) => ReactDOM.render(<Component ref={(n) => ref = n} {...p} />, host)
  rerender(props)

  return {
    update: (_props) => {
      props = { ...props, ..._props }
      rerender(props)
    },
  }
}