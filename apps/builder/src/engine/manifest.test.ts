import { describe, expect, it } from 'vitest'

import {
  collectDependencies,
  generateDateStub,
  generateFiles,
  generateFramework,
  generateImports,
  generateMainTs,
  needsDateStub,
  toHashData,
} from './manifest'

function build (features: string[], resolved: string[] = []) {
  return generateFiles({ intent: 'spa', features, resolved, adapters: {} })
}

describe('generateFiles', () => {
  it('should generate SelectionDemo when selection features are selected', () => {
    const files = build(['createSingle'], ['createContext', 'createModel', 'createTrinity'])

    expect(files['src/SelectionDemo.vue']).toContain('Single.Root')
    expect(files['src/App.vue']).toContain('SelectionDemo')
  })

  it('should generate FormDemo when form features are selected', () => {
    const files = build(['createForm'], ['createContext'])

    expect(files['src/FormDemo.vue']).toContain('<Form')
    expect(files['src/App.vue']).toContain('FormDemo')
  })

  it('should generate DataDemo when data features are selected', () => {
    const files = build(['createDataTable'], ['createContext'])

    expect(files['src/DataDemo.vue']).toContain('createDataTable')
    expect(files['src/App.vue']).toContain('DataDemo')
  })

  it('should generate multiple demos for mixed feature sets', () => {
    const files = build(
      ['createSingle', 'createForm', 'useResizeObserver'],
      ['createContext', 'createModel', 'createTrinity'],
    )

    expect(files['src/SelectionDemo.vue']).toBeDefined()
    expect(files['src/FormDemo.vue']).toBeDefined()
    expect(files['src/ObserverDemo.vue']).toBeDefined()
    expect(files['src/App.vue']).toContain('SelectionDemo')
    expect(files['src/App.vue']).toContain('FormDemo')
    expect(files['src/App.vue']).toContain('ObserverDemo')
  })

  it('should not generate main.ts or uno.config.ts', () => {
    const files = build(['createSingle', 'useTheme'], ['createContext'])

    expect(files['src/main.ts']).toBeUndefined()
    expect(files['src/uno.config.ts']).toBeUndefined()
  })

  it('should generate a fallback App.vue when only plugins are selected', () => {
    const files = build(['useTheme', 'useLocale'], ['createContext'])

    expect(Object.keys(files).toSorted()).toEqual(['src/App.vue', 'src/framework.ts'])
    expect(files['src/App.vue']).toContain('framework.ts')
  })

  it('should show the feature count in App.vue', () => {
    const files = build(['createSingle', 'useTheme'], ['createContext', 'createModel'])

    expect(files['src/App.vue']).toContain('4 features loaded')
  })

  it('should generate demos from component selections alone', () => {
    const files = build(['Tabs', 'Dialog'])

    expect(files['src/SelectionDemo.vue']).toContain('Tabs.Root')
    expect(files['src/DisclosureDemo.vue']).toContain('Dialog.Root')
  })
})

describe('generateFramework', () => {
  it('should re-export selected components from the package root', () => {
    const source = generateFramework(['Dialog', 'Button'])

    expect(source).toContain(`import * as v0 from '@vuetify/v0'`)
    expect(source).toContain('export const Button = v0.Button')
    expect(source).toContain('export const Dialog = v0.Dialog')
  })

  // The playground compiles a re-exported import into a getter over a binding
  // it never declares, so the demos die with "X is not defined" at render.
  it('should bind through locals rather than re-exporting', () => {
    const source = generateFramework(['Dialog', 'Button'])

    expect(source).not.toMatch(/export\s*\{[^}]*\}\s*from/)
    expect(source).not.toMatch(/import\s*\{[^}]*\}\s*from\s*'@vuetify\/v0'/)
  })

  it('should deduplicate and sort symbols', () => {
    const source = generateFramework(['Dialog', 'Button', 'Dialog'])

    expect(source.match(/export const Dialog\b/g)).toHaveLength(1)
    expect(source.indexOf('Button')).toBeLessThan(source.indexOf('export const Dialog'))
  })

  it('should include a users picks even when no demo uses them', () => {
    const files = build(['Avatar', 'Treeview'])

    expect(files['src/framework.ts']).toContain('export const Avatar = v0.Avatar')
    expect(files['src/framework.ts']).toContain('export const Treeview = v0.Treeview')
  })

  it('should include every symbol the generated demos import', () => {
    const files = build(['createForm'])
    const framework = files['src/framework.ts']

    for (const symbol of ['Button', 'Form', 'Input']) {
      expect(framework).toContain(`export const ${symbol} = v0.${symbol}`)
    }
  })

  it('should not import the package under an empty selection', () => {
    const source = generateFramework([])

    expect(source).toContain('export {}')
    expect(source).not.toMatch(/^import /m)
  })
})

describe('generated demos', () => {
  const ALL = [
    'createStep', 'Tabs', 'createGroup', 'createSingle', 'createSelection',
    'createForm', 'createSlider', 'createRating', 'createCombobox',
    'createDataTable', 'createPagination', 'createFilter', 'createVirtual',
    'usePopover', 'Dialog', 'useResizeObserver', 'useIntersectionObserver',
  ]

  // Each feature is generated in isolation so the fallthrough branches of every
  // generator are covered rather than only the first match.
  const sources = ALL.flatMap(feature => {
    const files = build([feature])
    return Object.entries(files)
      .filter(([path]) => path.endsWith('.vue'))
      .map(([path, code]) => [feature, path, code] as const)
  })

  it.each(sources)('%s / %s should not use native form controls', (_feature, _path, code) => {
    expect(code).not.toMatch(/<(button|input|select|textarea|form)[\s>]/)
  })

  it.each(sources)('%s / %s should import from the users framework', (_feature, path, code) => {
    if (path === 'src/App.vue') return
    expect(code).toContain(`from './framework'`)
    expect(code).not.toContain(`from '@vuetify/v0'`)
  })

  it('should not call isSelected as a method on a composable instance', () => {
    for (const [,, code] of sources) {
      expect(code).not.toMatch(/\.isSelected\(/)
    }
  })

  it('should pass ticket objects to onboard, never bare strings', () => {
    const files = build(['createDataTable'])

    expect(files['src/DataDemo.vue']).toContain('table.onboard(users.map(value => ({ id: value.id, value })))')
  })
})

describe('generateMainTs', () => {
  it('should import UnoCSS so the utility classes in the demos resolve', () => {
    expect(generateMainTs([], {})).toContain(`import 'virtual:uno.css'`)
  })

  it('should import the date adapter from the date subpath', () => {
    const source = generateMainTs(['useDate'], {})

    expect(source).toContain(`} from '@vuetify/v0/date'`)
    expect(source).toContain('new V0DateAdapter()')
    // The factory stays on the root barrel.
    expect(source).toMatch(/createDatePlugin,[\s\S]*} from '@vuetify\/v0'/)
  })

  it('should import the custom date adapter from the local stub', () => {
    const source = generateMainTs(['useDate'], { useDate: { adapter: 'custom' } })

    expect(source).toContain(`} from './adapters/date'`)
    expect(source).toContain('new CustomDateAdapter()')
  })

  it('should import notification adapters from the notifications subpath', () => {
    const source = generateMainTs(
      ['useNotifications'],
      { useNotifications: { adapter: 'KnockNotificationsAdapter' } },
    )

    expect(source).toContain(`import { KnockNotificationsAdapter } from '@vuetify/v0/notifications'`)
  })

  it('should import feature adapters from their per-provider subpath', () => {
    const cases = [
      ['PostHogFeaturesAdapter', '@vuetify/v0/features/adapters/posthog'],
      ['LaunchDarklyFeaturesAdapter', '@vuetify/v0/features/adapters/launchdarkly'],
      ['FlagsmithFeaturesAdapter', '@vuetify/v0/features/adapters/flagsmith'],
    ]

    for (const [adapter, module] of cases) {
      const source = generateMainTs(['useFeatures'], { useFeatures: { adapter } })
      expect(source).toContain(`import { ${adapter} } from '${module}'`)
    }
  })

  it('should group every symbol from one module into a single import', () => {
    const source = generateMainTs(['useTheme', 'useRtl', 'useStack'], {})
    const roots = source.match(/from '@vuetify\/v0'/g) ?? []

    expect(roots).toHaveLength(1)
  })

  it('should keep the logger adapters on the root barrel', () => {
    const source = generateMainTs(['useLogger'], {})

    expect(source).toContain('new V0LoggerAdapter()')
    expect(source).toMatch(/V0LoggerAdapter,[\s\S]*} from '@vuetify\/v0'/)
  })

  it('should emit wiring instructions rather than an uncompilable constructor', () => {
    const source = generateMainTs(['useLogger'], { useLogger: { adapter: 'ConsolaLoggerAdapter' } })

    // The adapter takes a consola instance the builder cannot construct.
    expect(source).not.toContain('new ConsolaLoggerAdapter()')
    expect(source).toContain('// TODO: ConsolaLoggerAdapter needs a consola instance')
    expect(source).toContain('app.use(createLoggerPlugin())')
  })

  it('should emit rule aliases as real predicates', () => {
    const source = generateMainTs(['useRules'], { useRules: { aliases: ['required', 'email'] } })

    expect(source).toContain(`required: (v: unknown) =>`)
    expect(source).toContain(`email: (v: unknown) =>`)
    expect(source).toContain(`satisfies RulesOptions['aliases']`)
    expect(source).toContain(`import type {`)
    // Never a JSON array of names.
    expect(source).not.toContain(`"required"`)
  })

  it('should stub unknown rule aliases with a TODO', () => {
    const source = generateMainTs(['useRules'], { useRules: { aliases: ['bespoke'] } })

    expect(source).toContain('bespoke: (v: unknown) => true /* TODO: implement */')
  })

  it('should emit permissions as tuples and drop the legacy roles key', () => {
    const config = { usePermissions: { permissions: { admin: [[['read'], ['post']]] }, roles: ['admin'] } }
    const source = generateMainTs(['usePermissions'], config)

    expect(source).toContain('permissions:')
    expect(source).not.toContain('roles')
  })

  it('should emit locale without an adapter or a locales key', () => {
    const config = { useLocale: { default: 'en', fallback: 'en', adapter: 'built-in', locales: ['en'] } }
    const source = generateMainTs(['useLocale'], config)

    expect(source).toContain(`default: "en"`)
    expect(source).toContain(`fallback: "en"`)
    expect(source).not.toContain('adapter')
    expect(source).not.toContain('locales')
    expect(source).not.toContain('vue-i18n')
  })

  it('should emit theme foreground at the top level', () => {
    const config = {
      useTheme: {
        default: 'light',
        foreground: true,
        themes: { light: { dark: false, colors: { primary: '#000' } } },
      },
    }
    const source = generateMainTs(['useTheme'], config)

    expect(source).toMatch(/foreground: true,\n {2}themes:/)
  })

  it('should not mutate the caller config across repeated generation', () => {
    const config = { useDate: { adapter: 'custom' } }

    collectDependencies(['useDate'], config)
    const source = generateMainTs(['useDate'], config)

    expect(config.useDate.adapter).toBe('custom')
    expect(source).toContain('new CustomDateAdapter()')
  })
})

describe('collectDependencies', () => {
  it('should add the Temporal polyfill for the date adapter', () => {
    expect(collectDependencies(['useDate'], {})).toHaveProperty('@js-temporal/polyfill')
  })

  it('should add the provider SDK for third-party feature adapters', () => {
    const cases: Array<[string, string]> = [
      ['PostHogFeaturesAdapter', 'posthog-js'],
      ['LaunchDarklyFeaturesAdapter', 'launchdarkly-js-client-sdk'],
      ['FlagsmithFeaturesAdapter', '@flagsmith/flagsmith'],
    ]

    for (const [adapter, pkg] of cases) {
      expect(collectDependencies(['useFeatures'], { useFeatures: { adapter } })).toHaveProperty(pkg)
    }
  })

  it('should add nothing for plugins without adapters', () => {
    expect(collectDependencies(['useBreakpoints', 'useStorage'], {})).toEqual({})
  })
})

describe('generateDateStub', () => {
  it('should extend the concrete adapter so the stub compiles', () => {
    const source = generateDateStub()

    expect(source).toContain(`import { V0DateAdapter } from '@vuetify/v0/date'`)
    expect(source).toContain('export class CustomDateAdapter extends V0DateAdapter')
  })

  it('should only be needed for the custom adapter', () => {
    expect(needsDateStub(['useDate'], { useDate: { adapter: 'custom' } })).toBe(true)
    expect(needsDateStub(['useDate'], {})).toBe(false)
    expect(needsDateStub([], { useDate: { adapter: 'custom' } })).toBe(false)
  })
})

describe('toHashData', () => {
  it('should set active to src/App.vue', () => {
    const data = toHashData({ intent: 'spa', features: ['createSingle'], resolved: [], adapters: {} })

    expect(data.active).toBe('src/App.vue')
  })
})

describe('generateImports', () => {
  it('should include the v0 CDN import', () => {
    expect(generateImports()['@vuetify/v0']).toContain('cdn.jsdelivr.net')
  })
})
