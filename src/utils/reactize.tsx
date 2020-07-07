import React from 'react'
import ReactDOM from 'react-dom'

export const reactize = (Component: any, _host: HTMLElement, props: any) => {
  let host = document.createElement('div')
  let ref = null
  let rerender = (p) => ReactDOM.render(<Component ref={(n) => ref = n} {...p} />, host)

  _host.appendChild(host)
  rerender(props)

  return {
    update: (_props) => {
      props = { ...props, ..._props }
      rerender(props)
    },
  }
}