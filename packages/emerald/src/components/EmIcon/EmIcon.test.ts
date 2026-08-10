import { afterEach, describe, expect, it, vi } from 'vitest'

// Context
import EmIcon from './EmIcon.vue'

// Utilities
import { createApp, h } from 'vue'

// Types
import type { EmeraldPluginOptions } from '../../plugin'
import type { App } from 'vue'

// Icons
import { createEmIcons, emeraldIconAliases, emeraldIcons, provideEmIcons } from '../../icons'
// Plugin
import { createEmeraldPlugin } from '../../plugin'

const apps: App[] = []

function mount (props: Record<string, unknown>, options?: EmeraldPluginOptions) {
  const host = document.createElement('div')

  document.body.append(host)

  const app = createApp({ render: () => h(EmIcon, props) })

  if (options) app.use(createEmeraldPlugin({ theme: false, ...options }))

  apps.push(app)
  app.mount(host)

  return host
}

function svg (host: HTMLElement) {
  return host.querySelector('svg')
}

function paths (host: HTMLElement) {
  return [...host.querySelectorAll('path')].map(p => p.getAttribute('d'))
}

afterEach(() => {
  for (const app of apps.splice(0)) app.unmount()

  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('emIcon', () => {
  describe('resolution', () => {
    it('draws every path of the named role, in order', () => {
      const host = mount({ name: 'sun' })

      expect(paths(host)).toEqual(emeraldIcons.sun)
    })

    it('resolves an alias to the glyph it points at', () => {
      const host = mount({ name: 'envelope' })

      expect(paths(host)).toEqual(emeraldIcons.mail)
    })

    it('renders without the plugin installed', () => {
      const host = mount({ name: 'chat' })

      expect(paths(host)).toEqual(emeraldIcons.chat)
    })

    it('keeps every declared alias pointing at a real role', () => {
      const icons = createEmIcons()

      const unresolved = Object.keys(emeraldIconAliases)
        .filter(role => !Array.isArray(icons.resolve(role)))

      expect(unresolved).toEqual([])
    })
  })

  describe('overrides', () => {
    it('replaces a built-in role', () => {
      const host = mount({ name: 'star' }, { icons: { icons: { star: ['M0 0h24'] } } })

      expect(paths(host)).toEqual(['M0 0h24'])
    })

    it('extends the vocabulary with a new role', () => {
      const host = mount({ name: 'sparkle' }, { icons: { icons: { sparkle: ['M12 2v20'] } } })

      expect(paths(host)).toEqual(['M12 2v20'])
    })

    it('accepts a consumer alias, braced or bare', () => {
      const braced = mount({ name: 'expand' }, { icons: { aliases: { expand: '{chevron-down}' } } })
      const bare = mount({ name: 'collapse' }, { icons: { aliases: { collapse: 'chevron-up' } } })

      expect(paths(braced)).toEqual(emeraldIcons['chevron-down'])
      expect(paths(bare)).toEqual(emeraldIcons['chevron-up'])
    })

    it('follows an alias to an overridden target', () => {
      const host = mount({ name: 'envelope' }, { icons: { icons: { mail: ['M1 1h1'] } } })

      expect(paths(host)).toEqual(['M1 1h1'])
    })

    it('leaves the app registry unset when icons are disabled', () => {
      const host = mount({ name: 'sun' }, { icons: false })

      expect(paths(host)).toEqual(emeraldIcons.sun)
    })

    it('reads a set provided to a subtree', () => {
      const host = document.createElement('div')

      document.body.append(host)

      const app = createApp({ render: () => h(EmIcon, { name: 'star' }) })

      provideEmIcons(createEmIcons({ icons: { star: ['M2 2h2'] } }), app)

      apps.push(app)
      app.mount(host)

      expect(paths(host)).toEqual(['M2 2h2'])
    })
  })

  describe('accessibility', () => {
    it('hides itself from assistive tech by default', () => {
      const el = svg(mount({ name: 'sun' }))!

      expect(el.getAttribute('aria-hidden')).toBe('true')
      expect(el.hasAttribute('role')).toBe(false)
      expect(el.hasAttribute('aria-label')).toBe(false)
    })

    it('becomes a named image when labelled', () => {
      const el = svg(mount({ name: 'star', label: 'Favourite' }))!

      expect(el.getAttribute('role')).toBe('img')
      expect(el.getAttribute('aria-label')).toBe('Favourite')
      expect(el.hasAttribute('aria-hidden')).toBe(false)
    })
  })

  describe('size', () => {
    it('defaults to the medium step', () => {
      expect(svg(mount({ name: 'sun' }))!.dataset.size).toBe('m')
    })

    it('stamps the requested step', () => {
      expect(svg(mount({ name: 'sun', size: 'xl' }))!.dataset.size).toBe('xl')
    })
  })

  describe('unknown roles', () => {
    it('renders nothing and warns', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount({ name: 'nope' })

      expect(svg(host)).toBeNull()
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('nope'))
    })
  })
})
