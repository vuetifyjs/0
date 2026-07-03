import { afterEach, describe, expect, it } from 'vitest'

import { createTheme, DEFAULT_LIGHT } from './index'

// Utilities
import { createApp, nextTick } from 'vue'

// Types
import type { ThemeOptions } from './index'
import type { App } from 'vue'

const apps: App[] = []

function mountTheme (options?: ThemeOptions) {
  let api: ReturnType<typeof createTheme>
  const app = createApp({
    setup () {
      api = createTheme(options ?? { auto: false, themes: {}, current: 'light' })
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  apps.push(app)
  return { api: api!, app }
}

function styleText () {
  return document.querySelector('#vue-theme-styles')?.textContent ?? ''
}

describe('paper useTheme', () => {
  afterEach(() => {
    for (const app of apps) app.unmount()
    apps.length = 0
    document.querySelector('#vue-theme-styles')?.remove()
  })

  describe('custom themes', () => {
    it('should merge caller-supplied themes with the defaults', async () => {
      mountTheme({
        auto: false,
        current: 'brand',
        themes: {
          brand: { ...DEFAULT_LIGHT(), colors: { ...DEFAULT_LIGHT().colors, primary: '#123456' } },
        },
      })
      await nextTick()

      expect(styleText()).toContain('--v0-primary: #123456')
    })
  })

  describe('css injection', () => {
    it('should not inject a CSS-breakout color value into the style element', async () => {
      const { api } = mountTheme()

      api.set('primary', 'red } body { display: none } .x { color: red')
      await nextTick()

      expect(styleText()).not.toContain('display: none')
      expect(styleText()).not.toContain('} body')
    })

    it('should reject color values containing url() or @import', async () => {
      const { api } = mountTheme()

      api.set('primary', 'url(https://evil.example/beacon)')
      await nextTick()

      expect(styleText()).not.toContain('url(')
      expect(styleText()).not.toContain('evil.example')
    })

    it('should reject semicolon-based declaration injection', async () => {
      const { api } = mountTheme()

      api.set('primary', 'red; background-image: image-set("https://evil.example/x.png" 1x)')
      await nextTick()

      expect(styleText()).not.toContain('evil.example')
      expect(styleText()).not.toContain('background-image')
    })

    it('should reject escape-sequence evasion of the function denylist', async () => {
      const { api } = mountTheme()

      api.set('primary', String.raw`\75 rl(https://evil.example/beacon)`)
      await nextTick()

      expect(styleText()).not.toContain('evil.example')
    })

    it('should still emit safe color values', async () => {
      const { api } = mountTheme()

      api.set('primary', '#ff0000')
      await nextTick()

      expect(styleText()).toContain('--v0-primary: #ff0000')
    })
  })
})
