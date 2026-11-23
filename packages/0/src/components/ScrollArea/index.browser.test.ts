import { afterEach, describe, expect, it, vi } from 'vitest'

import { ScrollArea } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

// Types
import type { ScrollAreaRootExpose, ScrollAreaVisibility } from './index'
import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'

const wrappers: VueWrapper[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
  document.body.replaceChildren()
})

// Keep mounted areas away from the page origin, where the real test cursor rests
function host () {
  const el = document.createElement('div')
  el.style.cssText = 'position: absolute; top: 400px; left: 400px'
  document.body.append(el)
  return el
}

function frame () {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

async function settle () {
  await nextTick()
  await frame()
  await frame()
  await nextTick()
}

interface Options {
  visibility?: ScrollAreaVisibility
  delay?: number
  axes?: ('vertical' | 'horizontal')[]
  content?: { width: number, height: number }
  dir?: 'ltr' | 'rtl'
  corner?: boolean
}

async function mountArea (options: Options = {}) {
  const {
    visibility = 'always',
    delay = 600,
    axes = ['vertical'],
    content = { width: 100, height: 1000 },
    dir = 'ltr',
    corner = false,
  } = options

  const wrapper = mount(defineComponent({
    setup () {
      return () => h(ScrollArea.Root as Component, {
        ref: 'root',
        visibility,
        delay,
        dir,
        style: { width: '200px', height: '100px' },
      }, () => [
        h(ScrollArea.Viewport as Component, { style: { width: '100%', height: '100%' } }, () => [
          h('div', { 'data-testid': 'content', 'style': { width: `${content.width}px`, height: `${content.height}px` } }),
        ]),
        ...axes.map(orientation => h(ScrollArea.Scrollbar as Component, {
          orientation,
          'data-testid': `scrollbar-${orientation}`,
          'style': orientation === 'vertical' ? { width: '10px' } : { height: '10px' },
        }, () => [
          h(ScrollArea.Thumb as Component, { 'data-testid': `thumb-${orientation}` }),
        ])),
        corner ? h(ScrollArea.Corner as Component, { 'data-testid': 'corner' }) : null,
      ])
    },
  }), { attachTo: host() })

  wrappers.push(wrapper)
  await settle()

  const root = wrapper.element as HTMLElement
  const viewport = root.firstElementChild as HTMLElement

  return {
    wrapper,
    root,
    viewport,
    scrollbar: (o: 'vertical' | 'horizontal') => root.querySelector(`[data-testid="scrollbar-${CSS.escape(o)}"]`) as HTMLElement,
    thumb: (o: 'vertical' | 'horizontal') => root.querySelector(`[data-testid="thumb-${CSS.escape(o)}"]`) as HTMLElement,
    expose: () => wrapper.findComponent(ScrollArea.Root as Component).vm as unknown as ScrollAreaRootExpose,
  }
}

async function scroll (viewport: HTMLElement, top: number, left = viewport.scrollLeft) {
  viewport.scrollTop = top
  viewport.scrollLeft = left
  viewport.dispatchEvent(new Event('scroll'))
  await settle()
}

describe('scrollArea', () => {
  describe('viewport', () => {
    it('should enable scrolling only on axes that have a scrollbar', async () => {
      const { viewport } = await mountArea({ axes: ['vertical'] })

      expect(viewport.style.overflowY).toBe('scroll')
      expect(viewport.style.overflowX).toBe('hidden')
      expect(viewport.style.scrollbarWidth).toBe('none')
    })

    it('should be focusable when it overflows on a scrollable axis', async () => {
      const { viewport } = await mountArea()

      expect(viewport.getAttribute('tabindex')).toBe('0')
    })

    it('should not be focusable when the content fits', async () => {
      const { viewport } = await mountArea({ content: { width: 100, height: 50 } })

      expect(viewport.hasAttribute('tabindex')).toBe(false)
    })
  })

  describe('thumb', () => {
    it('should size the thumb to the visible share of the content', async () => {
      const { thumb } = await mountArea()

      // 100px viewport / 1000px content * 100px track
      expect(thumb('vertical').style.height).toBe('18px')
    })

    it('should keep a proportional size above the minimum', async () => {
      const { thumb } = await mountArea({ content: { width: 100, height: 200 } })

      expect(thumb('vertical').style.height).toBe('50px')
    })

    it('should follow the scroll offset', async () => {
      const { viewport, thumb } = await mountArea({ content: { width: 100, height: 200 } })

      await scroll(viewport, 100)

      expect(thumb('vertical').style.transform).toBe('translate3d(0px, 50px, 0px)')
    })

    it('should scroll the viewport when dragged', async () => {
      const { viewport, thumb } = await mountArea({ content: { width: 100, height: 200 } })
      const el = thumb('vertical')
      el.setPointerCapture = vi.fn()

      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientY: 10, pointerId: 1 }))
      await nextTick()
      document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: 35, pointerId: 1 }))
      await settle()

      // 25px of thumb travel over a 50px room scrolls 50px of a 100px range
      expect(viewport.scrollTop).toBe(50)
      expect(el.dataset.dragging).toBe('true')

      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
      await settle()

      expect(el.dataset.dragging).toBeUndefined()
    })

    it('should be hidden when the content fits', async () => {
      const { thumb } = await mountArea({ content: { width: 100, height: 50 } })

      expect(thumb('vertical').dataset.state).toBe('hidden')
    })
  })

  describe('scrollbar', () => {
    it('should be hidden from assistive technology', async () => {
      const { scrollbar } = await mountArea()

      expect(scrollbar('vertical').getAttribute('aria-hidden')).toBe('true')
      expect(scrollbar('vertical').dataset.orientation).toBe('vertical')
    })

    it('should jump to the clicked position on the track', async () => {
      const { viewport, scrollbar } = await mountArea({ content: { width: 100, height: 200 } })
      const track = scrollbar('vertical')
      const rect = track.getBoundingClientRect()

      track.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientY: rect.bottom - 1 }))
      await settle()

      expect(viewport.scrollTop).toBe(100)
    })

    it('should forward wheel input to the viewport', async () => {
      const { viewport, scrollbar } = await mountArea()

      scrollbar('vertical').dispatchEvent(new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 40 }))
      await settle()

      expect(viewport.scrollTop).toBe(40)
    })
  })

  describe('visibility', () => {
    it('should always show the scrollbar in always mode, even without overflow', async () => {
      const { scrollbar } = await mountArea({ visibility: 'always', content: { width: 100, height: 50 } })

      expect(scrollbar('vertical').dataset.state).toBe('visible')
      expect(scrollbar('vertical').style.display).not.toBe('none')
    })

    it('should show the scrollbar only on overflow in auto mode', async () => {
      const fits = await mountArea({ visibility: 'auto', content: { width: 100, height: 50 } })
      expect(fits.scrollbar('vertical').style.display).toBe('none')

      const overflows = await mountArea({ visibility: 'auto' })
      expect(overflows.scrollbar('vertical').dataset.state).toBe('visible')
    })

    it('should show the scrollbar while scrolling in scroll mode and hide it after the delay', async () => {
      const { viewport, scrollbar, root } = await mountArea({ visibility: 'scroll', delay: 50 })

      expect(scrollbar('vertical').style.display).toBe('none')

      await scroll(viewport, 100)

      expect(scrollbar('vertical').dataset.state).toBe('visible')
      expect(root.dataset.scrolling).toBe('true')

      await vi.waitFor(() => expect(scrollbar('vertical').style.display).toBe('none'))
      expect(root.dataset.scrolling).toBeUndefined()
    })

    it('should show the scrollbar on hover in hover mode and hide it after the delay', async () => {
      const { scrollbar, root } = await mountArea({ visibility: 'hover', delay: 50 })

      expect(scrollbar('vertical').style.display).toBe('none')

      root.dispatchEvent(new PointerEvent('pointerenter'))
      await settle()

      expect(scrollbar('vertical').dataset.state).toBe('visible')
      expect(root.dataset.hovering).toBe('true')

      root.dispatchEvent(new PointerEvent('pointerleave'))
      await settle()

      expect(scrollbar('vertical').dataset.state).toBe('visible')

      await vi.waitFor(() => expect(scrollbar('vertical').style.display).toBe('none'))
    })

    it('should never show a scrollbar without overflow in hover mode', async () => {
      const { scrollbar, root } = await mountArea({ visibility: 'hover', content: { width: 100, height: 50 } })

      root.dispatchEvent(new PointerEvent('pointerenter'))
      await settle()

      expect(scrollbar('vertical').style.display).toBe('none')
    })
  })

  describe('corner', () => {
    it('should render only while both scrollbars are visible', async () => {
      const { root } = await mountArea({
        axes: ['vertical', 'horizontal'],
        content: { width: 1000, height: 1000 },
        corner: true,
      })

      const corner = root.querySelector('[data-testid="corner"]') as HTMLElement
      expect(corner).not.toBeNull()
      expect(corner.style.width).toBe('10px')
      expect(corner.style.height).toBe('10px')
      expect(root.style.getPropertyValue('--v0-scroll-area-corner-width')).toBe('10px')
    })

    it('should not render with a single axis overflowing', async () => {
      const { root } = await mountArea({
        visibility: 'auto',
        axes: ['vertical', 'horizontal'],
        content: { width: 100, height: 1000 },
        corner: true,
      })

      expect(root.querySelector('[data-testid="corner"]')).toBeNull()
      expect(root.style.getPropertyValue('--v0-scroll-area-corner-width')).toBe('0px')
    })
  })

  describe('rtl', () => {
    it('should mirror the horizontal thumb and scroll from the right edge', async () => {
      const { viewport, thumb, expose } = await mountArea({
        axes: ['horizontal'],
        content: { width: 400, height: 50 },
        dir: 'rtl',
      })

      expose().scrollTo('horizontal', 100)
      await scroll(viewport, 0, viewport.scrollLeft)

      expect(viewport.scrollLeft).toBe(-100)
      expect(thumb('horizontal').style.transform).toBe('translate3d(-50px, 0px, 0px)')
    })
  })

  describe('expose', () => {
    it('should scroll programmatically and clamp to the scroll range', async () => {
      const { viewport, expose } = await mountArea()

      expose().scrollTo('vertical', 5000)
      await settle()

      expect(viewport.scrollTop).toBe(900)
    })
  })

  describe('lifecycle', () => {
    it('should stop scrolling an axis when its scrollbar unmounts', async () => {
      const wrapper = mount(defineComponent({
        props: { bar: { type: Boolean, default: true } },
        setup (props) {
          return () => h(ScrollArea.Root as Component, { style: { width: '200px', height: '100px' } }, () => [
            h(ScrollArea.Viewport as Component, { style: { width: '100%', height: '100%' } }, () => [
              h('div', { style: { height: '1000px' } }),
            ]),
            props.bar ? h(ScrollArea.Scrollbar as Component, () => [h(ScrollArea.Thumb as Component)]) : null,
          ])
        },
      }), { attachTo: host() })
      wrappers.push(wrapper)
      await settle()

      const viewport = wrapper.element.firstElementChild as HTMLElement
      expect(viewport.style.overflowY).toBe('scroll')

      await wrapper.setProps({ bar: false })
      await settle()

      expect(viewport.style.overflowY).toBe('hidden')
    })
  })
})
