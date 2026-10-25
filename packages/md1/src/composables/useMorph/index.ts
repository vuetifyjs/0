/**
 * @module useMorph
 *
 * @see https://0.vuetifyjs.com/systems/md1/fab
 *
 * @remarks
 * The Material Design 1 surface transform: one surface becomes another, the FAB
 * turning into a sheet, a toolbar or a full-screen dialog, a card expanding
 * into its detail, an avatar carried into a header. v0 ships no transform
 * primitive, so Material Design 1 owns this one. It is FLIP on the Web
 * Animations API: the target is laid out at its end state, measured, then
 * clipped and moved back to the source and played forward. No library and no
 * View Transitions.
 *
 * Key features:
 * - Two shapes: `circle` (the transforming-material page's radial
 *   transformation, for a circular source) and `rect` (an `inset()` clip, the
 *   rectangular transformation; the page forbids a radial one between two
 *   rectangles)
 * - Movement on both axes follows an arc: the leading axis on the deceleration
 *   curve and the other on the standard curve; a one-axis move stays straight
 * - `rect` changes width and height asynchronously through `lead` and `lag`
 * - The source's shadow carries over as a `drop-shadow()` on the moving element
 *   and hands over to the surface's own shadow
 * - An optional veil in the source's colour, carrying its glyph, fades out over
 *   the surface so the colour hands over and the content arrives late
 * - Reduced motion (`useReducedMotion`, falling back to the OS preference
 *   while the mode is `system`) skips the animation
 *
 * @example
 * ```ts
 * import { useMorph } from '@paper/md1'
 *
 * const { morph } = useMorph()
 *
 * const done = await morph({ from: fab, to: sheet, duration: 'complex' })
 * done()
 * ```
 */

// Framework
import { isElement, isNumber, isString, usePrefersReducedMotion, useReducedMotion } from '@vuetify/v0'

// Composables

// Utilities
import { toRef, toValue } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

// Tokens
import { duration, easing } from '../../design-system'

export type MorphShape = 'circle' | 'rect'

/** An element, a component instance, or a ref or getter of either. */
export type MorphTarget = MaybeRefOrGetter<Element | { $el: unknown } | null | undefined>

export interface MorphOptions {
  /** The element that becomes the surface (hidden while the transform runs), or its measured rect. */
  from: MorphTarget | DOMRect
  /** The element that moves. It carries the transform and the shadow, so it should not be clipped itself. */
  to: MorphTarget
  /** The surface the clip reveals: `to`, a descendant of it, or a selector inside it. Defaults to `to`. */
  clip?: MorphTarget | string
  /** `circle` for a circular source, `rect` between two rectangles. Defaults to `circle`. */
  shape?: MorphShape
  /** The surface travels from the source (`true`), or stays in place while the shape grows over it. Defaults to `true`. */
  move?: boolean
  /** Uniformly scale the surface from the source's width instead of cropping it: a shared element. `rect` only. */
  scale?: boolean
  /** Milliseconds, or a motion token read from the surface so the device scale applies. Defaults to `standard`. */
  duration?: number | keyof typeof duration
  /** The `rect` axis that changes first; the movement runs with it. Defaults to `width`. */
  lead?: 'width' | 'height'
  /** The fraction of the duration the other axis starts late, from 0 (together) to 1. Defaults to 0. */
  lag?: number
  /** Cover the surface in the source's colour and glyph and fade it out. Defaults to `true` for `circle`. */
  veil?: boolean
  /** Hide the source element while the transform runs. Defaults to `true`; a trigger that stays on screen sets `false`. */
  hide?: boolean
  /** Play from the surface back into the source. The last frame holds until the cleanup runs. */
  reverse?: boolean
}

export interface MorphContext {
  /** `true` while transforms are skipped: the reduced-motion context, or the OS preference in `system` mode. */
  readonly isReduced: Readonly<Ref<boolean>>
  /**
   * Plays one transform. Resolves when it lands, with the cleanup that drops
   * the held frame, the veil and the inline styles. Call it once the DOM shows
   * the end state; after a forward transform, that is at once.
   */
  morph: (options: MorphOptions) => Promise<() => void>
}

type Curve = (x: number) => number

function bezier (css: string): Curve {
  const [x1, y1, x2, y2] = css.match(/[\d.]+/g)!.map(Number) as [number, number, number, number]

  function at (a: number, b: number, t: number) {
    return 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3
  }

  return function (x: number) {
    let low = 0
    let high = 1

    for (let index = 0; index < 24; index++) {
      const t = (low + high) / 2

      if (at(x1, x2, t) < x) low = t
      else high = t
    }

    return at(y1, y2, (low + high) / 2)
  }
}

const standard = bezier(easing.standard)
const decelerate = bezier(easing.decelerate)

/** A curve played inside part of the duration: 0 before `start`, 1 after `end`. */
function window (curve: Curve, start: number, end: number): Curve {
  return t => t <= start ? 0 : (t >= end ? 1 : curve((t - start) / (end - start)))
}

function lerp (a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Md1 components render fragments, so a component's $el is the text anchor in front of its element.
function resolve (target: MorphTarget): HTMLElement | undefined {
  const value = toValue(target)
  const node = isElement(value) ? value : value?.$el

  return (isElement(node) ? node : (node as Text | undefined)?.nextElementSibling ?? undefined) as HTMLElement | undefined
}

/** A computed corner radius in px; a percentage resolves against the shorter side. */
function corner (value: string | undefined, rect: DOMRect): number {
  const number = Number.parseFloat(value ?? '') || 0

  return value?.endsWith('%') ? number / 100 * Math.min(rect.width, rect.height) : number
}

/** A computed box-shadow as `drop-shadow()` filters, so it follows the clip. Spread has no equivalent. */
function shadows (value: string): string[] {
  if (value === 'none') return []

  return value.split(/,(?![^(]*\))/).map(layer => {
    const color = layer.match(/rgba?\([^)]*\)|#\w+/)?.[0] ?? 'transparent'
    const [x = '0px', y = '0px', blur = '0px'] = layer.replace(color, '').trim().split(/\s+/)

    return `drop-shadow(${x} ${y} ${blur} ${color})`
  })
}

/**
 * Creates the Material Design 1 surface transform.
 *
 * @returns A `MorphContext`.
 *
 * @see https://0.vuetifyjs.com/systems/md1/fab
 *
 * @example
 * ```ts
 * const { morph } = useMorph()
 *
 * const done = await morph({ from: card, to: detail, shape: 'rect' })
 * done()
 * ```
 */
export function useMorph (): MorphContext {
  const motion = useReducedMotion()
  const media = usePrefersReducedMotion()

  const isReduced = toRef(() => (
    motion.isReduced.value || (motion.selectedMode.value === 'system' && media.matches.value)
  ))

  async function morph (options: MorphOptions): Promise<() => void> {
    const host = resolve(options.to)
    const surface = isString(options.clip) ? host?.querySelector<HTMLElement>(options.clip) ?? undefined : (options.clip ? resolve(options.clip) : host)
    const source = options.from instanceof DOMRect ? undefined : resolve(options.from)
    const rect = options.from instanceof DOMRect ? options.from : source?.getBoundingClientRect()

    if (!host || !surface || !rect || isReduced.value) return () => {}

    const { shape = 'circle', move = true, lead = 'width', lag = 0, hide = true, reverse = false } = options
    const scale = shape === 'rect' && move && !!options.scale
    const restore = { transition: host.style.transition, position: surface.style.position, visibility: source?.style.visibility }

    // A component's own CSS transitions outrank animations in the cascade, and would also skew the measurement.
    host.style.transition = 'none'
    if (getComputedStyle(surface).position === 'static') surface.style.position = 'relative'

    const token = options.duration ?? 'standard'
    const ms = isNumber(token)
      ? token
      : Number.parseFloat(getComputedStyle(surface).getPropertyValue(`--md1-duration-${token}`) || duration[token])
    const a = rect
    const b = surface.getBoundingClientRect()
    const box = host.getBoundingClientRect()
    const from = source ? getComputedStyle(source) : undefined
    const to = getComputedStyle(surface)
    const start = { x: a.left + a.width / 2, y: a.top + a.height / 2 }
    const end = shape === 'circle' && !move ? start : { x: b.left + b.width / 2, y: b.top + b.height / 2 }
    const dx = end.x - start.x
    const dy = end.y - start.y

    // The movement page: two-axis moves arc, shallow first when rising and steep first when falling.
    const span = shape === 'rect' ? 1 - lag : 1
    const leading = window(decelerate, 0, span)
    const trailing = window(standard, 0, span)
    const arc = Math.abs(dx) > 1 && Math.abs(dy) > 1
    const px = arc && dy < 0 ? leading : trailing
    const py = arc && dy >= 0 ? leading : trailing
    const first = window(standard, 0, span)
    const second = window(standard, lag, 1)
    const pw = lead === 'width' ? first : second
    const ph = lead === 'width' ? second : first
    const ra = shape === 'circle' ? Math.min(a.width, a.height) / 2 : corner(from?.borderTopLeftRadius, a)
    const rb = corner(to.borderTopLeftRadius, b)
    const far = Math.max(...[[b.left, b.top], [b.right, b.top], [b.left, b.bottom], [b.right, b.bottom]].map(([x, y]) => Math.hypot(x! - end.x, y! - end.y)))
    const origin = `${b.left + b.width / 2 - box.left}px ${b.top + b.height / 2 - box.top}px`
    const transforms: Keyframe[] = []
    const clips: Keyframe[] = []
    const frames = Math.max(2, Math.round(ms / 16))

    for (let index = 0; index <= frames; index++) {
      const t = index / frames
      const x = lerp(start.x, end.x, px(t))
      const y = lerp(start.y, end.y, py(t))
      const w = lerp(a.width, b.width, pw(t))
      const h = lerp(a.height, b.height, ph(t))
      const s = scale ? w / b.width : 1
      const cx = move ? b.width / 2 : x - b.left
      const cy = move ? b.height / 2 : y - b.top

      transforms.push({ transform: move ? `translate(${x - b.left - b.width / 2}px, ${y - b.top - b.height / 2}px) scale(${s})` : 'none', transformOrigin: origin })

      if (shape === 'circle') {
        clips.push({ clipPath: `circle(${lerp(ra, far, standard(t))}px at ${cx}px ${cy}px)` })
      } else {
        const hw = w / 2 / s
        const hh = h / 2 / s
        const r = lerp(ra, rb, (lead === 'width' ? ph : pw)(t)) / s

        clips.push({ clipPath: `inset(${cy - hh}px ${b.width - cx - hw}px ${b.height - cy - hh}px ${cx - hw}px round ${r}px)` })
      }
    }

    const timing: KeyframeAnimationOptions = { duration: ms, fill: 'forwards', direction: reverse ? 'reverse' : 'normal' }
    const curve = { ...timing, easing: easing.standard }
    const animations = [
      host.animate(transforms, timing),
      surface.animate(clips, timing),
    ]

    // The FAB's shadow follows the clip and hands over to the surface's own.
    const lift = shadows(from?.boxShadow ?? 'none')
    const rest = shadows(to.boxShadow)
    const count = Math.max(lift.length, rest.length)

    // Filter lists interpolate only between equal lengths.
    function pad (list: string[]) {
      return [...list, ...Array.from({ length: count - list.length }, () => 'drop-shadow(0px 0px 0px transparent)')].join(' ')
    }

    if (count > 0) {
      animations.push(host.animate([{ filter: pad(lift) }, { filter: pad(rest) }], curve))
    }

    const veil = (options.veil ?? shape === 'circle') && from ? document.createElement('div') : undefined

    if (veil && from) {
      const glyph = source?.querySelector('svg')?.cloneNode(true) as SVGElement | undefined
      const cx = move ? b.width / 2 : start.x - b.left
      const cy = move ? b.height / 2 : start.y - b.top

      // The glyph holds through a `rect` lag (the FAB is still a FAB while it travels), then leaves in the next
      // 20% of the remaining time; the veil fades over the 50% after that.
      const hold = shape === 'rect' ? lag : 0
      const fade = hold + 0.2 * (1 - hold)
      const gone = hold + 0.7 * (1 - hold)

      veil.style.cssText = `position:absolute;inset:0;z-index:2147483647;pointer-events:none;background:${from.backgroundColor};color:${from.color}`
      surface.append(veil)
      animations.push(veil.animate([{ opacity: 1 }, { opacity: 1, offset: fade, easing: easing.standard }, { opacity: 0, offset: gone }, { opacity: 0 }], timing))

      if (glyph) {
        glyph.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;translate:-50% -50%`
        veil.append(glyph)
        animations.push(glyph.animate([{ opacity: 1 }, { opacity: 1, offset: hold, easing: easing.standard }, { opacity: 0, offset: fade }, { opacity: 0 }], timing))
      }
    }

    // The source is the surface now; it comes back with the cleanup.
    if (hide) source?.style.setProperty('visibility', 'hidden')

    await Promise.all(animations.map(animation => animation.finished)).catch(() => {})

    return function () {
      for (const animation of animations) animation.cancel()
      veil?.remove()
      host.style.transition = restore.transition
      surface.style.position = restore.position
      if (source) source.style.visibility = restore.visibility ?? ''
    }
  }

  return { isReduced, morph }
}
