export type Point = { x: number, y: number }
export type Line = { from: Point, to: Point }

export const pixelizeLine = (line: Line): Point[] => {
  /* Decide whether we should go horizontal or vertical */
  if (Math.abs(line.to.x - line.from.x) > Math.abs(line.to.y - line.from.y)) {
    /* Go horizontal left to right */
    const startx = Math.min(line.to.x, line.from.x) // always increases
    const starty = startx === line.from.x ? line.from.y : line.to.y
    const ydiff = startx === line.from.x ? (line.to.y - line.from.y) : (line.from.y - line.to.y)

    const length = Math.abs(line.to.x - line.from.x)

    return new Array(length).fill(0).map((_, index) => (
      { x: index + startx, y: starty + ydiff * (index / length) }
    ))
  } else {
    /* Go vertical bottom to top */
    const starty = Math.min(line.to.y, line.from.y) // always increases
    const startx = starty === line.from.y ? line.from.x : line.to.x
    const xdiff = starty === line.from.y ? (line.to.x - line.from.x) : (line.from.x - line.to.x)

    const length = Math.abs(line.to.y - line.from.y)

    return new Array(length).fill(0).map((_, index) => (
      { y: index + starty, x: startx + xdiff * (index / length) }
    ))
  }

}
