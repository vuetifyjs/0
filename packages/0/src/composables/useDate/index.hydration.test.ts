import { describe, expect, it } from 'vitest'

// Composables
import { createLocalePlugin } from '#v0/composables/useLocale'

// Adapters
import { V0DateAdapter } from './adapters/v0'

import { hydrate } from '#v0/test-utils/hydrate'

import { createDatePlugin, useDate } from './index'

// Utilities
import { h } from 'vue'

/**
 * Renders a fixed, explicit date (not adapter.date(), which defaults to "now"
 * and would differ between the server and client renders regardless of this
 * fix) alongside the locale-derived firstDayOfWeek, so a server/client
 * mismatch here can only come from the date-plugin locale sync itself.
 */
function DateGrid () {
  const { adapter, firstDayOfWeek } = useDate()
  const date = adapter.date('2024-06-15T00:00:00')!

  return h('div', [
    h('span', { 'data-testid': 'locale' }, adapter.locale),
    h('span', { 'data-testid': 'first-day' }, String(firstDayOfWeek.value)),
    h('span', { 'data-testid': 'formatted' }, adapter.format(date, 'fullDate')),
  ])
}

describe('useDate SSR hydration', () => {
  it('should hydrate a plugin-installed date context with matching locale/firstDayOfWeek and zero mismatches', async () => {
    const adapter = new V0DateAdapter()
    const datePlugin = createDatePlugin({ adapter, locale: 'de-DE' })

    const { html, mismatches } = await hydrate(() => h(DateGrid), {
      setup: app => app.use(datePlugin),
    })

    expect(html).toContain('de-DE')
    expect(html).toContain('>1<') // Monday
    expect(mismatches).toEqual([])
  })

  it('should hydrate useLocale + createDatePlugin together with zero mismatches', async () => {
    const localePlugin = createLocalePlugin({
      default: 'en',
      messages: { en: {}, de: {} },
    })
    const adapter = new V0DateAdapter()
    const datePlugin = createDatePlugin({ adapter, locales: { en: 'en-US', de: 'de-DE' } })

    const { html, mismatches } = await hydrate(() => h(DateGrid), {
      setup: app => {
        app.use(localePlugin)
        app.use(datePlugin)
      },
    })

    expect(html).toContain('en-US')
    expect(html).toContain('>0<') // Sunday
    expect(mismatches).toEqual([])
  })
})
