class Point {
  constructor (public x: number, public y: number) {

  }
}

type Id = string
type ElementsCollection = Map<Id, Element>

const getValueFromCollectionByPath = (path: string, collection: ElementsCollection) => {
  const [id, index] = path.split('/')

  const element = collection.get(id)
  return element.outputs[index]
}

const isPathReadyToUpdate = (path: string, collection: ElementsCollection) => {
  const [id, index] = path.split('/')

  const element = collection.get(id)
  return element.updated
}

class Element {
  public inputs: string[] = []
  public outputs: boolean[] = []
  public updated: boolean = false

  update (collection: ElementsCollection) {
    throw new Error(`Update not implemented for ${this}`)
  }

  render (ctx: CanvasRenderingContext2D) {
    throw new Error(`Render not implemented for ${this}`)
  }
}

class Toggle extends Element {
  position: Point


  constructor (position: Point, value: boolean) {
    super()

    this.position = position
    this.outputs = [value]
  }

  update (/* no inputs */) {
    // nothing happens
  }

  render (ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position

    ctx.fillStyle = this.outputs[0] ? 'black' : 'white'
    ctx.fillRect(x, y, 20, 20)
  }
}

// class Wire extends Element {
//   constructor (private fromPaths: string[]) {
//     super()
//   }
//
//   update (collection: ElementsCollection) {
//     this.outputs = [this.fromPaths.reduce((acc, path) => {
//       return acc || getValueFromCollectionByPath(path, collection)
//     }, false)]
//   }
//
//   render (ctx: CanvasRenderingContext2D) {
//     /* Don't render wires for now */
//   }
// }

class Or extends Element {
  constructor (private position: Point, private fromPaths: string[]) {
    super()
  }

  update (collection: ElementsCollection) {
    this.outputs = [this.fromPaths.reduce((acc, path) => {
      return acc || getValueFromCollectionByPath(path, collection)
    }, false)]
  }

  render (ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position

    ctx.fillStyle = this.outputs[0] ? 'black' : 'white'
    ctx.fillRect(x, y, 30, 30)
  }
}

export default class QuintusElements {
  private idCounter = 0
  public elements: Map<Id, Element> = new Map()

  constructor () {
    let toggle1 = this.addElement(new Toggle(new Point(0, 0), false))
    let toggle2 = this.addElement(new Toggle(new Point(20, 20), false))

    let or1 = this.addElement(new Or(new Point(50, 10), [
      // `${toggle1}/0`,
      // `${toggle2}/0`
    ]))
    let or2 = this.addElement(new Or(new Point(85, 10), [
      // `${toggle1}/0`,
      // `${toggle2}/0`
    ]))

    this.elements.get(or1).inputs = [`${toggle1}/0`, `${or2}/0`]
    this.elements.get(or2).inputs = [`${toggle2}/0`, `${or1}/0`]

    // or1.inputs = []

    this.update();

    (window as any).c = this

    // let wire1 = this.addElement(new Wire(this.elements, toggle1, and))
    // let wire2 = this.addElement(new Wire(this.elements, toggle1, and))

    // this.addElement(new Toggle(new Point(0, 0), true))
    // this.elements.set(this.idCounter++, new Wire(new Point(0, 0), true))
  }

  update () {
    for (const [index, element] of this.elements.entries()) {
      element.updated = false
      // console.log(index, element)
    }

    for (const [index, element] of this.elements.entries()) {
      element.update(this.elements)
      // console.log(index, element)
    }
  }

  addElement (element: Element) {
    const id = (this.idCounter++).toString()

    this.elements.set(id, element)

    return id
  }
}