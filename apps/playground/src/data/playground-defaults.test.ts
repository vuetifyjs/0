import { describe, expect, it } from 'vitest'

// Data
import { createMainTs, detectPaperUsage, paperCdnImports, paperEsmUrl, v0CdnImports } from './playground-defaults'

describe('createMainTs', () => {
  it('should keep default light and dark themes', () => {
    const source = createMainTs()
    expect(source).toContain('default: \'light\'')
    expect(source).toContain('#3b82f6')
    expect(source).toContain('#c4b5fd')
    expect(source).not.toContain('@paper/emerald')
    expect(source).not.toContain('@paper/bulma')
  })

  it('should merge extra palettes and overwrite matching ids', () => {
    const source = createMainTs('tailwind', undefined, 'latest', false, {
      dark: { dark: true, colors: { primary: '#111111' } },
      tailwind: { dark: true, colors: { primary: '#0ea5e9' } },
    })
    expect(source).toContain('default: \'tailwind\'')
    expect(source).toContain('#111111')
    expect(source).toContain('#0ea5e9')
    expect(source).toContain('#3b82f6')
  })

  it('should drop unsafe ids and css values', () => {
    const source = createMainTs('ok-theme', undefined, 'latest', false, {
      'ok-theme': {
        dark: false,
        colors: {
          primary: '#fff',
          inject: 'url(javascript:alert(1))',
        },
      },
      'bad id': { dark: true, colors: { primary: '#000' } },
    })
    expect(source).toContain('default: \'ok-theme\'')
    expect(source).toContain('#fff')
    expect(source).not.toContain('javascript:alert')
    expect(source).not.toContain('bad id')
  })

  it('should set the plugin default to the selected extra theme', () => {
    const source = createMainTs('tailwind-light', undefined, 'latest', false, {
      'tailwind-light': { dark: false, colors: { primary: '#0284c7' } },
    })
    expect(source).toContain('default: \'tailwind-light\'')
    expect(source).toContain('"tailwind-light"')
    expect(source).toContain('#0284c7')
  })

  it('should fall back to light when the default id is unsafe', () => {
    const source = createMainTs('x\';alert(1)//')
    expect(source).toContain('default: \'light\'')
    expect(source).not.toContain('alert(1)')
  })

  it('should inject emerald CSS and the icon plugin when emerald is set', () => {
    const source = createMainTs('light', { emerald: true })
    expect(source).toContain('import { createEmeraldIconsPlugin } from \'@paper/emerald\'')
    expect(source).toContain('https://cdn.jsdelivr.net/npm/@paper/emerald@latest/dist/theme.css')
    expect(source).toContain('https://cdn.jsdelivr.net/npm/@paper/emerald@latest/dist/style.css')
    expect(source).toContain('app.use(createEmeraldIconsPlugin())')
    expect(source).toContain('link.dataset.presetCss = \'emerald\'')
  })

  it('should inject bulma.css when bulma is set', () => {
    const source = createMainTs('light', { bulma: true })
    expect(source).toContain('https://cdn.jsdelivr.net/npm/bulma@latest/css/bulma.min.css')
    expect(source).toContain('link.dataset.presetCss = \'bulma\'')
    expect(source).not.toContain('@paper/emerald')
  })

  it('should drop constructor keys, url() values, and css comments', () => {
    const source = createMainTs('ok-theme', undefined, 'latest', false, {
      'constructor': { dark: true, colors: { primary: '#111111' } },
      'ok-theme': {
        dark: false,
        colors: {
          primary: 'url(javascript:alert(1))',
          secondary: 'red /*',
          accent: '#00ff00',
        },
      },
    })
    expect(source).toContain('default: \'ok-theme\'')
    expect(source).not.toContain('constructor')
    expect(source).not.toContain('javascript:alert')
    expect(source).not.toContain('red /*')
    expect(source).toContain('#00ff00')
  })
})

describe('v0CdnImports', () => {
  it('should map the package root and the utilities subpath Paper DS builds import', () => {
    expect(v0CdnImports('1.2.0')).toEqual({
      '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@1.2.0/dist/index.mjs',
      '@vuetify/v0/utilities': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@1.2.0/dist/utilities/index.mjs',
    })
  })
})

describe('paperCdnImports', () => {
  it('should map both design systems to jsDelivr ESM entries', () => {
    expect(paperEsmUrl('bulma')).toBe('https://cdn.jsdelivr.net/npm/@paper/bulma@latest/dist/index.mjs')
    expect(paperCdnImports('0.1.0')).toEqual({
      '@paper/bulma': 'https://cdn.jsdelivr.net/npm/@paper/bulma@0.1.0/dist/index.mjs',
      '@paper/emerald': 'https://cdn.jsdelivr.net/npm/@paper/emerald@0.1.0/dist/index.mjs',
      '@paper/emerald/style.css': 'https://cdn.jsdelivr.net/npm/@paper/emerald@0.1.0/dist/style.css',
      '@paper/emerald/theme.css': 'https://cdn.jsdelivr.net/npm/@paper/emerald@0.1.0/dist/theme.css',
    })
  })
})

describe('detectPaperUsage', () => {
  it('should detect paper specifiers in user files', () => {
    expect(detectPaperUsage({
      'src/App.vue': 'import { BuModal } from \'@paper/bulma\'\n',
    })).toEqual({ emerald: false, bulma: true })
    expect(detectPaperUsage({
      'src/App.vue': 'import { EmButton } from \'@paper/emerald\'\n',
    })).toEqual({ emerald: true, bulma: false })
  })

  it('should ignore generated main.ts so injected plugin imports cannot latch', () => {
    expect(detectPaperUsage({
      'src/main.ts': 'import { createEmeraldIconsPlugin } from \'@paper/emerald\'\n',
      'src/App.vue': 'export default {}\n',
    })).toEqual({ emerald: false, bulma: false })
  })
})
