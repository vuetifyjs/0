import { afterEach, describe, expect, it } from 'vitest'

import { createTheme } from './index'

// Utilities
import { createApp, nextTick } from 'vue'

function mountTheme () {
  let api: ReturnType<typeof createTheme>
  const app = createApp({
    setup () {
      api = createTheme({ auto: false, themes: {}, current: 'light' })
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  return { api: api!, app }
}

function styleText () {
  return document.querySelector('#vue-theme-styles')?.textContent ?? ''
}

describe('paper useTheme CSS injection', () => {
  afterEach(() => {
    document.querySelector('#vue-theme-styles')?.remove()
  })

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

  it('should still emit safe color values', async () => {
    const { api } = mountTheme()

    api.set('primary', '#ff0000')
    await nextTick()

    expect(styleText()).toContain('--v0-primary: #ff0000')
  })
})
