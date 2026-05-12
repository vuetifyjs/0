import { describe, expect, it } from 'vitest'

// Composables
import { createLocalePlugin, useLocale } from '#v0/composables'

import { Locale } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

function createPlugin (options: Record<string, any> = {}) {
  return createLocalePlugin({
    default: 'en',
    messages: {
      en: {
        greeting: 'Hello',
        farewell: 'Goodbye, {name}!',
        count: '{0} items',
      },
      fr: {
        greeting: 'Bonjour',
        farewell: 'Au revoir, {name} !',
        count: '{0} éléments',
      },
      es: {
        greeting: 'Hola',
        farewell: '¡Adiós, {name}!',
        count: '{0} elementos',
      },
    },
    ...options,
  })
}

describe('locale', () => {
  it('should render a wrapper element with data-locale and lang attributes', () => {
    const plugin = createPlugin()
    const wrapper = mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('data-locale')).toBe('fr')
    expect(wrapper.attributes('lang')).toBe('fr')
    expect(wrapper.text()).toBe('content')
  })

  it('should render custom tag via as prop', () => {
    const plugin = createPlugin()
    const wrapper = mount(Locale, {
      props: { locale: 'fr', as: 'section' },
      global: { plugins: [plugin] },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('should pass attrs via slot in renderless mode', () => {
    const plugin = createPlugin()
    const wrapper = mount(Locale, {
      props: { locale: 'fr', renderless: true },
      global: { plugins: [plugin] },
      slots: {
        default: (props: any) => h('section', props.attrs, 'content'),
      },
    })

    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
    expect(section.attributes('data-locale')).toBe('fr')
    expect(section.attributes('lang')).toBe('fr')
  })

  it('should not render a wrapper element in renderless mode', () => {
    const plugin = createPlugin()
    const wrapper = mount(Locale, {
      props: { locale: 'es', renderless: true },
      global: { plugins: [plugin] },
      slots: {
        default: (props: any) => h('div', props.attrs, 'child'),
      },
    })

    // The root element should be the slot content, not a wrapper
    const div = wrapper.find('div')
    expect(div.exists()).toBe(true)
    expect(div.attributes('data-locale')).toBe('es')
    expect(div.attributes('lang')).toBe('es')
  })

  it('should provide scoped locale context to children', () => {
    const plugin = createPlugin()
    let captured: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.t('greeting')
        return () => h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    expect(captured).toBe('Bonjour')
  })

  it('should translate with positional parameters', () => {
    const plugin = createPlugin()
    let captured: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.t('count', 5)
        return () => h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    expect(captured).toBe('5 éléments')
  })

  it('should translate with named parameters', () => {
    const plugin = createPlugin()
    let captured: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.t('farewell', { name: 'World' })
        return () => h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'es' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    expect(captured).toBe('¡Adiós, World!')
  })

  it('should scope selectedId to the provided locale', () => {
    const plugin = createPlugin()
    let capturedId: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        capturedId = locale.selectedId.value as string
        return {}
      },
      render () {
        return h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'es' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    expect(capturedId).toBe('es')
  })

  it('should support nested locale scoping', () => {
    const plugin = createPlugin()

    let captured: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.t('greeting')
        return () => h('span')
      },
    })

    // Outer: fr, Inner: es
    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: {
        default: () => h(Locale, { locale: 'es' }, {
          default: () => h(Child),
        }),
      },
    })

    // Inner child should resolve to Spanish
    expect(captured).toBe('Hola')
  })

  it('should not affect parent locale context', () => {
    const plugin = createPlugin()
    let parentGreeting: string | undefined
    let childGreeting: string | undefined

    const ParentReader = defineComponent({
      setup () {
        const locale = useLocale()
        parentGreeting = locale.t('greeting')
        return () => h('span')
      },
    })

    const ChildReader = defineComponent({
      setup () {
        const locale = useLocale()
        childGreeting = locale.t('greeting')
        return () => h('span')
      },
    })

    mount({
      setup () {
        return () => h('div', [
          h(ParentReader),
          h(Locale, { locale: 'fr' }, {
            default: () => h(ChildReader),
          }),
        ])
      },
    }, {
      global: { plugins: [plugin] },
    })

    expect(parentGreeting).toBe('Hello')
    expect(childGreeting).toBe('Bonjour')
  })

  it('should update data-locale when locale prop changes', async () => {
    const plugin = createPlugin()
    const wrapper = mount(Locale, {
      props: { locale: 'en' },
      global: { plugins: [plugin] },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.attributes('data-locale')).toBe('en')
    expect(wrapper.attributes('lang')).toBe('en')

    await wrapper.setProps({ locale: 'fr' })

    expect(wrapper.attributes('data-locale')).toBe('fr')
    expect(wrapper.attributes('lang')).toBe('fr')
  })

  it('should scope number formatting via n()', () => {
    const plugin = createPlugin()
    let captured: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.n(1234)
        return () => h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    expect(captured).toBeDefined()
    expect(typeof captured).toBe('string')
  })

  it('should pass attrs in slot props when using wrapper mode', () => {
    const plugin = createPlugin()
    let capturedAttrs: Record<string, unknown> | undefined

    const wrapper = mount(Locale, {
      props: { locale: 'es' },
      global: { plugins: [plugin] },
      slots: {
        default: (props: any) => {
          capturedAttrs = props.attrs
          return h('div', 'content')
        },
      },
    })

    expect(capturedAttrs).toBeDefined()
    expect(capturedAttrs!['data-locale']).toBe('es')
    expect(capturedAttrs!.lang).toBe('es')
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('should propagate rootT through nested Locale scopes', () => {
    const plugin = createPlugin()
    let captured: string | undefined

    const DeepChild = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.t('greeting')
        return () => h('span')
      },
    })

    // Outer: fr, Middle: es, Inner child reads es
    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: {
        default: () =>
          h(Locale, { locale: 'es' }, {
            default: () => h(DeepChild),
          }),
      },
    })

    expect(captured).toBe('Hola')
  })

  it('should handle missing key in scoped locale', () => {
    const plugin = createPlugin()
    let captured: string | undefined

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        captured = locale.t('nonexistent.key')
        return () => h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    // Should return the key itself when not found
    expect(captured).toBe('nonexistent.key')
  })

  it('should restore parent selectedIds after scoped t() call', () => {
    const plugin = createPlugin()
    let parentId: unknown
    let childId: unknown

    const ChildReader = defineComponent({
      setup () {
        const locale = useLocale()
        childId = locale.selectedId.value
        // Call t() which temporarily swaps selectedIds
        locale.t('greeting')
        return () => h('span')
      },
    })

    const ParentVerifier = defineComponent({
      setup () {
        const locale = useLocale()
        parentId = locale.selectedId.value
        return () => h('div', [
          h(Locale, { locale: 'fr' }, {
            default: () => h(ChildReader),
          }),
        ])
      },
    })

    mount(ParentVerifier, {
      global: { plugins: [plugin] },
    })

    expect(parentId).toBe('en')
    expect(childId).toBe('fr')
  })

  it('should expose selectedItem for the scoped locale', () => {
    const plugin = createPlugin()
    let capturedItem: unknown

    const Child = defineComponent({
      setup () {
        const locale = useLocale()
        capturedItem = locale.selectedItem.value
        return () => h('span')
      },
    })

    mount(Locale, {
      props: { locale: 'fr' },
      global: { plugins: [plugin] },
      slots: { default: () => h(Child) },
    })

    expect(capturedItem).toBeDefined()
  })
})
