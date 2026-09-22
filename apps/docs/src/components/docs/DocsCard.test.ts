import { describe, expect, it } from 'vitest'

// Context
import DocsCard from './DocsCard.vue'

// Utilities
import { mount } from '@vue/test-utils'

describe('docsCard', () => {
  it('should open href destinations in a new tab, including same-origin demo paths', () => {
    const wrapper = mount(DocsCard, {
      props: { href: '/demo/emerald/' },
      slots: { default: 'Dashboard' },
    })

    const a = wrapper.get('a')
    expect(a.attributes('href')).toBe('/demo/emerald/')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
  })

  it('should not attach link attributes when disabled', () => {
    const wrapper = mount(DocsCard, {
      props: { href: '/demo/emerald/', disabled: true },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('target')).toBeUndefined()
  })
})
