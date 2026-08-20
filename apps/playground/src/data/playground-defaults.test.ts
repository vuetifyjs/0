import { describe, expect, it } from 'vitest'

// Data
import { createMainTs } from './playground-defaults'

describe('createMainTs', () => {
  it('should keep default light and dark themes', () => {
    const source = createMainTs()
    expect(source).toContain('default: \'light\'')
    expect(source).toContain('#3b82f6')
    expect(source).toContain('#c4b5fd')
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
