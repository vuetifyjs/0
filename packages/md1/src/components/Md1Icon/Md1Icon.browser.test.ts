import { afterEach, describe, expect, it, vi } from 'vitest'

// Components
import { Md1Icon } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { Md1IconProps } from './Md1Icon.vue'
import type { App, VNode } from 'vue'

// Icons
import {
  createMd1IconsContext,
  createMd1IconsPlugin,
  createMd1Icons,
  MD1_ICONS_NAMESPACE,
  md1IconAliases,
  md1IconMirrors,
  md1Icons,
} from '../../icons'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  setup?.(app)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

function icon (props: Md1IconProps, setup?: (app: App) => void): HTMLElement {
  return mount(() => h(Md1Icon, props), setup)
}

function svg (host: HTMLElement) {
  return host.querySelector('svg')
}

function paths (host: HTMLElement) {
  return [...host.querySelectorAll('path')].map(p => p.getAttribute('d'))
}

/** A document-level rule standing in for a host component's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quIcon', () => {
  describe('resolution', () => {
    it('should draw every path of the named role, in order', async () => {
      const host = icon({ name: 'schedule' })
      await settle()

      expect(md1Icons.schedule).toHaveLength(2)
      expect(paths(host)).toEqual(md1Icons.schedule)
    })

    it('should render filled artwork on the 24 x 24 grid', async () => {
      const el = svg(icon({ name: 'check' }))!
      await settle()

      expect(el.classList.contains('md1-icon')).toBe(true)
      expect(el.getAttribute('viewBox')).toBe('0 0 24 24')
      expect(el.getAttribute('fill')).toBe('currentColor')
      expect(el.hasAttribute('stroke')).toBe(false)
      expect(el.hasAttribute('stroke-width')).toBe(false)
      expect(paths(icon({ name: 'check' }))).toEqual(md1Icons.check)
    })

    it('should resolve an alias to the glyph it points at', async () => {
      const clear = icon({ name: 'clear' })
      const launch = icon({ name: 'launch' })
      await settle()

      expect(paths(clear)).toEqual(md1Icons.close)
      expect(paths(launch)).toEqual(md1Icons['open-in-new'])
    })

    it('should ship the pinned inventory', () => {
      expect(Object.keys(md1Icons)).toHaveLength(80)
      expect(Object.keys(md1IconAliases)).toHaveLength(27)
    })

    it('should keep every declared alias pointing at a real role', () => {
      const icons = createMd1Icons()

      const unresolved = Object.keys(md1IconAliases)
        .filter(role => !Array.isArray(icons.resolve(role)))

      expect(unresolved).toEqual([])
    })

    it('should not shadow a canonical role with an alias of the same name', () => {
      const canonical = new Set(Object.keys(md1Icons))
      const shadowed = Object.keys(md1IconAliases).filter(role => canonical.has(role))

      expect(shadowed).toEqual([])
    })
  })

  describe('overrides', () => {
    it('should replace a built-in role', async () => {
      const host = icon({ name: 'check' }, app => {
        app.use(createMd1IconsPlugin({ icons: { check: ['M0 0h24'] } }))
      })
      await settle()

      expect(paths(host)).toEqual(['M0 0h24'])
    })

    it('should extend the vocabulary with a new role', async () => {
      const host = icon({ name: 'rocket' }, app => {
        app.use(createMd1IconsPlugin({ icons: { rocket: ['M12 2v20'] } }))
      })
      await settle()

      expect(paths(host)).toEqual(['M12 2v20'])
    })

    it('should accept a consumer alias, braced or bare', async () => {
      const braced = icon({ name: 'expand' }, app => {
        app.use(createMd1IconsPlugin({ aliases: { expand: '{expand-more}' } }))
      })
      const bare = icon({ name: 'collapse' }, app => {
        app.use(createMd1IconsPlugin({ aliases: { collapse: 'expand-less' } }))
      })
      await settle()

      expect(paths(braced)).toEqual(md1Icons['expand-more'])
      expect(paths(bare)).toEqual(md1Icons['expand-less'])
    })

    it('should follow an alias to an overridden target', async () => {
      const host = icon({ name: 'clear' }, app => {
        app.use(createMd1IconsPlugin({ icons: { close: ['M1 1h1'] } }))
      })
      await settle()

      expect(paths(host)).toEqual(['M1 1h1'])
    })

    it('should move every alias that shares an overridden target', async () => {
      function install (app: App) {
        app.use(createMd1IconsPlugin({ icons: { schedule: ['M9 9h6'] } }))
      }

      const clock = icon({ name: 'clock' }, install)
      const builder = icon({ name: 'query-builder' }, install)
      const access = icon({ name: 'access-time' }, install)
      await settle()

      expect(paths(clock)).toEqual(['M9 9h6'])
      expect(paths(builder)).toEqual(['M9 9h6'])
      expect(paths(access)).toEqual(['M9 9h6'])
    })
  })

  describe('installation', () => {
    it('should resolve through the icons plugin under its default namespace', async () => {
      const host = icon({ name: 'star' }, app => {
        app.use(createMd1IconsPlugin({ icons: { star: ['M3 3h3'] } }))
      })
      await settle()

      expect(MD1_ICONS_NAMESPACE).toBe('md1:icons')
      expect(paths(host)).toEqual(['M3 3h3'])
    })

    it('should honour a non-default namespace', async () => {
      const host = icon({ name: 'star', namespace: 'md1:icons-alt' }, app => {
        app.use(createMd1IconsPlugin({
          namespace: 'md1:icons-alt',
          icons: { star: ['M5 5h5'] },
        }))
      })
      await settle()

      expect(paths(host)).toEqual(['M5 5h5'])
    })

    it('should read a collection provided to an app through the context', async () => {
      const host = icon({ name: 'star' }, app => {
        const [, provide, context] = createMd1IconsContext({ icons: { star: ['M2 2h2'] } })

        provide(context, app)
      })
      await settle()

      expect(paths(host)).toEqual(['M2 2h2'])
    })

    it('should fall back to the built-in set with no plugin installed', async () => {
      const host = icon({ name: 'star' })
      await settle()

      expect(paths(host)).toEqual(md1Icons.star)
    })

    it('should share one fallback registry across uninstalled icons', async () => {
      const host = mount(() => h('div', [
        h(Md1Icon, { name: 'menu' }),
        h(Md1Icon, { name: 'search' }),
      ]))
      await settle()

      expect(host.querySelectorAll('svg')).toHaveLength(2)
    })
  })

  describe('accessibility', () => {
    it('should hide itself from assistive tech by default', async () => {
      const el = svg(icon({ name: 'menu' }))!
      await settle()

      expect(el.getAttribute('aria-hidden')).toBe('true')
      expect(el.hasAttribute('role')).toBe(false)
      expect(el.hasAttribute('aria-label')).toBe(false)
    })

    it('should become a named image when labelled', async () => {
      const el = svg(icon({ name: 'star', label: 'Favourite' }))!
      await settle()

      expect(el.getAttribute('role')).toBe('img')
      expect(el.getAttribute('aria-label')).toBe('Favourite')
      expect(el.hasAttribute('aria-hidden')).toBe(false)
    })
  })

  describe('size', () => {
    it('should default to the 24 px system icon', async () => {
      const el = svg(icon({ name: 'menu' }))!
      await settle()

      expect(el.dataset.size).toBe('m')
      expect(getComputedStyle(el).width).toBe('24px')
      expect(getComputedStyle(el).height).toBe('24px')
    })

    it('should stamp the 20 px dense step', async () => {
      const el = svg(icon({ name: 'menu', size: 's' }))!
      await settle()

      expect(el.dataset.size).toBe('s')
      expect(getComputedStyle(el).width).toBe('20px')
      expect(getComputedStyle(el).height).toBe('20px')
    })

    it('should let a single-class host rule outrank the size step', async () => {
      style('.md1-test-host .md1-icon { --md1-icon-size: 32px; }')

      const host = mount(() => h('div', { class: 'md1-test-host' }, [
        h(Md1Icon, { name: 'menu', size: 's' }),
      ]))
      await settle()

      expect(getComputedStyle(svg(host)!).width).toBe('32px')
    })
  })

  describe('mirroring', () => {
    it('should mark a directional role', async () => {
      const el = svg(icon({ name: 'arrow-back' }))!
      await settle()

      expect(el.dataset.mirror).toBe('true')
    })

    it('should give an alias the ruling of the role it resolves to', async () => {
      const launch = svg(icon({ name: 'launch' }))!
      const chevron = svg(icon({ name: 'keyboard-arrow-left' }))!
      const consumer = svg(icon({ name: 'back' }, app => {
        app.use(createMd1IconsPlugin({ aliases: { back: 'arrow-back' } }))
      }))!
      await settle()

      expect(launch.dataset.mirror).toBe('true')
      expect(chevron.dataset.mirror).toBe('true')
      expect(consumer.dataset.mirror).toBe('true')
    })

    it('should mark the question mark as conditional', async () => {
      const el = svg(icon({ name: 'help' }))!
      await settle()

      expect(md1IconMirrors.help).toBe('conditional')
      expect(el.dataset.mirror).toBe('conditional')
    })

    it('should leave symmetric and right-handed roles unmarked', async () => {
      const menu = svg(icon({ name: 'menu' }))!
      const search = svg(icon({ name: 'search' }))!
      const refresh = svg(icon({ name: 'refresh' }))!
      await settle()

      expect(Object.hasOwn(menu.dataset, 'mirror')).toBe(false)
      expect(Object.hasOwn(search.dataset, 'mirror')).toBe(false)
      expect(Object.hasOwn(refresh.dataset, 'mirror')).toBe(false)
    })

    it('should flip directional roles under dir="rtl" and nothing else', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [
        h(Md1Icon, { name: 'arrow-back' }),
        h(Md1Icon, { name: 'menu' }),
      ]))
      await settle()

      const [back, menu] = host.querySelectorAll('svg')

      expect(getComputedStyle(back!).transform).toBe('matrix(-1, 0, 0, 1, 0, 0)')
      expect(getComputedStyle(menu!).transform).toBe('none')
    })

    it('should keep the question mark upright in Hebrew only', async () => {
      const hebrew = mount(() => h('div', { dir: 'rtl', lang: 'he' }, [h(Md1Icon, { name: 'help' })]))
      const arabic = mount(() => h('div', { dir: 'rtl', lang: 'ar' }, [h(Md1Icon, { name: 'help' })]))
      await settle()

      expect(getComputedStyle(svg(hebrew)!).transform).toBe('none')
      expect(getComputedStyle(svg(arabic)!).transform).toBe('matrix(-1, 0, 0, 1, 0, 0)')
    })
  })

  describe('unknown roles', () => {
    it('should render nothing and warn once', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = icon({ name: 'nope' })
      await settle()

      expect(svg(host)).toBeNull()
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('nope'))
    })
  })
})
