import { describe, expect, it, vi } from 'vitest'

// Framework
import { createStoragePlugin } from '@vuetify/v0'

// Context
import DocsMarkup from './DocsMarkup.vue'

// Composables
import { SettingsPlugin } from '@/composables/useSettings'

// Utilities
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

function encode (text: string): string {
  return btoa(unescape(encodeURIComponent(text)))
}

const code = encode(Array.from({ length: 40 }, (_, index) => `line ${index}`).join('\n'))

function mountMarkup () {
  return mount(DocsMarkup, {
    props: { code, collapse: true, language: 'ts' },
    slots: { default: '<pre class="shiki"><code>code</code></pre>' },
    global: {
      plugins: [createStoragePlugin(), SettingsPlugin],
      stubs: { DocsCodeActions: true },
    },
  })
}

describe('docsMarkup', () => {
  it('should open to the height of the file', async () => {
    const wrapper = mountMarkup()
    await wrapper.get('.genesis-peek').trigger('click')

    const scroller = wrapper.get('.docs-markup__window')
    expect(scroller.attributes('style') ?? '').not.toContain('max-height')
    expect(scroller.classes()).not.toContain('docs-code-window')
  })

  it('should reset the code scroll when collapsed', async () => {
    const wrapper = mountMarkup()
    await wrapper.get('.genesis-peek').trigger('click')

    const code = wrapper.get('.shiki code').element as HTMLElement
    let top = 240
    let left = 80
    Object.defineProperty(code, 'scrollTop', {
      configurable: true,
      get: () => top,
      set: (value: number) => {
        top = value
      },
    })
    Object.defineProperty(code, 'scrollLeft', {
      configurable: true,
      get: () => left,
      set: (value: number) => {
        left = value
      },
    })

    await wrapper.get('.genesis-peek').trigger('click')

    expect(top).toBe(0)
    expect(left).toBe(0)
  })

  it('should scroll the page when the top of the fence is above the header', async () => {
    document.documentElement.style.scrollPaddingTop = '48px'
    const wrapper = mountMarkup()
    await wrapper.get('.genesis-peek').trigger('click')

    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, -180, 100, 580))
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})

    await wrapper.get('.genesis-peek').trigger('click')
    await nextTick()

    expect(scroll).toHaveBeenCalledTimes(1)
    expect(scroll).toHaveBeenCalledWith(0, -228)
    scroll.mockRestore()
  })

  it('should leave the page scroll when the top of the fence is already in view', async () => {
    document.documentElement.style.scrollPaddingTop = '48px'
    const wrapper = mountMarkup()
    await wrapper.get('.genesis-peek').trigger('click')

    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 120, 100, 400))
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})

    await wrapper.get('.genesis-peek').trigger('click')
    await nextTick()

    expect(scroll).not.toHaveBeenCalled()
    scroll.mockRestore()
  })
})
