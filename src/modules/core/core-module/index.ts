import { EventEmitter } from '../../../utils/events'

export type Rect = { width: number, height: number }

const RESOLUTION_FACTOR = 2

/**
 * Core Module plugin initializes html node, creats canvas and sets up rendering cycle
 */
export default class CoreModule {
  public rect: Rect
  public canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public interface: HTMLElement

  public onRender = new EventEmitter<CanvasRenderingContext2D>()
  public onInitInterface = new EventEmitter<HTMLElement>()

  constructor (public root: HTMLElement) {
    /**
     * Canvas section
     */
    this.rect = this.root.getBoundingClientRect();
    this.canvas = document.createElement('canvas')

    this.canvas.style.width = this.rect.width + 'px'
    this.canvas.style.height = this.rect.height + 'px'
    this.canvas.width = this.rect.width * RESOLUTION_FACTOR
    this.canvas.height = this.rect.height * RESOLUTION_FACTOR

    this.root.appendChild(this.canvas)

    const unsafeContext = this.canvas.getContext('2d')

    if (!unsafeContext) {
      alert('There was an error trying to get 2d context from canvas')
      throw new Error('context not retreivable')
    }

    this.context = unsafeContext
    this.context.scale(RESOLUTION_FACTOR, RESOLUTION_FACTOR)

    requestAnimationFrame(this.render)

    /**
     * Interface section (creates a node, adds hooks)
     */
    this.interface = document.createElement('div')

    this.interface.style.position = 'absolute'
    this.interface.style.top = '0px'
    this.interface.style.left = '0px'
    this.interface.style.width = '100vw'
    this.interface.style.height = '100vh'

    this.root.appendChild(this.interface)

    setTimeout(() => this.onInitInterface.emitSync(this.interface), 0)
  }

  /**
   * Constantly rerender the canvas on the background
   */
  render = () => {
    this.context.clearRect(0, 0, Math.max(this.rect.width, this.rect.width * RESOLUTION_FACTOR), Math.max(this.rect.height, this.rect.height * RESOLUTION_FACTOR))
    /* Emit render (other modules can put code here ) */
    this.onRender.emitSync(this.context)
    // this.context.scale(1 / RESOLUTION_FACTOR, 1 / RESOLUTION_FACTOR)
    requestAnimationFrame(this.render)
  }
}
