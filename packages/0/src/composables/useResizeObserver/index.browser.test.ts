import { describe, expect, it, onTestFinished } from 'vitest'

import { useElementSize, useResizeObserver } from './index'

// Utilities
import { effectScope } from 'vue'

// Types
import type { ResizeObserverEntry, ResizeObserverOptions } from './index'

/**
 * `box-sizing: border-box` with an outer 200x40, 4px/16px padding and a 1px
 * border. The two box models therefore disagree on every axis:
 *
 * - border box  — 200 x 40
 * - content box — 166 x 30
 */
// Absolutely positioned so mounting and unmounting a fixture never reflows the
// document and re-notifies a sibling test's observer.
const OUT_OF_FLOW = 'position: absolute; top: 0; left: 0;'

const GEOMETRY = `${OUT_OF_FLOW} box-sizing: border-box; width: 200px; height: 40px; padding: 4px 16px; border: 1px solid;`

const BORDER = { inlineSize: 200, blockSize: 40 }
const CONTENT = { inlineSize: 166, blockSize: 30 }

/**
 * Native entries expose `inlineSize` / `blockSize` as prototype getters on a
 * `ResizeObserverSize`, which structural matchers read as an empty object.
 * Normalize both sides before comparing.
 */
function size (value: ResizeObserverSize | undefined) {
  return { inlineSize: value?.inlineSize, blockSize: value?.blockSize }
}

function element (css = GEOMETRY) {
  const el = document.createElement('div')

  el.style.cssText = css
  document.body.append(el)

  onTestFinished(() => el.remove())

  return el
}

function observe (el: Element, options?: ResizeObserverOptions) {
  const entries: ResizeObserverEntry[] = []
  let notify: (() => void) | undefined

  const scope = effectScope()

  scope.run(() => {
    useResizeObserver(el, list => {
      entries.push(...list)
      notify?.()
    }, options)
  })

  onTestFinished(() => scope.stop())

  function next (): Promise<ResizeObserverEntry> {
    return new Promise((resolve, reject) => {
      function take () {
        const entry = entries.shift()

        if (!entry) return false

        notify = undefined
        // Resolve on a later task, not the observer's own microtask: anything
        // the awaiting test then does to the DOM would otherwise land inside
        // the delivery loop and trip Chromium's undelivered-notification error.
        setTimeout(() => resolve(entry), 0)

        return true
      }

      if (take()) return

      const timer = setTimeout(() => {
        notify = undefined
        reject(new Error('timed out waiting for a resize entry'))
      }, 2000)

      notify = () => {
        if (take()) clearTimeout(timer)
      }
    })
  }

  return { next }
}

describe('useResizeObserver box model', () => {
  it('should report the border box when observing border-box', async () => {
    const el = element()
    const { next } = observe(el, { box: 'border-box' })
    const entry = await next()

    expect(size(entry.borderBoxSize[0])).toEqual(BORDER)
    expect(entry.borderBoxSize[0]!.blockSize).toBe(el.getBoundingClientRect().height)
  })

  it('should keep contentRect on the content box under either box option', async () => {
    const el = element()
    const border = await observe(el, { box: 'border-box' }).next()
    const content = await observe(el, { box: 'content-box' }).next()

    for (const entry of [border, content]) {
      expect(entry.contentRect.width).toBe(CONTENT.inlineSize)
      expect(entry.contentRect.height).toBe(CONTENT.blockSize)
      expect(size(entry.contentBoxSize[0])).toEqual(CONTENT)
      expect(size(entry.borderBoxSize[0])).toEqual(BORDER)
    }
  })

  it('should separate the two box models by exactly the padding and border', async () => {
    const { next } = observe(element(), { box: 'border-box' })
    const entry = await next()

    // 16px padding + 1px border on each inline edge, 4px + 1px on each block edge
    expect(entry.borderBoxSize[0]!.inlineSize - entry.contentBoxSize[0]!.inlineSize).toBe(34)
    expect(entry.borderBoxSize[0]!.blockSize - entry.contentBoxSize[0]!.blockSize).toBe(10)
    expect(entry.contentRect.height).not.toBe(entry.borderBoxSize[0]!.blockSize)
  })

  it('should report both box models on an unpadded element as identical', async () => {
    const { next } = observe(element(`${OUT_OF_FLOW} width: 120px; height: 60px;`))
    const entry = await next()

    expect(size(entry.contentBoxSize[0])).toEqual({ inlineSize: 120, blockSize: 60 })
    expect(size(entry.borderBoxSize[0])).toEqual({ inlineSize: 120, blockSize: 60 })
  })

  it('should deliver updated border-box sizes on resize', async () => {
    const el = element()
    const { next } = observe(el, { box: 'border-box' })

    await next()

    el.style.height = '80px'

    const entry = await next()

    expect(entry.borderBoxSize[0]!.blockSize).toBe(80)
    expect(entry.contentBoxSize[0]!.blockSize).toBe(70)
  })

  it('should synthesize an immediate entry matching what the observer reports', async () => {
    const el = element()
    const { next } = observe(el, { immediate: true, box: 'border-box' })

    const immediate = await next()
    const observed = await next()

    expect(size(immediate.borderBoxSize[0])).toEqual(size(observed.borderBoxSize[0]))
    expect(size(immediate.contentBoxSize[0])).toEqual(size(observed.contentBoxSize[0]))
    expect(immediate.contentRect).toEqual(observed.contentRect)
  })

  it('should report the immediate contentRect on the content box, positioned at the padding offset', async () => {
    const el = element()
    const { next } = observe(el, { immediate: true })

    const immediate = await next()

    expect(immediate.contentRect.width).toBe(CONTENT.inlineSize)
    expect(immediate.contentRect.height).toBe(CONTENT.blockSize)
    // 16px padding on the inline edges, 4px on the block edges (see GEOMETRY)
    expect(immediate.contentRect.left).toBe(16)
    expect(immediate.contentRect.top).toBe(4)
  })

  it('should swap the logical axes on the immediate entry under a vertical writing mode', async () => {
    const el = element(`${GEOMETRY} writing-mode: vertical-rl;`)
    const { next } = observe(el, { immediate: true })

    const immediate = await next()
    const observed = await next()

    expect(size(immediate.borderBoxSize[0])).toEqual(size(observed.borderBoxSize[0]))
    expect(size(observed.borderBoxSize[0])).toEqual({ inlineSize: 40, blockSize: 200 })
  })

  it('should keep useElementSize reporting content-box dimensions', async () => {
    const el = element()
    const scope = effectScope()

    onTestFinished(() => scope.stop())

    const { width, height } = scope.run(() => useElementSize(el))!

    await observe(el).next()

    expect(width.value).toBe(CONTENT.inlineSize)
    expect(height.value).toBe(CONTENT.blockSize)
  })
})
