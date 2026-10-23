/**
 * @module useRipple
 *
 * @see https://0.vuetifyjs.com/systems/md1/ripple
 *
 * @remarks
 * Headless state for the Material Design 1 ink reaction. v0 ships no ripple
 * primitive, so Material Design 1 owns this one (SPEC.md, Deviations): the composable
 * keeps the list of inks and their lifecycle and never touches the DOM.
 * `Md1Ripple` measures the host, binds the pointer and keyboard events and
 * reports when each CSS animation lands.
 *
 * Key features:
 * - Inks start at the press point, or at the host centre for keyboard,
 *   `center` and `unbounded` presses, and are sized to fill the host: the
 *   radius is half the host diagonal from the centre and grows to the
 *   farthest corner from an off-centre origin
 * - A release during the expansion is remembered and the ink leaves as soon
 *   as the expansion lands, so a quick tap still draws the whole reaction
 * - Reduced motion (`useReducedMotion`, falling back to the OS preference
 *   when no plugin is installed) skips the animated states: inks leave at once
 *
 * @example
 * ```ts
 * import { useRipple } from '@paper/md1'
 *
 * const ripple = useRipple({ center: () => props.center })
 *
 * ripple.start({ width: 88, height: 36 }, { x: 12, y: 18 })
 * ripple.end()
 * ```
 */

// Framework
import { isUndefined, usePrefersReducedMotion, useReducedMotion } from '@vuetify/v0'

// Utilities
import { effectScope, reactive, ref, toRef, toValue } from 'vue'

// Types
import type { MediaQueryContext } from '@vuetify/v0'
import type { MaybeRefOrGetter, Ref } from 'vue'

export type RippleInkState = 'in' | 'hold' | 'out'

export interface RippleInk {
  /** Stable key for the rendered list. */
  readonly id: number
  /** Origin from the host's left edge, in px. */
  readonly x: number
  /** Origin from the host's top edge, in px. */
  readonly y: number
  /** Diameter in px. */
  readonly size: number
  /** `in` while expanding, `hold` while the press outlasts the expansion, `out` while fading. */
  readonly state: RippleInkState
}

export interface RipplePoint {
  /** Press position from the host's left edge, in px. */
  x: number
  /** Press position from the host's top edge, in px. */
  y: number
}

export interface RippleBounds {
  /** Host width in px. */
  width: number
  /** Host height in px. */
  height: number
}

export interface RippleOptions {
  /** The 48 px circle centred on the host and never clipped: the icon toggle's ink (buttons page). */
  unbounded?: MaybeRefOrGetter<boolean>
  /** Every ink starts at the host centre, whatever the press position. */
  center?: MaybeRefOrGetter<boolean>
}

export interface RippleContext {
  /** Live inks, oldest first. */
  readonly inks: Readonly<Ref<readonly RippleInk[]>>
  /**
   * `true` when inks must skip their animations: `useReducedMotion().isReduced`,
   * or the OS preference while no reduced-motion plugin is installed.
   */
  readonly isReduced: Readonly<Ref<boolean>>
  /**
   * Adds an ink. Omit `point` (keyboard) to start at the host centre.
   *
   * @example
   * ```ts
   * ripple.start({ width: 88, height: 36 }, { x: 12, y: 18 })
   * ripple.start({ width: 88, height: 36 })
   * ```
   */
  start: (bounds: RippleBounds, point?: RipplePoint) => RippleInk
  /**
   * Advances the ink whose animation just landed: an expanded ink holds or
   * fades, a faded ink is removed.
   *
   * @example
   * ```vue
   * <span @animationend="ripple.settle(ink.id)" />
   * ```
   */
  settle: (id: number) => void
  /**
   * Releases the press: held inks fade, expanding inks fade once they land,
   * and every ink leaves at once under reduced motion.
   *
   * @example
   * ```ts
   * ripple.end()
   * ```
   */
  end: () => void
  /**
   * Removes one ink, or every ink when `id` is omitted.
   *
   * @example
   * ```ts
   * ripple.clear()
   * ```
   */
  clear: (id?: number) => void
}

interface Ink extends RippleInk {
  state: RippleInkState
  /** The press was released while the ink was still expanding. */
  released: boolean
}

/** The spec's 48 dp touch target: the unbounded ink is that circle, whatever the host measures. */
const UNBOUNDED = 48

let query: MediaQueryContext | undefined

/**
 * One OS query shared by every ripple on the page. A detached scope keeps the
 * listener alive past the first host's unmount; the result only decides
 * anything while no reduced-motion plugin is installed.
 */
function prefers (): MediaQueryContext {
  query ??= effectScope(true).run(usePrefersReducedMotion)

  return query ?? usePrefersReducedMotion()
}

/**
 * Creates the ink state behind `Md1Ripple`.
 *
 * @param options Reactive `unbounded` and `center` switches.
 * @returns A `RippleContext`.
 *
 * @see https://0.vuetifyjs.com/systems/md1/ripple
 *
 * @example
 * ```ts
 * const ripple = useRipple({ unbounded: true })
 *
 * ripple.start({ width: 48, height: 48 })
 * ripple.inks.value.length // 1
 * ```
 */
export function useRipple (options: RippleOptions = {}): RippleContext {
  const motion = useReducedMotion()
  const media = prefers()
  const inks = ref<Ink[]>([])

  let counter = 0

  const isReduced = toRef(() => (
    motion.isReduced.value || (motion.selectedMode.value === 'system' && media.matches.value)
  ))

  function find (id: number): Ink | undefined {
    return inks.value.find(ink => ink.id === id)
  }

  function start (bounds: RippleBounds, point?: RipplePoint): RippleInk {
    const unbounded = toValue(options.unbounded) ?? false
    const origin = unbounded || toValue(options.center) || isUndefined(point)
      ? { x: bounds.width / 2, y: bounds.height / 2 }
      : point
    const size = unbounded
      ? UNBOUNDED
      : 2 * Math.hypot(
        Math.max(origin.x, bounds.width - origin.x),
        Math.max(origin.y, bounds.height - origin.y),
      )

    const ink = reactive<Ink>({ id: ++counter, x: origin.x, y: origin.y, size, state: 'in', released: false })

    inks.value.push(ink)

    return ink
  }

  function settle (id: number) {
    const ink = find(id)

    if (isUndefined(ink)) return

    if (ink.state === 'in') ink.state = ink.released ? 'out' : 'hold'
    else if (ink.state === 'out') clear(id)
  }

  function end () {
    if (isReduced.value) {
      clear()

      return
    }

    for (const ink of inks.value) {
      if (ink.state === 'in') ink.released = true
      else if (ink.state === 'hold') ink.state = 'out'
    }
  }

  function clear (id?: number) {
    inks.value = isUndefined(id) ? [] : inks.value.filter(ink => ink.id !== id)
  }

  return {
    inks,
    isReduced,
    start,
    settle,
    end,
    clear,
  }
}
