import { describe, expect, it } from 'vitest'

// Composables
import {
  decodePlaygroundHash,
  encodePlaygroundHash,
  playgroundRegistryUrl,
  toPlaygroundThemes,
  type PlaygroundHashData,
} from './usePlayground'

const LIGHT = {
  primary: '#111111',
  background: '#ffffff',
}

const DARK = {
  primary: '#eeeeee',
  background: '#111111',
}

const TAILWIND = {
  primary: '#0ea5e9',
  background: '#0f172a',
}

const TAILWIND_LIGHT = {
  primary: '#0284c7',
  background: '#ffffff',
}

const HIGH_CONTRAST = {
  primary: '#ffff00',
  background: '#000000',
}

describe('toPlaygroundThemes', () => {
  it('should pack a custom builder theme and its dark counterpart', () => {
    const result = toPlaygroundThemes('brand-light', {
      'brand-light': { dark: false, colors: LIGHT },
      'brand-dark': { dark: true, colors: DARK },
    })

    expect(result?.theme).toBe('brand-light')
    expect(result?.themes?.['brand-light']).toEqual({ dark: false, colors: LIGHT })
    expect(result?.themes?.['brand-dark']).toEqual({ dark: true, colors: DARK })
  })

  it('should pack a selected palette and any extra records the caller includes', () => {
    const result = toPlaygroundThemes('tailwind-light', {
      'tailwind-light': { dark: false, colors: TAILWIND_LIGHT },
      'tailwind': { dark: true, colors: TAILWIND },
    })

    expect(result?.theme).toBe('tailwind-light')
    expect(result?.themes?.['tailwind-light']).toEqual({ dark: false, colors: TAILWIND_LIGHT })
    expect(result?.themes?.tailwind).toEqual({ dark: true, colors: TAILWIND })
  })

  it('should pack a single custom theme', () => {
    const result = toPlaygroundThemes('high-contrast', {
      'high-contrast': { dark: true, colors: HIGH_CONTRAST },
    })

    expect(result?.theme).toBe('high-contrast')
    expect(result?.themes).toEqual({
      'high-contrast': { dark: true, colors: HIGH_CONTRAST },
    })
  })

  it('should drop unsafe ids and css values', () => {
    const result = toPlaygroundThemes('ok-theme', {
      'constructor': { dark: true, colors: { primary: '#111' } },
      'ok-theme': {
        dark: false,
        colors: {
          'primary': '#fff',
          'evil': 'url(https://x)',
          'comment': 'red /*',
          'bad;key': '#000',
        },
      },
    })

    expect(result?.theme).toBe('ok-theme')
    expect(Object.hasOwn(result?.themes ?? {}, 'constructor')).toBe(false)
    expect(result?.themes?.['ok-theme']?.colors).toEqual({ primary: '#fff' })
  })

  it('should reject a non-identifier selected id', () => {
    expect(toPlaygroundThemes('x\';alert(1)//', { light: { colors: LIGHT } })).toBeUndefined()
  })

  it('should still emit theme when colors are missing', () => {
    expect(toPlaygroundThemes('light', {})).toEqual({
      theme: 'light',
    })
  })
})

describe('playgroundRegistryUrl', () => {
  it('should append a theme query param when provided', () => {
    const url = playgroundRegistryUrl({ item: 'dialog', example: 'basic', theme: 'dark' })
    expect(url).toContain('example=dialog%2Fbasic')
    expect(url).toContain('theme=dark')
  })
})

describe('encodePlaygroundHash', () => {
  it('should round-trip top-level theme + themes', async () => {
    const packed = toPlaygroundThemes('tailwind', {
      'tailwind': { dark: true, colors: TAILWIND },
      'tailwind-light': { dark: false, colors: TAILWIND_LIGHT },
    })
    const hash = await encodePlaygroundHash({
      files: { 'src/App.vue': '<template>ok</template>' },
      ...packed,
    })
    const decoded = await decodePlaygroundHash(hash)
    expect(decoded?.theme).toBe('tailwind')
    expect(decoded?.themes?.tailwind?.colors.primary).toBe('#0ea5e9')
    expect(decoded?.themes?.['tailwind-light']?.dark).toBe(false)
  })

  it('should read a legacy settings.theme payload', async () => {
    const hash = await encodePlaygroundHash({
      files: { 'src/App.vue': '<template>ok</template>' },
      settings: {
        theme: 'brand',
        themes: { brand: { dark: false, colors: LIGHT } },
      },
    } as PlaygroundHashData)
    const decoded = await decodePlaygroundHash(hash)
    expect(decoded?.theme).toBe('brand')
    expect(decoded?.themes?.brand?.colors.primary).toBe('#111111')
  })
})
