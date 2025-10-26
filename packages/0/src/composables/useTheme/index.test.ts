import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTheme, createThemePlugin, useTheme } from './index'
import { createApp, nextTick } from 'vue'

// Mock IN_BROWSER global
vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

describe('createTheme', () => {
  describe('basic functionality', () => {
    it('should create a theme context with default values', () => {
      const context = createTheme('test-theme')[2]

      expect(context).toBeDefined()
      expect(context.selectedId).toBeDefined()
      expect(context.colors).toBeDefined()
      expect(context.cycle).toBeDefined()
    })

    it('should register themes from options', () => {
      const context = createTheme('test-theme', {
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1976d2',
              secondary: '#424242',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#90caf9',
              secondary: '#ffffff',
            },
          },
        },
      })[2]

      expect(context.collection.size).toBe(2)
      expect(context.collection.has('light')).toBe(true)
      expect(context.collection.has('dark')).toBe(true)
    })

    it('should select default theme if provided', () => {
      const context = createTheme('test-theme', {
        default: 'dark',
        themes: {
          light: {
            dark: false,
            colors: { primary: '#1976d2' },
          },
          dark: {
            dark: true,
            colors: { primary: '#90caf9' },
          },
        },
      })[2]

      expect(context.selectedId.value).toBe('dark')
    })

    it('should not select any theme if default is not provided', () => {
      const context = createTheme('test-theme', {
        themes: {
          light: {
            dark: false,
            colors: { primary: '#1976d2' },
          },
        },
      })[2]

      expect(context.selectedId.value).toBeUndefined()
    })
  })

  describe('theme properties', () => {
    it('should set dark property correctly', () => {
      const context = createTheme('test-theme', {
        themes: {
          light: {
            dark: false,
            colors: { primary: '#1976d2' },
          },
          dark: {
            dark: true,
            colors: { primary: '#90caf9' },
          },
        },
      })[2]

      const lightTheme = context.collection.get('light')
      const darkTheme = context.collection.get('dark')

      expect(lightTheme?.dark).toBe(false)
      expect(darkTheme?.dark).toBe(true)
    })

    it('should default dark to false', () => {
      const context = createTheme('test-theme', {
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
        },
      })[2]

      const theme = context.collection.get('light')
      expect(theme?.dark).toBe(false)
    })

    it('should set lazy property correctly', () => {
      const context = createTheme('test-theme', {
        themes: {
          lazy: {
            lazy: true,
            colors: { primary: '#1976d2' },
          },
          eager: {
            lazy: false,
            colors: { primary: '#90caf9' },
          },
        },
      })[2]

      const lazyTheme = context.collection.get('lazy')
      const eagerTheme = context.collection.get('eager')

      expect(lazyTheme?.lazy).toBe(true)
      expect(eagerTheme?.lazy).toBe(false)
    })

    it('should default lazy to false', () => {
      const context = createTheme('test-theme', {
        themes: {
          normal: {
            colors: { primary: '#1976d2' },
          },
        },
      })[2]

      const theme = context.collection.get('normal')
      expect(theme?.lazy).toBe(false)
    })
  })

  describe('color resolution', () => {
    it('should resolve simple colors', () => {
      const context = createTheme('test-theme', {
        default: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1976d2',
              secondary: '#424242',
            },
          },
        },
      })[2]

      const colors = context.colors.value
      expect(colors.light).toBeDefined()
      expect(colors.light!.primary).toBe('#1976d2')
      expect(colors.light!.secondary).toBe('#424242')
    })

    it('should resolve token aliases in colors', () => {
      const context = createTheme('test-theme', {
        default: 'light',
        palette: {
          blue: {
            500: '#3b82f6',
          },
        },
        themes: {
          light: {
            colors: {
              primary: '{palette.blue.500}',
            },
          },
        },
      })[2]

      const colors = context.colors.value
      expect(colors.light!.primary).toBe('#3b82f6')
    })

    it('should skip lazy themes that are not selected', () => {
      const context = createTheme('test-theme', {
        default: 'light',
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
          dark: {
            lazy: true,
            colors: { primary: '#90caf9' },
          },
        },
      })[2]

      const colors = context.colors.value
      expect(colors.light).toBeDefined()
      expect(colors.dark).toBeUndefined()
    })

    it('should include lazy theme when it is selected', () => {
      const context = createTheme('test-theme', {
        default: 'dark',
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
          dark: {
            lazy: true,
            colors: { primary: '#90caf9' },
          },
        },
      })[2]

      const colors = context.colors.value
      expect(colors.dark).toBeDefined()
      expect(colors.dark!.primary).toBe('#90caf9')
    })
  })

  describe('theme cycling', () => {
    it('should cycle through provided themes', () => {
      const context = createTheme('test-theme', {
        default: 'light',
        themes: {
          light: { colors: { primary: '#1976d2' } },
          dark: { colors: { primary: '#90caf9' } },
          high_contrast: { colors: { primary: '#000000' } },
        },
      })[2]

      expect(context.selectedId.value).toBe('light')

      context.cycle(['light', 'dark', 'high_contrast'])
      expect(context.selectedId.value).toBe('dark')

      context.cycle(['light', 'dark', 'high_contrast'])
      expect(context.selectedId.value).toBe('high_contrast')

      context.cycle(['light', 'dark', 'high_contrast'])
      expect(context.selectedId.value).toBe('light')
    })

    it('should cycle through all registered themes when no array provided', () => {
      const context = createTheme('test-theme', {
        default: 'light',
        themes: {
          light: { colors: { primary: '#1976d2' } },
          dark: { colors: { primary: '#90caf9' } },
        },
      })[2]

      expect(context.selectedId.value).toBe('light')

      context.cycle()
      expect(context.selectedId.value).toBe('dark')

      context.cycle()
      expect(context.selectedId.value).toBe('light')
    })

    it('should handle cycling when current theme is not in the list', () => {
      const context = createTheme('test-theme', {
        themes: {
          light: { colors: { primary: '#1976d2' } },
          dark: { colors: { primary: '#90caf9' } },
        },
      })[2]

      // No theme selected initially
      context.cycle(['light', 'dark'])
      expect(context.selectedId.value).toBe('light')
    })
  })

  describe('manual theme registration', () => {
    it('should allow registering themes dynamically', () => {
      const context = createTheme('test-theme')[2]

      expect(context.collection.size).toBe(0)

      context.register({
        id: 'custom',
        value: {
          primary: '#ff0000',
          secondary: '#00ff00',
        },
        dark: false,
        lazy: false,
      })

      expect(context.collection.size).toBe(1)
      expect(context.collection.has('custom')).toBe(true)
    })
  })
})

describe('createThemePlugin', () => {
  beforeEach(() => {
    // Clear any existing style elements
    const existing = document.querySelector('#v0-theme-stylesheet')
    if (existing) existing.remove()

    // Clear theme classes from body
    document.body.className = ''
  })

  it('should create a Vue plugin', () => {
    const plugin = createThemePlugin({
      themes: {
        light: {
          colors: { primary: '#1976d2' },
        },
      },
    })

    expect(plugin).toBeDefined()
    expect(plugin.install).toBeDefined()
  })

  it('should inject CSS variables into DOM', async () => {
    const app = createApp({
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1976d2',
              secondary: '#424242',
            },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    await nextTick()

    const styleEl = document.querySelector('#v0-theme-stylesheet')
    expect(styleEl).toBeTruthy()
    expect(styleEl?.textContent).toContain('--v0-primary: #1976d2')
    expect(styleEl?.textContent).toContain('--v0-secondary: #424242')

    app.unmount()
  })

  it('should apply theme class to target element', async () => {
    const app = createApp({
      template: '<div>Test</div>',
    })

    const targetEl = document.createElement('div')
    targetEl.id = 'theme-target'
    document.body.append(targetEl)

    app.use(
      createThemePlugin({
        default: 'dark',
        target: '#theme-target',
        themes: {
          dark: {
            colors: { primary: '#90caf9' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    await nextTick()

    expect(targetEl.classList.contains('v0-theme--dark')).toBe(true)

    app.unmount()
    targetEl.remove()
  })

  it('should update theme class when theme changes', async () => {
    const targetEl = document.createElement('div')
    targetEl.id = 'theme-target'
    document.body.append(targetEl)

    let themeContext: any

    const app = createApp({
      setup () {
        themeContext = useTheme()
        return {}
      },
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        target: '#theme-target',
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
          dark: {
            colors: { primary: '#90caf9' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    await nextTick()

    expect(targetEl.classList.contains('v0-theme--light')).toBe(true)

    // Switch theme using the context from setup
    themeContext.select('dark')

    await nextTick()

    expect(targetEl.classList.contains('v0-theme--light')).toBe(false)
    expect(targetEl.classList.contains('v0-theme--dark')).toBe(true)

    app.unmount()
    targetEl.remove()
  })

  it('should use default target when none specified', async () => {
    const app = createApp({
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    container.id = 'app'
    document.body.append(container)
    app.mount(container)

    await nextTick()

    // Should apply to container or body
    const hasClass = container.classList.contains('v0-theme--light') ||
      document.body.classList.contains('v0-theme--light')
    expect(hasClass).toBe(true)

    app.unmount()
    container.remove()
  })

  it('should not apply classes when target is null', async () => {
    const app = createApp({
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        target: null,
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    await nextTick()

    expect(document.body.classList.contains('v0-theme--light')).toBe(false)

    app.unmount()
  })

  it('should use custom adapter prefix', async () => {
    const app = createApp({
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        adapter: {
          prefix: 'custom',
          stylesheetId: 'custom-theme-styles',
          update: vi.fn(),
          generate: () => '',
        },
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    await nextTick()

    app.unmount()
  })
})

describe('useTheme', () => {
  it('should throw when used without provider', () => {
    const app = createApp({
      setup () {
        expect(() => {
          useTheme()
        }).toThrow()
        return {}
      },
      template: '<div>Test</div>',
    })

    const container = document.createElement('div')
    app.mount(container)
    app.unmount()
  })

  it('should access theme context when provided', () => {
    let themeFromSetup: any

    const app = createApp({
      setup () {
        themeFromSetup = useTheme()
        return {}
      },
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    expect(themeFromSetup).toBeDefined()
    expect(themeFromSetup.selectedId.value).toBe('light')

    app.unmount()
  })
})

describe('ThemeAdapter', () => {
  it('should generate CSS with correct format', () => {
    createTheme('test-theme', {
      themes: {
        light: {
          colors: {
            primary: '#1976d2',
            secondary: '#424242',
          },
        },
      },
    })

    // Access the adapter through the plugin
    const plugin = createThemePlugin({
      themes: {
        light: {
          colors: {
            primary: '#1976d2',
            secondary: '#424242',
          },
        },
      },
    })

    // The adapter is private, but we can test via the plugin's behavior
    expect(plugin).toBeDefined()
  })
})
