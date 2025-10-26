import { describe, it, expect } from 'vitest'
import { createFeatures, createFeaturesPlugin, useFeatures } from './index'
import { createApp } from 'vue'

describe('createFeatures', () => {
  describe('basic functionality', () => {
    it('should create a features context', () => {
      const [, , context] = createFeatures('test-features')

      expect(context).toBeDefined()
      expect(context.variation).toBeDefined()
      expect(context.register).toBeDefined()
    })

    it('should register boolean features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-a': true,
          'feature-b': false,
        },
      })

      expect(context.collection.size).toBe(2)
      expect(context.collection.has('feature-a')).toBe(true)
      expect(context.collection.has('feature-b')).toBe(true)
    })

    it('should register token features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'theme-variant': { $variation: 'blue' },
          'layout-mode': { $variation: 'compact' },
        },
      })

      expect(context.collection.size).toBe(2)
      expect(context.collection.has('theme-variant')).toBe(true)
      expect(context.collection.has('layout-mode')).toBe(true)
    })

    it('should register mixed feature types', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'dark-mode': true,
          'theme-color': { $variation: 'blue' },
          'beta-feature': false,
        },
      })

      expect(context.collection.size).toBe(3)
    })
  })

  describe('auto-selection', () => {
    it('should auto-select boolean features that are true', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'enabled-feature': true,
          'disabled-feature': false,
        },
      })

      expect(context.selectedIds.has('enabled-feature')).toBe(true)
      expect(context.selectedIds.has('disabled-feature')).toBe(false)
    })

    it('should auto-select token features with $value: true', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-a': { $value: true, $variation: 'blue' },
          'feature-b': { $value: false, $variation: 'red' },
        },
      })

      expect(context.selectedIds.has('feature-a')).toBe(true)
      expect(context.selectedIds.has('feature-b')).toBe(false)
    })

    it('should not auto-select token features without $value', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'theme-variant': { $variation: 'blue' },
        },
      })

      expect(context.selectedIds.has('theme-variant')).toBe(false)
    })
  })

  describe('variation retrieval', () => {
    it('should return variation value for token features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'theme-color': { $variation: 'blue' },
          'layout-mode': { $variation: 'compact' },
        },
      })

      expect(context.variation('theme-color')).toBe('blue')
      expect(context.variation('layout-mode')).toBe('compact')
    })

    it('should return the value itself for boolean features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'dark-mode': true,
          'beta-feature': false,
        },
      })

      expect(context.variation('dark-mode')).toBe(true)
      expect(context.variation('beta-feature')).toBe(false)
    })

    it('should return fallback for non-existent features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'existing': true,
        },
      })

      expect(context.variation('non-existent')).toBe(null)
      expect(context.variation('non-existent', 'default')).toBe('default')
      expect(context.variation('non-existent', 42)).toBe(42)
    })

    it('should return fallback when variation is not set', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-without-variation': { $value: true },
        },
      })

      expect(context.variation('feature-without-variation', 'default')).toBe('default')
    })

    it('should handle complex variation values', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'config': {
            $variation: {
              theme: 'blue',
              layout: 'compact',
              density: 'comfortable',
            },
          },
        },
      })

      const variation = context.variation('config')
      expect(variation).toEqual({
        theme: 'blue',
        layout: 'compact',
        density: 'comfortable',
      })
    })
  })

  describe('dynamic registration', () => {
    it('should allow registering features dynamically', () => {
      const [, , context] = createFeatures('test-features')

      expect(context.collection.size).toBe(0)

      context.register({
        id: 'dynamic-feature',
        value: true,
      })

      expect(context.collection.size).toBe(1)
      expect(context.collection.has('dynamic-feature')).toBe(true)
    })

    it('should auto-select dynamically registered true features', () => {
      const [, , context] = createFeatures('test-features')

      context.register({
        id: 'dynamic-feature',
        value: true,
      })

      expect(context.selectedIds.has('dynamic-feature')).toBe(true)
    })

    it('should not auto-select dynamically registered false features', () => {
      const [, , context] = createFeatures('test-features')

      context.register({
        id: 'dynamic-feature',
        value: false,
      })

      expect(context.selectedIds.has('dynamic-feature')).toBe(false)
    })
  })

  describe('feature selection and deselection', () => {
    it('should allow manually selecting features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-a': false,
          'feature-b': false,
        },
      })

      context.select('feature-a')

      expect(context.selectedIds.has('feature-a')).toBe(true)
      expect(context.selectedIds.has('feature-b')).toBe(false)
    })

    it('should allow manually deselecting features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-a': true,
          'feature-b': true,
        },
      })

      context.unselect('feature-a')

      expect(context.selectedIds.has('feature-a')).toBe(false)
      expect(context.selectedIds.has('feature-b')).toBe(true)
    })

    it('should support multi-select', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-a': false,
          'feature-b': false,
          'feature-c': false,
        },
      })

      context.select(['feature-a', 'feature-b'])

      expect(context.selectedIds.has('feature-a')).toBe(true)
      expect(context.selectedIds.has('feature-b')).toBe(true)
      expect(context.selectedIds.has('feature-c')).toBe(false)
    })
  })

  describe('feature queries', () => {
    it('should check if a feature is selected', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'enabled': true,
          'disabled': false,
        },
      })

      const enabledFeature = context.collection.get('enabled')
      const disabledFeature = context.collection.get('disabled')

      // isSelected is a computed ref, need to access .value
      expect(enabledFeature?.isSelected.value).toBe(true)
      expect(disabledFeature?.isSelected.value).toBe(false)
    })

    it('should get selected features', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'feature-a': true,
          'feature-b': false,
          'feature-c': true,
        },
      })

      expect(context.selectedIds.size).toBe(2)
      expect(context.selectedIds.has('feature-a')).toBe(true)
      expect(context.selectedIds.has('feature-c')).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle empty features object', () => {
      const [, , context] = createFeatures('test-features', {
        features: {},
      })

      expect(context.collection.size).toBe(0)
    })

    it('should handle features with no options', () => {
      const [, , context] = createFeatures('test-features')

      expect(context.collection.size).toBe(0)
      expect(context.variation).toBeDefined()
      expect(context.register).toBeDefined()
    })

    it('should handle feature values that are objects without $variation', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'config': {
            theme: 'dark',
            layout: 'compact',
          },
        },
      })

      // Without $variation, the whole object is the value
      const variation = context.variation('config', 'default')
      expect(variation).toBe('default') // Falls back because no $variation
    })

    it('should handle null and undefined variation values', () => {
      const [, , context] = createFeatures('test-features', {
        features: {
          'null-feature': { $variation: null },
          'undefined-feature': {},
        },
      })

      // Null is treated as nullish by the ?? operator, so it falls back to default
      expect(context.variation('null-feature', 'default')).toBe('default')
      expect(context.variation('undefined-feature', 'default')).toBe('default')
    })
  })
})

describe('createFeaturesPlugin', () => {
  it('should create a Vue plugin', () => {
    const plugin = createFeaturesPlugin({
      features: {
        'dark-mode': true,
      },
    })

    expect(plugin).toBeDefined()
    expect(plugin.install).toBeDefined()
  })

  it('should provide features context to app', () => {
    let featuresFromSetup: any

    const app = createApp({
      setup () {
        featuresFromSetup = useFeatures()
        return {}
      },
      template: '<div>Test</div>',
    })

    app.use(
      createFeaturesPlugin({
        features: {
          'dark-mode': true,
          'theme-color': { $variation: 'blue' },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    expect(featuresFromSetup).toBeDefined()
    expect(featuresFromSetup.collection.size).toBe(2)
    expect(featuresFromSetup.selectedIds.has('dark-mode')).toBe(true)

    app.unmount()
  })

  it('should allow accessing variations from plugin context', () => {
    let featuresFromSetup: any

    const app = createApp({
      setup () {
        featuresFromSetup = useFeatures()
        return {}
      },
      template: '<div>Test</div>',
    })

    app.use(
      createFeaturesPlugin({
        features: {
          'theme-color': { $variation: 'blue' },
          'layout-mode': { $variation: 'compact' },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    expect(featuresFromSetup.variation('theme-color')).toBe('blue')
    expect(featuresFromSetup.variation('layout-mode')).toBe('compact')

    app.unmount()
  })
})

describe('useFeatures', () => {
  it('should throw when used without provider', () => {
    const app = createApp({
      setup () {
        expect(() => {
          useFeatures()
        }).toThrow()
        return {}
      },
      template: '<div>Test</div>',
    })

    const container = document.createElement('div')
    app.mount(container)
    app.unmount()
  })

  it('should access features context when provided', () => {
    let featuresFromSetup: any

    const app = createApp({
      setup () {
        featuresFromSetup = useFeatures()
        return {}
      },
      template: '<div>Test</div>',
    })

    app.use(
      createFeaturesPlugin({
        features: {
          'dark-mode': true,
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    expect(featuresFromSetup).toBeDefined()
    expect(featuresFromSetup.selectedIds.has('dark-mode')).toBe(true)

    app.unmount()
  })
})
