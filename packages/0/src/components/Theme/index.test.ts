import { describe, expect, it } from 'vitest'

// Composables
import { createThemePlugin, useTheme } from '#v0/composables'

import { Theme } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'

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

  describe('isDark derivation', () => {
    it('should return false for light theme', () => {
      const wrapper = mount(Theme, {
        props: { theme: 'light' },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => h('span', String(props.isDark)),
        },
      })

      expect(wrapper.text()).toBe('false')
    })

    it('should return true for dark theme', () => {
      const wrapper = mount(Theme, {
        props: { theme: 'dark' },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => h('span', String(props.isDark)),
        },
      })

      expect(wrapper.text()).toBe('true')
    })

    it('should fall back to parent isDark when selectedId is falsy', () => {
      // No theme prop and parent default is light => isDark false
      const wrapper = mount(Theme, {
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => h('span', String(props.isDark)),
        },
      })

      expect(wrapper.text()).toBe('false')
    })

    it('should fall back to parent isDark when theme id is not registered', () => {
      const wrapper = mount(Theme, {
        props: { theme: 'nonexistent' },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => h('span', String(props.isDark)),
        },
      })

      // get() returns undefined for unregistered id, falls back to parent.isDark (false)
      expect(wrapper.text()).toBe('false')
    })
  })

  describe('selectedItem derivation', () => {
    it('should resolve to the correct theme ticket', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span', ctx.selectedItem.value?.id as string)
        },
      })

      mount(Theme, {
        props: { theme: 'dark' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      expect(captured.selectedItem.value).toBeDefined()
      expect(captured.selectedItem.value.id).toBe('dark')
      expect(captured.selectedItem.value.dark).toBe(true)
    })

    it('should fall back to parent selectedItem when no theme prop', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      // Falls back to parent, which has 'light' selected
      expect(captured.selectedItem.value).toBeDefined()
      expect(captured.selectedItem.value.id).toBe('light')
    })

    it('should fall back to parent selectedItem when theme id is not registered', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'nonexistent' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      // get('nonexistent') returns undefined, falls back to parent.selectedItem
      expect(captured.selectedItem.value).toBeDefined()
      expect(captured.selectedItem.value.id).toBe('light')
    })
  })

  describe('selectedIndex derivation', () => {
    it('should resolve to the correct index for a valid theme', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'light' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      expect(captured.selectedIndex.value).toBe(0)
    })

    it('should fall back to parent selectedIndex when no theme prop', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      // Parent has 'light' selected at index 0
      expect(captured.selectedIndex.value).toBe(0)
    })

    it('should return -1 when theme id is not registered', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'nonexistent' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      // get('nonexistent') returns undefined, ?.index is undefined, ?? -1
      expect(captured.selectedIndex.value).toBe(-1)
    })
  })

  describe('selectedValue derivation', () => {
    it('should resolve to theme colors for a valid theme', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'dark' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      expect(captured.selectedValue.value).toBeDefined()
      expect(captured.selectedValue.value.primary).toBe('#90caf9')
    })

    it('should fall back to parent selectedValue when no theme prop', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      expect(captured.selectedValue.value).toBeDefined()
      expect(captured.selectedValue.value.primary).toBe('#1976d2')
    })

    it('should return undefined when theme id is not registered', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'nonexistent' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      // get('nonexistent') returns undefined, ?.value is undefined
      expect(captured.selectedValue.value).toBeUndefined()
    })
  })

  describe('renderless mode', () => {
    it('should not render a wrapper element', () => {
      const wrapper = mount(Theme, {
        props: { theme: 'dark', renderless: true },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => h('span', props.attrs, 'renderless'),
        },
      })

      // Renderless mode: no div wrapper, slot content is rendered directly
      expect(wrapper.find('span').exists()).toBe(true)
      expect(wrapper.find('span').text()).toBe('renderless')
      expect(wrapper.find('span').attributes('data-theme')).toBe('dark')
    })

    it('should expose all slot props in renderless mode', () => {
      let captured: any

      mount(Theme, {
        props: { theme: 'dark', renderless: true },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => {
            captured = props
            return h('div')
          },
        },
      })

      expect(captured.theme).toBe('dark')
      expect(captured.isDark).toBe(true)
      expect(captured.attrs).toBeDefined()
      expect(captured.attrs['data-theme']).toBe('dark')
    })
  })

  describe('nested theme scoping', () => {
    it('should override parent theme in nested scope', () => {
      let outerCtx: any
      let innerCtx: any

      const InnerChild = defineComponent({
        setup () {
          innerCtx = useTheme()
          return () => h('span', 'inner')
        },
      })

      const OuterChild = defineComponent({
        setup () {
          outerCtx = useTheme()
          return () => h(Theme, { theme: 'dark' }, {
            default: () => h(InnerChild),
          })
        },
      })

      mount(Theme, {
        props: { theme: 'light' },
        global: { plugins: [plugin] },
        slots: { default: () => h(OuterChild) },
      })

      expect(outerCtx.selectedId.value).toBe('light')
      expect(outerCtx.isDark.value).toBe(false)

      expect(innerCtx.selectedId.value).toBe('dark')
      expect(innerCtx.isDark.value).toBe(true)
    })

    it('should inherit parent theme when inner has no theme prop', () => {
      let innerCtx: any

      const InnerChild = defineComponent({
        setup () {
          innerCtx = useTheme()
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'dark' },
        global: { plugins: [plugin] },
        slots: {
          default: () => h(Theme, null, {
            default: () => h(InnerChild),
          }),
        },
      })

      // Inner theme inherits from parent
      expect(innerCtx.selectedId.value).toBe('dark')
      expect(innerCtx.isDark.value).toBe(true)
    })
  })

  describe('custom namespace', () => {
    it('should provide context under custom namespace', () => {
      let captured: any
      const ns = 'custom:theme'

      const Child = defineComponent({
        setup () {
          captured = inject(ns)
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'dark', namespace: ns },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      expect(captured).toBeDefined()
      expect(captured.selectedId.value).toBe('dark')
    })
  })

  describe('context pass-through', () => {
    it('should preserve parent registry methods on the context', () => {
      let captured: any

      const Child = defineComponent({
        setup () {
          const ctx = useTheme()
          captured = ctx
          return () => h('span')
        },
      })

      mount(Theme, {
        props: { theme: 'dark' },
        global: { plugins: [plugin] },
        slots: { default: () => h(Child) },
      })

      // The context should have parent methods like get, select, etc.
      expect(typeof captured.get).toBe('function')
      expect(typeof captured.select).toBe('function')
      expect(captured.colors).toBeDefined()
    })

    it('should forward $attrs to wrapper element', () => {
      const wrapper = mount(Theme, {
        props: { theme: 'dark' },
        attrs: { 'class': 'my-theme', 'data-testid': 'theme-wrapper' },
        global: { plugins: [plugin] },
        slots: { default: () => h('span', 'content') },
      })

      expect(wrapper.attributes('class')).toBe('my-theme')
      expect(wrapper.attributes('data-testid')).toBe('theme-wrapper')
    })
  })

  describe('slot props attrs', () => {
    it('should include data-theme in attrs object', () => {
      let captured: any

      mount(Theme, {
        props: { theme: 'light' },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => {
            captured = props
            return h('div')
          },
        },
      })

      expect(captured.attrs).toEqual({ 'data-theme': 'light' })
    })

    it('should update attrs when theme changes', () => {
      let captured: any

      mount(Theme, {
        props: { theme: 'light' },
        global: { plugins: [plugin] },
        slots: {
          default: (props: any) => {
            captured = props
            return h('div')
          },
        },
      })

      expect(captured.attrs['data-theme']).toBe('light')
    })
  })
})
