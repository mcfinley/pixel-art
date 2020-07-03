/* Integer values from 0 to 255 */
export type ByteNumber = number

/* Decimal values from 0 to 1 */
export type ZeroToOne = number

/* all from 0 to 255 */
export type RGBColor = { r: ByteNumber, g: ByteNumber, b: ByteNumber }
export type RGBAColor = RGBColor & { a: ByteNumber }

/* all from 0 to 1 */
export type HSLColor = { h: ZeroToOne, s: ZeroToOne, l: ZeroToOne }
export type HSLAColor = HSLColor & { a: ZeroToOne }

/**
 * Converts RGBA to HSLA
 */
export const rgbaToHsla = (rgba: RGBAColor): HSLAColor => {
  const _r = rgba.r / 256, _g = rgba.g / 256, _b = rgba.b / 256
  const max = Math.max(_r, _g, _b), min = Math.min(_r, _g, _b)

  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min

    s = l > .5
      ? d / (2 - max - min)
      : d / (max + min)

    if (max === _r) {
      h = (_g - _b) / d + (_g < _b ? 6 : 0)
    }

    if (max === _g) {
      h = (_b - _r) / d + 2
    }

    if (max === _b) {
      h = (_r - _g) / d + 4
    }

    h /= 6
  }

  return { h, s, l, a: rgba.a / 256 }
}

/**
 * Converts RGB to HSL
 */
export const rgbToHsl = (rgb: RGBColor): HSLColor => {
  const { h, s, l } = rgbaToHsla({ ...rgb, a: 255 })
  return { h, s, l }
}

/**
 * Convert HSLA to RGBA
 */
export const hslaToRgba = (hsla: HSLAColor): RGBAColor => {
  const { h, s, l } = hsla
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a: Math.round(hsla.a * 255) }
}

/**
 * Convert HSL to RGB
 */
export const hslToRgb = (hsl: HSLColor): RGBColor => {
  const { r, g, b } = hslaToRgba({ ...hsl, a: 1 })
  return { r, g, b }
}

/**
 * Just a helper
 */
const hue2rgb = (p, q, t) => {
 if(t < 0) t += 1;
 if(t > 1) t -= 1;
 if(t < 1/6) return p + (q - p) * 6 * t;
 if(t < 1/2) return q;
 if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
 return p;
}

/* Format helpers */
const upTo = (v: string, len: number, prefix: string) => (new Array(Math.ceil(len / prefix.length)).fill(prefix).join('') + v).substr(-len)
export const rgbaToHex = (rgba: RGBAColor) =>
  `#${upTo(rgba.r.toString(16), 2, '0')}${upTo(rgba.g.toString(16), 2, '0')}${upTo(rgba.b.toString(16), 2, '0')}${upTo(rgba.a.toString(16), 2, '0')}`

export const rgbToHex = (rgb: RGBColor) => rgbaToHex({ ...rgb, a: 255 })