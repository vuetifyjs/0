import { beforeEach, describe, expect, it, vi } from 'vitest'

// Adapters
import { Vuetify0ThemeAdapter } from './adapters/v0'

// Utilities
import { createApp, nextTick } from 'vue'

// Types
import type { ThemeContext } from './index'

import { createTheme, createThemePlugin, useTheme } from './index'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: true,
}))

describe('createTheme', () => {
  describe('basic functionality', () => {
    it('should create a theme context with default values', () => {
      const context = createTheme({})

      expect(context).toBeDefined()
      expect(context.selectedId).toBeDefined()
      expect(context.colors).toBeDefined()
      expect(context.cycle).toBeDefined()
    })

    it('should register themes from options', () => {
      const context = createTheme({
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
      })

      expect(context.collection.size).toBe(2)
      expect(context.collection.has('light')).toBe(true)
      expect(context.collection.has('dark')).toBe(true)
    })

    it('should select default theme if provided', () => {
      const context = createTheme({
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
      })

      expect(context.selectedId.value).toBe('dark')
    })

    it('should not select any theme if default is not provided', () => {
      const context = createTheme({
        themes: {
          light: {
            dark: false,
            colors: { primary: '#1976d2' },
          },
        },
      })

      expect(context.selectedId.value).toBeUndefined()
    })
  })

  describe('theme properties', () => {
    it('should set dark property correctly', () => {
      const context = createTheme({
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
      })

      const lightTheme = context.collection.get('light')
      const darkTheme = context.collection.get('dark')

      expect(lightTheme?.dark).toBe(false)
      expect(darkTheme?.dark).toBe(true)
    })

    it('should default dark to false', () => {
      const context = createTheme({
        themes: {
          light: {
            colors: { primary: '#1976d2' },
          },
        },
      })

      const theme = context.collection.get('light')
      expect(theme?.dark).toBe(false)
    })

    it('should set lazy property correctly', () => {
      const context = createTheme({
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
      })

      const lazyTheme = context.collection.get('lazy')
      const eagerTheme = context.collection.get('eager')

      expect(lazyTheme?.lazy).toBe(true)
      expect(eagerTheme?.lazy).toBe(false)
    })

    it('should default lazy to false', () => {
      const context = createTheme({
        themes: {
          normal: {
            colors: { primary: '#1976d2' },
          },
        },
      })

      const theme = context.collection.get('normal')
      expect(theme?.lazy).toBe(false)
    })
  })

  describe('color resolution', () => {
    it('should resolve simple colors', () => {
      const context = createTheme({
        default: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1976d2',
              secondary: '#424242',
            },
          },
        },
      })

      const colors = context.colors.value
      expect(colors.light).toBeDefined()
      expect(colors.light!.primary).toBe('#1976d2')
      expect(colors.light!.secondary).toBe('#424242')
    })

    it('should resolve token aliases in colors', () => {
      const context = createTheme({
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
      })

      const colors = context.colors.value
      expect(colors.light!.primary).toBe('#3b82f6')
    })

    it('should skip lazy themes that are not selected', () => {
      const context = createTheme({
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
      })

      const colors = context.colors.value
      expect(colors.light).toBeDefined()
      expect(colors.dark).toBeUndefined()
    })

    it('should include lazy theme when it is selected', () => {
      const context = createTheme({
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
      })

      const colors = context.colors.value
      expect(colors.dark).toBeDefined()
      expect(colors.dark!.primary).toBe('#90caf9')
    })
  })

  describe('theme cycling', () => {
    it('should cycle through provided themes', () => {
      const context = createTheme({
        default: 'light',
        themes: {
          light: { colors: { primary: '#1976d2' } },
          dark: { colors: { primary: '#90caf9' } },
          high_contrast: { colors: { primary: '#000000' } },
        },
      })

      expect(context.selectedId.value).toBe('light')

      context.cycle(['light', 'dark', 'high_contrast'])
      expect(context.selectedId.value).toBe('dark')

      context.cycle(['light', 'dark', 'high_contrast'])
      expect(context.selectedId.value).toBe('high_contrast')

      context.cycle(['light', 'dark', 'high_contrast'])
      expect(context.selectedId.value).toBe('light')
    })

    it('should cycle through all registered themes when no array provided', () => {
      const context = createTheme({
        default: 'light',
        themes: {
          light: { colors: { primary: '#1976d2' } },
          dark: { colors: { primary: '#90caf9' } },
        },
      })

      expect(context.selectedId.value).toBe('light')

      context.cycle()
      expect(context.selectedId.value).toBe('dark')

      context.cycle()
      expect(context.selectedId.value).toBe('light')
    })

    it('should handle cycling when current theme is not in the list', () => {
      const context = createTheme({
        themes: {
          light: { colors: { primary: '#1976d2' } },
          dark: { colors: { primary: '#90caf9' } },
        },
      })

      context.cycle(['light', 'dark'])
      expect(context.selectedId.value).toBe('light')
    })
  })

  describe('manual theme registration', () => {
    it('should allow registering themes dynamically', () => {
      const context = createTheme({})

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

  describe('isDark reactivity', () => {
    it('should update isDark when switching from light to dark theme', () => {
      const context = createTheme({
        default: 'light',
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
      })

      expect(context.isDark.value).toBe(false)

      context.select('dark')

      expect(context.isDark.value).toBe(true)
    })

    it('should update isDark when switching from dark to light theme', () => {
      const context = createTheme({
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
      })

      expect(context.isDark.value).toBe(true)

      context.select('light')

      expect(context.isDark.value).toBe(false)
    })
  })
})

describe('createThemePlugin', () => {
  beforeEach(() => {
    const existing = document.querySelector('#v0-theme-stylesheet')
    if (existing) existing.remove()

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
    let mockStyleSheets: CSSStyleSheet[] = []
    const spy = vi.spyOn(document, 'adoptedStyleSheets', 'get').mockImplementation(() => mockStyleSheets)
    vi.spyOn(document, 'adoptedStyleSheets', 'set').mockImplementation(v => {
      mockStyleSheets = v as CSSStyleSheet[]
    })

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

    expect(mockStyleSheets.length).toBeGreaterThan(0)
    const styleContent = mockStyleSheets[0]!.cssRules?.[0]?.cssText || ''
    expect(styleContent).toContain('--v0-primary: #1976d2')
    expect(styleContent).toContain('--v0-secondary: #424242')

    app.unmount()
    spy.mockRestore()
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

    expect(targetEl.dataset.theme).toBe('dark')

    app.unmount()
    targetEl.remove()
  })

  it('should update theme class when theme changes', async () => {
    const targetEl = document.createElement('div')
    targetEl.id = 'theme-target'
    document.body.append(targetEl)

    let themeContext: ThemeContext | undefined

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

    expect(targetEl.dataset.theme).toBe('light')

    themeContext!.select('dark')

    await nextTick()

    expect(targetEl.dataset.theme).toBe('dark')

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

    const hasDataTheme = container.dataset.theme === 'light' ||
      document.body.dataset.theme === 'light'
    expect(hasDataTheme).toBe(true)

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
    const setupFn = vi.fn()
    const updateFn = vi.fn()

    const app = createApp({
      template: '<div>Test</div>',
    })

    app.use(
      createThemePlugin({
        default: 'light',
        adapter: {
          prefix: 'custom',
          stylesheetId: 'custom-theme-styles',
          setup: setupFn,
          update: updateFn,
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

    expect(setupFn).toHaveBeenCalled()

    app.unmount()
  })

  describe('nested theme context', () => {
    it('should allow child component to override parent theme', () => {
      let parentTheme: ThemeContext | undefined
      let childTheme: ThemeContext | undefined

      const ChildComponent = {
        setup () {
          childTheme = useTheme()
          return {}
        },
        template: '<div>Child</div>',
      }

      const app = createApp({
        components: { ChildComponent },
        setup () {
          parentTheme = useTheme()
          return {}
        },
        template: '<div><ChildComponent /></div>',
      })

      app.use(
        createThemePlugin({
          default: 'light',
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
        }),
      )

      const container = document.createElement('div')
      app.mount(container)

      expect(parentTheme).toBeDefined()
      expect(childTheme).toBeDefined()
      expect(parentTheme!.selectedId.value).toBe('light')
      expect(childTheme!.selectedId.value).toBe('light')

      app.unmount()
    })
  })
})

describe('useTheme', () => {
  it('should return fallback when no context is provided', () => {
    let theme: ReturnType<typeof useTheme> | undefined

    const app = createApp({
      setup () {
        theme = useTheme()
        return {}
      },
      template: '<div>Test</div>',
    })

    const container = document.createElement('div')
    app.mount(container)

    expect(theme).toBeDefined()
    expect(theme!.isDark.value).toBe(false)
    expect(theme!.size).toBe(0)

    app.unmount()
  })

  it('should access theme context when provided', () => {
    let themeFromSetup: ThemeContext | undefined

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
    expect(themeFromSetup!.selectedId.value).toBe('light')

    app.unmount()
  })

  it('should update isDark when switching themes', () => {
    let themeFromSetup: ThemeContext | undefined

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
            dark: false,
            colors: { primary: '#1976d2' },
          },
          dark: {
            dark: true,
            colors: { primary: '#90caf9' },
          },
        },
      }),
    )

    const container = document.createElement('div')
    app.mount(container)

    expect(themeFromSetup!.isDark.value).toBe(false)

    themeFromSetup!.select('dark')

    expect(themeFromSetup!.isDark.value).toBe(true)

    app.unmount()
  })
})

describe('themeAdapter', () => {
  it('should generate CSS with data-theme selectors and variables', () => {
    const adapter = new Vuetify0ThemeAdapter()

    const css = adapter.generate(
      {
        light: {
          primary: '#1976d2',
          secondary: '#424242',
        },
      },
      false,
    )

    expect(css).toContain('[data-theme="light"]')
    expect(css).toContain('--v0-primary: #1976d2')
    expect(css).toContain('--v0-secondary: #424242')
    expect(css).toContain('color-scheme: light')
  })

  it('should generate dark color-scheme when isDark is true', () => {
    const adapter = new Vuetify0ThemeAdapter()

    const css = adapter.generate(
      { dark: { primary: '#90caf9' } },
      true,
    )

    expect(css).toContain('color-scheme: dark')
  })
})
