import { afterEach, describe, expect, it } from 'vitest'

import { createLoggerPlugin } from '#v0/composables'

import { mountVapor } from './mount'

// Types
import type { MountOptions, VaporMount } from './mount'

import InjectionProbe from '../src/InjectionProbe.vue'

// createPlugin/index.ts gates every generated useX() consumer on
// hasInjectionContext() before inject()ing the plugin context. The whole v0
// plugin family (useLogger, useTheme, useLocale, …) therefore depends on
// hasInjectionContext() being vapor-aware — in Vue 3.6 it reads
// getCurrentGenericInstance() || currentApp, NOT the vdom-only
// getCurrentInstance(). These tests pin that guarantee against a real Vapor
// render so an upstream regression fails loudly here instead of silently
// downgrading every plugin consumer to its fallback.
describe('injection context under vapor', () => {
  let wrapper: VaporMount

  afterEach(() => {
    wrapper?.unmount()
  })

  function probe (options: MountOptions = {}) {
    wrapper = mountVapor(InjectionProbe, options)
    return wrapper.host.firstElementChild as HTMLElement
  }

  it('should report hasInjectionContext() true inside vapor setup', () => {
    const el = probe()

    expect(el.dataset.hasInjectionContext).toBe('true')
    // ...even though the vdom accessor is genuinely null — proving the
    // guarantee does not come from getCurrentInstance().
    expect(el.dataset.rawNull).toBe('true')
  })

  it('should resolve an app-level provide via inject()', () => {
    const el = probe({ provide: { 'vapor-probe': 'from-app' } })

    expect(el.dataset.injected).toBe('from-app')
  })

  it('should resolve a provided plugin context through the createPlugin consumer', () => {
    // The real createPlugin path: app.use(createXPlugin()) provides at the
    // app level, useX() inside the vapor component injects it back. current()
    // returning the configured level proves the PROVIDED context resolved,
    // not the fallback (which always reports 'info' and ignores level()).
    const el = probe({ plugins: [createLoggerPlugin({ level: 'debug' })] })

    expect(el.dataset.loggerError).toBe('')
    expect(el.dataset.loggerLevel).toBe('debug')
  })

  it('should resolve the fallback without throwing when the plugin is absent', () => {
    const el = probe()

    expect(el.dataset.loggerError).toBe('')
    expect(el.dataset.loggerLevel).toBe('info')
  })
})
