import { hexToRgb } from './color'

// Types
import type { RGB } from './color'

const Rco = 0.212_672_9
const Gco = 0.715_152_2
const Bco = 0.072_175

const normBG = 0.56
const normTXT = 0.57
const revBG = 0.65
const revTXT = 0.62
const blkThrs = 0.022
const blkClmp = 1.414
const scaleBoW = 1.14
const scaleWoB = 1.14
const loBoWoffset = 0.027
const loWoBoffset = 0.027
const deltaYmin = 0.0005

function linearize (channel: number): number {
  const val = channel / 255
  return val <= 0.040_45
    ? val / 12.92
    : Math.pow((val + 0.055) / 1.055, 2.4)
}

function luminance (rgb: RGB): number {
  return Rco * linearize(rgb.r) + Gco * linearize(rgb.g) + Bco * linearize(rgb.b)
}

function clamp (y: number): number {
  return y > blkThrs ? y : y + Math.pow(blkThrs - y, blkClmp)
}

/* #__NO_SIDE_EFFECTS__ */
export function apca (text: RGB, background: RGB): number {
  const txtY = clamp(luminance(text))
  const bgY = clamp(luminance(background))

  if (Math.abs(bgY - txtY) < deltaYmin) return 0

  let contrast: number
  if (bgY > txtY) {
    contrast = (Math.pow(bgY, normBG) - Math.pow(txtY, normTXT)) * scaleBoW
    return contrast < loBoWoffset ? 0 : (contrast - loBoWoffset) * 100
  } else {
    contrast = (Math.pow(bgY, revBG) - Math.pow(txtY, revTXT)) * scaleWoB
    return contrast > -loWoBoffset ? 0 : (contrast + loWoBoffset) * 100
  }
}

const BLACK: RGB = { r: 0, g: 0, b: 0 }
const WHITE: RGB = { r: 255, g: 255, b: 255 }

/* #__NO_SIDE_EFFECTS__ */
export function foreground (hex: string): string {
  const rgb = hexToRgb(hex)
  const onWhite = Math.abs(apca(WHITE, rgb))
  const onBlack = Math.abs(apca(BLACK, rgb))
  return onBlack > onWhite ? '#000000' : '#ffffff'
}
