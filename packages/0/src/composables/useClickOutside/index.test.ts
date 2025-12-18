import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useClickOutside } from './index'

describe('useClickOutside', () => {
  let container: HTMLElement
  let target: HTMLElement
  let outside: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    target = document.createElement('div')
    outside = document.createElement('div')
    container.append(target, outside)
    document.body.append(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('calls handler when clicking outside target', async () => {
    const handler = vi.fn()
    useClickOutside(target, handler)

    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler when clicking inside target', async () => {
    const handler = vi.fn()
    useClickOutside(target, handler)

    await nextTick()
    target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('does not call handler when clicking on target children', async () => {
    const handler = vi.fn()
    const child = document.createElement('span')
    target.append(child)
    useClickOutside(target, handler)

    await nextTick()
    child.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('supports reactive target ref', async () => {
    const handler = vi.fn()
    const targetRef = ref<HTMLElement | null>(null)
    useClickOutside(targetRef, handler)

    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled() // No target yet

    targetRef.value = target
    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('supports multiple targets', async () => {
    const handler = vi.fn()
    const target2 = document.createElement('div')
    container.append(target2)

    useClickOutside(() => [target, target2], handler)

    await nextTick()

    // Click on first target - should not trigger
    target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()

    // Click on second target - should not trigger
    target2.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()

    // Click outside both - should trigger
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('respects enabled option', async () => {
    const handler = vi.fn()
    const enabled = ref(false)
    useClickOutside(target, handler, { enabled })

    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()

    enabled.value = true
    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('responds to touchstart events', async () => {
    const handler = vi.fn()
    useClickOutside(target, handler)

    await nextTick()
    outside.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('supports custom events', async () => {
    const handler = vi.fn()
    useClickOutside(target, handler, { events: ['click'] })

    await nextTick()

    // mousedown should not trigger with custom events
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()

    // click should trigger
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('returns cleanup function', async () => {
    const handler = vi.fn()
    const stop = useClickOutside(target, handler)

    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)

    stop()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1) // Still 1, not called again
  })

  it('handles null/undefined targets gracefully', async () => {
    const handler = vi.fn()
    useClickOutside(null, handler)

    await nextTick()
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

    // Should not throw, handler not called since no valid targets
    expect(handler).not.toHaveBeenCalled()
  })

  it('filters out null values from target array', async () => {
    const handler = vi.fn()
    useClickOutside(() => [target, null, undefined] as any, handler)

    await nextTick()

    // Click on target - should not trigger
    target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()

    // Click outside - should trigger
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
