import { describe, expect, it } from 'vitest'

// Composables
import { paperImportsFromCode, playgroundRegistryUrl } from './usePlayground'

describe('playgroundRegistryUrl', () => {
  it('should append a theme query param when provided', () => {
    const url = playgroundRegistryUrl({ item: 'dialog', example: 'basic', theme: 'dark' })
    expect(url).toContain('example=dialog%2Fbasic')
    expect(url).toContain('theme=dark')
  })
})

describe('paperImportsFromCode', () => {
  it('should map paper specifiers to jsDelivr ESM entries', () => {
    expect(paperImportsFromCode([
      { code: 'import { BuModal } from \'@paper/bulma\'\n' },
      { code: 'import { EmButton } from \'@paper/emerald\'\n' },
    ])).toEqual({
      '@paper/bulma': 'https://cdn.jsdelivr.net/npm/@paper/bulma@latest/dist/index.mjs',
      '@paper/emerald': 'https://cdn.jsdelivr.net/npm/@paper/emerald@latest/dist/index.mjs',
      '@paper/emerald/style.css': 'https://cdn.jsdelivr.net/npm/@paper/emerald@latest/dist/style.css',
      '@paper/emerald/theme.css': 'https://cdn.jsdelivr.net/npm/@paper/emerald@latest/dist/theme.css',
    })
  })

  it('should return an empty map when no paper specifiers are present', () => {
    expect(paperImportsFromCode([
      { code: 'import { createSingle } from \'@vuetify/v0\'\n' },
    ])).toEqual({})
  })
})
