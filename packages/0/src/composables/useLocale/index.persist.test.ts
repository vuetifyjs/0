import { describe, expect, it } from 'vitest'

// Composables
import { createStoragePlugin, useStorage } from '#v0/composables/useStorage'

import { createLocalePlugin, useLocale } from './index'

// Utilities
import { createApp, nextTick } from 'vue'

describe('useLocale persist/restore', () => {
  it('should restore a persisted locale before setup', () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin())

    // Pre-seed storage with 'es' so restore() runs
    app.runWithContext(() => {
      const storage = useStorage()
      storage.set('locale', 'es')
    })

    app.use(createLocalePlugin({
      persist: true,
      default: 'en',
      messages: {
        en: { hello: 'Hello' },
        es: { hello: 'Hola' },
      },
    }))

    let restored: unknown
    app.runWithContext(() => {
      const ctx = useLocale()
      restored = ctx.selectedId.value
    })

    expect(restored).toBe('es')
  })

  it('should auto-save the selected locale when it changes', async () => {
    const app = createApp({ render: () => null })
    app.use(createStoragePlugin())

    app.use(createLocalePlugin({
      persist: true,
      default: 'en',
      messages: {
        en: { hello: 'Hello' },
        es: { hello: 'Hola' },
      },
    }))

    app.runWithContext(() => {
      const ctx = useLocale()
      ctx.select('es')
    })

    await nextTick()

    let stored: unknown
    app.runWithContext(() => {
      const storage = useStorage()
      stored = storage.get('locale').value
    })

    expect(stored).toBe('es')
  })
})
