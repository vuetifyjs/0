import { afterEach, describe, expect, it, vi } from 'vitest'

// Context
import EmIcon from './EmIcon.vue'

// Utilities
import { createApp, h } from 'vue'

// Types
import type { EmeraldPluginOptions } from '../../plugin'
import type { EmIconProps } from './EmIcon.vue'
import type { App } from 'vue'

// Icons
import { createEmIcons, emeraldIconAliases, emeraldIcons, provideEmIcons } from '../../icons'
// Plugin
import { createEmeraldPlugin } from '../../plugin'

const apps: App[] = []

function mount (props: EmIconProps, options?: EmeraldPluginOptions) {
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
    it('should draw every path of the named role, in order', () => {
      const host = mount({ name: 'sun' })

      expect(paths(host)).toEqual(emeraldIcons.sun)
    })

    it('should resolve an alias to the glyph it points at', () => {
      const host = mount({ name: 'mail' })

      expect(paths(host)).toEqual(emeraldIcons.envelope)
    })

    it('should render without the plugin installed', () => {
      const host = mount({ name: 'speech-bubble' })

      expect(paths(host)).toEqual(emeraldIcons['speech-bubble'])
    })

    it('should keep every declared alias pointing at a real role', () => {
      const icons = createEmIcons()

      const unresolved = Object.keys(emeraldIconAliases)
        .filter(role => !Array.isArray(icons.resolve(role)))

      expect(unresolved).toEqual([])
    })

    it('should not shadow a canonical role with an alias of the same name', () => {
      const canonical = new Set(Object.keys(emeraldIcons))
      const shadowed = Object.keys(emeraldIconAliases).filter(role => canonical.has(role))

      expect(shadowed).toEqual([])
    })
  })

  describe('overrides', () => {
    it('should replace a built-in role', () => {
      const host = mount({ name: 'star' }, { icons: { icons: { star: ['M0 0h24'] } } })

      expect(paths(host)).toEqual(['M0 0h24'])
    })

    it('should extend the vocabulary with a new role', () => {
      const host = mount({ name: 'rocket' }, { icons: { icons: { rocket: ['M12 2v20'] } } })

      expect(paths(host)).toEqual(['M12 2v20'])
    })

    it('should accept a consumer alias, braced or bare', () => {
      const braced = mount({ name: 'expand' }, { icons: { aliases: { expand: '{chevron-down}' } } })
      const bare = mount({ name: 'collapse' }, { icons: { aliases: { collapse: 'chevron-up' } } })

      expect(paths(braced)).toEqual(emeraldIcons['chevron-down'])
      expect(paths(bare)).toEqual(emeraldIcons['chevron-up'])
    })

    it('should follow an alias to an overridden target', () => {
      const host = mount({ name: 'mail' }, { icons: { icons: { envelope: ['M1 1h1'] } } })

      expect(paths(host)).toEqual(['M1 1h1'])
    })

    it('should move every alias that shares an overridden target', () => {
      const options = { icons: { icons: { card: ['M9 9h6'] } } }

      expect(paths(mount({ name: 'finance' }, options))).toEqual(['M9 9h6'])
      expect(paths(mount({ name: 'payments' }, options))).toEqual(['M9 9h6'])
    })

    it('should leave the app registry unset when icons are disabled', () => {
      const host = mount({ name: 'sun' }, { icons: false })

      expect(paths(host)).toEqual(emeraldIcons.sun)
    })

    it('should read a set provided to a subtree', () => {
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
    it('should hide itself from assistive tech by default', () => {
      const el = svg(mount({ name: 'sun' }))!

      expect(el.getAttribute('aria-hidden')).toBe('true')
      expect(el.hasAttribute('role')).toBe(false)
      expect(el.hasAttribute('aria-label')).toBe(false)
    })

    it('should become a named image when labelled', () => {
      const el = svg(mount({ name: 'star', label: 'Favourite' }))!

      expect(el.getAttribute('role')).toBe('img')
      expect(el.getAttribute('aria-label')).toBe('Favourite')
      expect(el.hasAttribute('aria-hidden')).toBe(false)
    })
  })

  describe('size', () => {
    it('should default to the medium step', () => {
      expect(svg(mount({ name: 'sun' }))!.dataset.size).toBe('m')
    })

    it('should stamp the requested step', () => {
      expect(svg(mount({ name: 'sun', size: 'xl' }))!.dataset.size).toBe('xl')
    })
  })

  describe('unknown roles', () => {
    it('should render nothing and warn once', () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount({ name: 'nope' })

      expect(svg(host)).toBeNull()
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('nope'))
    })
  })
})
