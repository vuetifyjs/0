import { describe, expect, it } from 'vitest'

// Composables
import { createThemePlugin } from '#v0/composables/useTheme'

// Utilities
import { mount } from '@vue/test-utils'
import { h } from 'vue'

import { Theme } from './index'

describe('theme', () => {
  const plugin = createThemePlugin({
    default: 'light',
    themes: {
      light: { dark: false, colors: { primary: '#1976d2' } },
      dark: { dark: true, colors: { primary: '#90caf9' } },
    },
  })

  it('should render a wrapper element with data-theme attribute', () => {
    const wrapper = mount(Theme, {
      props: { theme: 'dark' },
      global: { plugins: [plugin] },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('data-theme')).toBe('dark')
    expect(wrapper.text()).toBe('content')
  })

  it('should render custom tag via as prop', () => {
    const wrapper = mount(Theme, {
      props: { theme: 'dark', as: 'section' },
      global: { plugins: [plugin] },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('should fall back to parent theme when no theme prop', () => {
    const wrapper = mount(Theme, {
      global: { plugins: [plugin] },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.attributes('data-theme')).toBe('light')
  })

  it('should expose theme and isDark via slot props', () => {
    const wrapper = mount(Theme, {
      props: { theme: 'dark' },
      global: { plugins: [plugin] },
      slots: {
        default: (props: any) => h('span', `${props.theme}-${props.isDark}`),
      },
    })

    expect(wrapper.text()).toBe('dark-true')
  })

  it('should pass attrs via slot in renderless mode', () => {
    const wrapper = mount(Theme, {
      props: { theme: 'dark', renderless: true },
      global: { plugins: [plugin] },
      slots: {
        default: (props: any) => h('section', props.attrs, 'content'),
      },
    })

    expect(wrapper.find('section').attributes('data-theme')).toBe('dark')
  })
})
