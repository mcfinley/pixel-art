import { EventEmitter } from '@/utils/events'
import { Point } from '@/utils/graphic'

import CoreModule from '@/modules/core/core-module'

/**
 * This plugin handles html events and forwards them
 * into "drag", "click" etc
 */
export default class AdvancedEvents {
  public onMouseDown = new EventEmitter<Point>()
  public onMouseUp = new EventEmitter<Point>()
  public onMouseMove = new EventEmitter<Point>()
  public onDrag = new EventEmitter<Point>()
  public onClick = new EventEmitter<Point>()
  public onZoom = new EventEmitter<Point & { delta: number }>()
  public onKey = new EventEmitter<number>()
  public onKeyDown = new EventEmitter<number>()
  public onKeyUp = new EventEmitter<number>()

  private lastmousepos: Point
  private mousepressed = false

  constructor (private core: CoreModule) {
    this.core.root.addEventListener('mousedown', (e) => {
      const { clientX: x, clientY: y } = e

      this.lastmousepos = { x, y }
      this.mousepressed = true

      this.onMouseDown.emitSync({ x, y })
      // console.log('onMouseDown', { x, y })
    })

    this.core.root.addEventListener('mousemove', (e) => {
      const { clientX: x, clientY: y } = e

      if (this.mousepressed) {
        const offsetx = x - this.lastmousepos.x, offsety = y - this.lastmousepos.y

        this.onDrag.emitSync({ x: offsetx, y: offsety })
        this.lastmousepos = { x, y }
        // console.log('ondrag', { x: offsetx, y: offsety })
      }

      this.onMouseMove.emitSync({ x, y })
      // console.log('onMouseMove', { x, y })
    })

    this.core.root.addEventListener('mouseup', (e) => {
      const { clientX: x, clientY: y } = e

      if (this.mousepressed) {
        const offsetx = this.lastmousepos.x - x, offsety = this.lastmousepos.y - y

        if (Math.abs(offsetx) + Math.abs(offsety) < 20) {
          this.onClick.emitSync({ x, y })
          // console.log('onClick', { x, y })
        }

        this.mousepressed = false
      }

      this.onMouseUp.emitSync({ x, y })
      // console.log('onMouseUp', { x, y })
    })

    this.core.root.addEventListener('mousewheel', (e: any) => {
      const { clientX: x, clientY: y } = e

      this.onZoom.emitSync({ x, y, delta: e.deltaY })
      e.preventDefault()
    })

    document.addEventListener('keydown', (e: any) => {
      // console.log(e)
      this.onKeyDown.emitSync(e.keyCode)
      this.onKey.emitSync(e.keyCode)
    })

    document.addEventListener('keyup', (e: any) => {
      // console.log(e)
      this.onKeyUp.emitSync(e.keyCode)
    })
  }
}