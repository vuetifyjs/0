import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Framework
import { createLoggerPlugin, createStoragePlugin, MemoryStorageAdapter } from '@vuetify/v0'

// Context
import AppBanner from './AppBanner.vue'

// Utilities
import { flushPromises, mount } from '@vue/test-utils'

const COOLDOWN_KEY = 'v0:v0-docs-banner-cooldown'
const DISMISSED_KEY = 'v0:v0-docs-banner-dismissed'
const SNOOZE_KEY = 'v0:v0-docs-banner-snooze'
const FUTURE = Date.now() + 86_400_000

interface BannerInput {
  slug: string
  text?: string
  site?: string[]
  ignore_delay?: boolean | null
  priority?: string
  created_at?: string
}

function banner (input: BannerInput) {
  return {
    slug: input.slug,
    created_at: input.created_at ?? '2026-11-01T00:00:00.000Z',
    metadata: {
      text: input.text ?? input.slug,
      site: input.site ?? ['v0-docs'],
      ignore_delay: input.ignore_delay,
      priority: input.priority ?? '0',
    },
  }
}

function seed (state: {
  cooldown?: number
  dismissed?: string[]
  snooze?: Record<string, number>
} = {}) {
  // Node's global localStorage is unset unless --localstorage-file is passed,
  // so the banner store is an explicit memory adapter instead of window.localStorage.
  const storage = new MemoryStorageAdapter()
  if (state.cooldown !== undefined) storage.setItem(COOLDOWN_KEY, JSON.stringify(state.cooldown))
  if (state.dismissed) storage.setItem(DISMISSED_KEY, JSON.stringify(state.dismissed))
  if (state.snooze) storage.setItem(SNOOZE_KEY, JSON.stringify(state.snooze))
  return storage
}

async function mountBanner (
  banners: ReturnType<typeof banner>[],
  storage = seed(),
) {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => ({ banners }),
  })))

  const wrapper = mount(AppBanner, {
    global: {
      plugins: [createLoggerPlugin(), createStoragePlugin({ adapter: storage })],
      stubs: {
        AppIcon: true,
        AppTooltip: true,
      },
    },
  })

  await flushPromises()
  return wrapper
}

describe('appBanner', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    document.documentElement.style.removeProperty('--app-banner-h')
  })

  const rows = [
    banner({ slug: 'blank', text: '', ignore_delay: true, priority: '9' }),
    banner({ slug: 'other-site', text: 'Docs only', site: ['docs'], ignore_delay: true, priority: '8' }),
    banner({ slug: 'news', text: 'September', priority: '2', created_at: '2026-11-02T00:00:00.000Z' }),
    banner({ slug: 'sale', text: 'Black Friday', ignore_delay: true, priority: '1', created_at: '2026-11-20T00:00:00.000Z' }),
    banner({ slug: 'late', text: 'Cyber Monday', ignore_delay: true, priority: '0', created_at: '2026-11-25T00:00:00.000Z' }),
  ]

  it('should hide ordinary banners while the global cooldown is active', async () => {
    const wrapper = await mountBanner(
      [banner({ slug: 'news', text: 'September' })],
      seed({ cooldown: FUTURE }),
    )

    expect(wrapper.find('header').exists()).toBe(false)
    wrapper.unmount()
  })

  it('should show an ignore_delay banner during the cooldown', async () => {
    const wrapper = await mountBanner(rows, seed({ cooldown: FUTURE }))

    expect(wrapper.get('header').text()).toContain('Black Friday')
    expect(wrapper.get('header').text()).not.toContain('September')
    wrapper.unmount()
  })

  it('should keep a dismissed ignore_delay slug hidden during the cooldown', async () => {
    const wrapper = await mountBanner(rows, seed({ cooldown: FUTURE, dismissed: ['sale'] }))

    expect(wrapper.get('header').text()).toContain('Cyber Monday')
    expect(wrapper.get('header').text()).not.toContain('Black Friday')
    expect(wrapper.get('header').text()).not.toContain('September')
    wrapper.unmount()
  })

  it('should hide every row when the ignore_delay banner is dismissed and nothing else bypasses cooldown', async () => {
    const wrapper = await mountBanner([
      banner({ slug: 'sale', text: 'Black Friday', ignore_delay: true }),
      banner({ slug: 'news', text: 'September' }),
    ], seed({ cooldown: FUTURE, dismissed: ['sale'] }))

    expect(wrapper.find('header').exists()).toBe(false)
    wrapper.unmount()
  })

  it('should keep a snoozed ignore_delay slug hidden during the cooldown', async () => {
    const wrapper = await mountBanner([
      banner({ slug: 'sale', text: 'Black Friday', ignore_delay: true }),
    ], seed({ cooldown: FUTURE, snooze: { sale: FUTURE } }))

    expect(wrapper.find('header').exists()).toBe(false)
    wrapper.unmount()
  })

  it('should treat ignore_delay false and null as subject to the cooldown', async () => {
    const wrapper = await mountBanner([
      banner({ slug: 'off', text: 'Off', ignore_delay: false }),
      banner({ slug: 'empty', text: 'Empty', ignore_delay: null }),
    ], seed({ cooldown: FUTURE }))

    expect(wrapper.find('header').exists()).toBe(false)
    wrapper.unmount()
  })

  it('should prefer a higher-priority ordinary banner when the cooldown is inactive', async () => {
    const wrapper = await mountBanner(rows, seed())

    expect(wrapper.get('header').text()).toContain('September')
    expect(wrapper.get('header').text()).not.toContain('Black Friday')
    wrapper.unmount()
  })
})
