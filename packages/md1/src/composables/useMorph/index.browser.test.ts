import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Composables
import { useMorph } from './index'

// Utilities
import { createApp, h } from 'vue'

// Types
import type { MorphContext } from './index'

const teardowns: (() => void)[] = []

afterEach(() => {
  for (const teardown of teardowns.splice(0)) teardown()
})

function setup (mode: 'never' | 'always' = 'never'): MorphContext {
  let context!: MorphContext
  const host = document.createElement('div')

  document.body.append(host)

  const app = createApp({
    setup () {
      context = useMorph()

      return () => h('div')
    },
  })

  app.use(createReducedMotionPlugin({ mode }))
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })

  return context
}

function box (style: string): HTMLElement {
  const el = document.createElement('div')

  el.style.cssText = `position:fixed;${style}`
  document.body.append(el)
  teardowns.push(() => el.remove())

  return el
}

/** Pauses every animation the transform starts, so a frame can be read before it lands. */
function capture (): { animations: Animation[], restore: () => void } {
  const animations: Animation[] = []
  const animate = Element.prototype.animate

  Element.prototype.animate = function (...args: Parameters<Element['animate']>) {
    const animation = animate.apply(this, args)

    animation.pause()
    animations.push(animation)

    return animation
  }

  return { animations, restore: () => (Element.prototype.animate = animate) }
}

function frames (el: Element, property: 'clipPath' | 'transform' | 'filter'): string[] {
  const animation = el.getAnimations().find(item => (item.effect as KeyframeEffect).getKeyframes().some(frame => property in frame))

  return (animation?.effect as KeyframeEffect | undefined)?.getKeyframes().map(frame => String(frame[property])) ?? []
}

const FAB = 'left:300px;top:600px;width:56px;height:56px;border-radius:50%;background:rgb(255, 64, 129);color:rgb(255, 255, 255);box-shadow:rgba(0, 0, 0, 0.2) 0px 3px 5px -1px'
const SHEET = 'left:0;top:0;width:360px;height:640px;background:rgb(255, 255, 255)'

describe('useMorph', () => {
  it('should grow a circle from the source radius past the far corner of the surface', async () => {
    const { morph } = setup()
    const fab = box(FAB)
    const sheet = box(SHEET)
    const { animations, restore } = capture()

    const pending = morph({ from: fab, to: sheet, duration: 100 })
    restore()

    const clips = frames(sheet, 'clipPath')

    expect(clips[0]).toBe('circle(28px at 180px 320px)')
    expect(Number.parseFloat(clips.at(-1)!.slice(7))).toBeCloseTo(Math.hypot(180, 320), 2)
    expect(fab.style.visibility).toBe('hidden')

    for (const animation of animations) animation.finish()
    ;(await pending)()

    expect(sheet.getAnimations()).toHaveLength(0)
    expect(fab.style.visibility).toBe('')
  })

  it('should start the surface on the source centre and move it on an arc', async () => {
    const { morph } = setup()
    const fab = box(FAB)
    const sheet = box(SHEET)
    const { animations, restore } = capture()

    const pending = morph({ from: fab, to: sheet, duration: 160 })
    restore()

    const points = frames(sheet, 'transform').map(value => value.match(/-?[\d.]+/g)!.slice(0, 2).map(Number) as [number, number])
    const [x0, y0] = points[0]!

    // The FAB centre (328, 628) minus the sheet centre (180, 320).
    expect(x0).toBeCloseTo(148)
    expect(y0).toBeCloseTo(308)
    expect(points.at(-1)).toEqual([0, 0])

    // Rising, the arc starts shallow: x has covered more of its distance than y a quarter of the way in.
    const [x, y] = points[Math.round(points.length / 4)]!

    expect(1 - x / x0).toBeGreaterThan(1 - y / y0)

    for (const animation of animations) animation.finish()
    ;(await pending)()
  })

  it('should clip with inset() for a rect, the leading axis first', async () => {
    const { morph } = setup()
    const card = box('left:20px;top:100px;width:160px;height:100px')
    const detail = box(SHEET)
    const { animations, restore } = capture()

    const pending = morph({ from: card, to: detail, shape: 'rect', move: false, lead: 'height', lag: 0.5, duration: 160 })
    restore()

    const clips = frames(detail, 'clipPath')
    // Serialised insets collapse like margins: expand back to top, right, bottom, left.
    const [top = 0, right = top, bottom = top, left = right] = clips[(clips.length - 1) / 2]!.match(/-?[\d.]+/g)!.map(Number)
    const middle = [top, right, bottom, left]

    expect(clips[0]).toBe('inset(100px 180px 440px 20px)')
    expect(clips.at(-1)).toBe('inset(0px)')
    // Halfway, the height and the movement have finished and the width has not started.
    expect(middle[0]! + middle[2]!).toBeCloseTo(0)
    expect(360 - middle[1]! - middle[3]!).toBeCloseTo(160)
    expect(middle[1]).toBeCloseTo(middle[3]!)

    for (const animation of animations) animation.finish()
    ;(await pending)()
  })

  it('should carry the source shadow as a drop-shadow and a veil in its colour', async () => {
    const { morph } = setup()
    const fab = box(FAB)
    const sheet = box(SHEET)
    const { animations, restore } = capture()

    const pending = morph({ from: fab, to: sheet, duration: 100 })
    restore()

    const filters = frames(sheet, 'filter')
    const veil = sheet.lastElementChild as HTMLElement

    expect(filters[0]).toBe('drop-shadow(rgba(0, 0, 0, 0.2) 0px 3px 5px)')
    expect(veil.style.background).toBe('rgb(255, 64, 129)')

    for (const animation of animations) animation.finish()
    ;(await pending)()

    expect(sheet.childElementCount).toBe(0)
  })

  it('should hold the last frame of a reverse transform until the cleanup runs', async () => {
    const { morph } = setup()
    const fab = box(FAB)
    const sheet = box(SHEET)

    const done = await morph({ from: fab, to: sheet, duration: 20, reverse: true })

    expect(sheet.getAnimations().length).toBeGreaterThan(0)
    expect(getComputedStyle(sheet).clipPath).toBe('circle(28px at 180px 320px)')

    done()

    expect(sheet.getAnimations()).toHaveLength(0)
  })

  it('should skip the animation under reduced motion', async () => {
    const { morph, isReduced } = setup('always')
    const fab = box(FAB)
    const sheet = box(SHEET)

    expect(isReduced.value).toBe(true)

    const done = await morph({ from: fab, to: sheet })

    expect(sheet.getAnimations()).toHaveLength(0)
    expect(fab.style.visibility).toBe('')
    done()
  })
})
