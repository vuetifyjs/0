import { describe, expect, it, vi } from 'vitest'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

// Composables
import { createStoragePlugin, useStorage } from '#v0/composables/useStorage'

import { createRtlPlugin } from './index'

// Utilities
import { createApp, nextTick } from 'vue'

describe('createRtlPlugin persist/restore', () => {
  it('should restore boolean persisted value via real storage', async () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin())

    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('rtl', true)
    })

    app.use(createRtlPlugin({ persist: true }))

    const container = document.createElement('div')
    app.mount(container)
    await nextTick()

    expect(document.documentElement.dir).toBe('rtl')

    app.unmount()
    document.documentElement.dir = ''
  })

  it('should not restore when persisted value is not a boolean', async () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin())

    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('rtl', 'invalid-string')
    })

    app.use(createRtlPlugin({ persist: true, default: false }))

    const container = document.createElement('div')
    app.mount(container)
    await nextTick()

    expect(document.documentElement.dir).toBe('ltr')

    app.unmount()
    document.documentElement.dir = ''
  })
})
