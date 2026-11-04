import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { useTheme } from '@vuetify/v0'

// Components
import { BootstrapThemeAdapter } from './adapter'
import { createBootstrapPlugin } from './plugin'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { ThemeContext } from '@vuetify/v0'
import type { Plugin } from 'vue'

const teardowns: Array<() => void> = []

function mount (plugin: Plugin): ThemeContext {
  const host = document.createElement('div')
  document.body.append(host)
  let theme: ThemeContext | undefined
  const app = createApp({
    setup () {
      theme = useTheme()
      return () => h('span')
    },
  })
  app.use(plugin)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return theme!
}

afterEach(() => {
  while (teardowns.length > 0) teardowns.pop()?.()
})

describe('createBootstrapPlugin', () => {
  it('should set data-bs-theme and leave data-theme alone', () => {
    const before = document.documentElement.dataset.theme
    mount(createBootstrapPlugin({
      theme: { default: 'light', system: undefined },
    }))

    expect(document.documentElement.dataset.bsTheme).toBe('light')
    expect(document.documentElement.dataset.theme).toBe(before)
    expect(document.documentElement.style.getPropertyValue('--bs-primary-base')).toBe('')
    expect(document.documentElement.style.getPropertyValue('--v0-primary')).toBe('')
  })

  it('should follow select to dark', async () => {
    const theme = mount(createBootstrapPlugin({
      theme: { default: 'light', system: undefined },
    }))

    theme.select('dark')
    await nextTick()

    expect(document.documentElement.dataset.bsTheme).toBe('dark')
  })

  it('should map primary onto --bs-primary-base', () => {
    mount(createBootstrapPlugin({
      theme: {
        default: 'light',
        system: undefined,
        themes: {
          light: { colors: { 'primary': '#7c3aed', 'blue-500': '#112233' } },
        },
      },
    }))

    const root = document.documentElement
    expect(root.style.getPropertyValue('--bs-primary-base')).toBe('#7c3aed')
    expect(root.style.getPropertyValue('--bs-primary')).toBe('')
    expect(root.style.getPropertyValue('--bs-blue-500')).toBe('#112233')
    expect(root.style.getPropertyValue('--v0-primary')).toBe('')
  })

  it('should let an explicit variable win over the role name', () => {
    mount(createBootstrapPlugin({
      theme: {
        default: 'light',
        system: undefined,
        themes: {
          light: { colors: { 'primary': '#111111', 'primary-base': '#222222' } },
        },
      },
    }))

    expect(document.documentElement.style.getPropertyValue('--bs-primary-base')).toBe('#222222')
  })

  it('should drop unsafe color values', () => {
    mount(createBootstrapPlugin({
      theme: {
        default: 'light',
        system: undefined,
        themes: {
          light: { colors: { primary: 'red; background: url(https://example.test)' } },
        },
      },
    }))

    expect(document.documentElement.style.getPropertyValue('--bs-primary-base')).toBe('')
    expect(document.documentElement.getAttribute('style') ?? '').not.toContain('url(')
  })

  it('should remove the attribute and the variables on unmount', () => {
    const theme = mount(createBootstrapPlugin({
      theme: {
        default: 'light',
        system: undefined,
        themes: {
          light: { colors: { primary: '#7c3aed' } },
        },
      },
    }))

    expect(theme).toBeDefined()
    teardowns.pop()?.()

    expect(Object.hasOwn(document.documentElement.dataset, 'bsTheme')).toBe(false)
    expect(document.documentElement.style.getPropertyValue('--bs-primary-base')).toBe('')
  })

  it('should not emit a data-theme stylesheet', () => {
    const adapter = new BootstrapThemeAdapter()
    expect(adapter.generate()).toBe('')
  })
})
