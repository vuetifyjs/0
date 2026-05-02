import { describe, expect, it } from 'vitest'

import { generateFiles, generateImports, toHashData } from './manifest'

describe('generateFiles', () => {
  it('generates SelectionDemo when selection features are selected', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createSingle'],
      resolved: ['createContext', 'createModel', 'createTrinity'],
      adapters: {},
    })

    expect(files['src/SelectionDemo.vue']).toContain('createSingle')
    expect(files['src/App.vue']).toContain('SelectionDemo')
  })

  it('generates FormDemo when form features are selected', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createForm'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(files['src/FormDemo.vue']).toContain('createForm')
    expect(files['src/App.vue']).toContain('FormDemo')
  })

  it('generates DataDemo when data features are selected', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createDataTable'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(files['src/DataDemo.vue']).toContain('createDataTable')
    expect(files['src/App.vue']).toContain('DataDemo')
  })

  it('generates multiple demos for mixed feature sets', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createSingle', 'createForm', 'useResizeObserver'],
      resolved: ['createContext', 'createModel', 'createTrinity'],
      adapters: {},
    })

    expect(files['src/SelectionDemo.vue']).toBeDefined()
    expect(files['src/FormDemo.vue']).toBeDefined()
    expect(files['src/ObserverDemo.vue']).toBeDefined()
    expect(files['src/App.vue']).toContain('SelectionDemo')
    expect(files['src/App.vue']).toContain('FormDemo')
    expect(files['src/App.vue']).toContain('ObserverDemo')
  })

  it('does not generate main.ts or uno.config.ts', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createSingle', 'useTheme'],
      resolved: ['createContext', 'createModel', 'createTrinity'],
      adapters: {},
    })

    expect(files['src/main.ts']).toBeUndefined()
    expect(files['src/uno.config.ts']).toBeUndefined()
  })

  it('generates fallback App.vue when only plugins are selected', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['useTheme', 'useLocale'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(Object.keys(files)).toEqual(['src/App.vue'])
    expect(files['src/App.vue']).toContain('plugins are ready')
  })

  it('shows correct feature count in App.vue', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createSingle', 'useTheme'],
      resolved: ['createContext', 'createModel'],
      adapters: {},
    })

    expect(files['src/App.vue']).toContain('4 features loaded')
  })
})

describe('toHashData', () => {
  it('sets active to src/App.vue', () => {
    const data = toHashData({
      intent: 'spa',
      features: ['createSingle'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(data.active).toBe('src/App.vue')
  })

  it('sets preset to default', () => {
    const data = toHashData({
      intent: 'spa',
      features: ['createSingle'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(data.settings?.preset).toBe('default')
  })

  it('adds pinia addon when useStorage is selected', () => {
    const data = toHashData({
      intent: 'spa',
      features: ['useStorage'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(data.settings?.addons).toContain('pinia')
  })

  it('adds router addon when createStep is selected', () => {
    const data = toHashData({
      intent: 'spa',
      features: ['createStep'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(data.settings?.addons).toContain('router')
  })

  it('omits addons when none are needed', () => {
    const data = toHashData({
      intent: 'spa',
      features: ['createSingle'],
      resolved: ['createContext'],
      adapters: {},
    })

    expect(data.settings?.addons).toBeUndefined()
  })
})

describe('generateImports', () => {
  it('includes v0 CDN import', () => {
    const imports = generateImports()
    expect(imports['@vuetify/v0']).toContain('cdn.jsdelivr.net')
  })
})
