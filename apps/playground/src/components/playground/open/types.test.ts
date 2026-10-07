import { describe, expect, it } from 'vitest'

// Local
import { DEFAULT_OPEN_RAIL, normalizeOpenRail } from './types'

describe('normalizeOpenRail', () => {
  it('should default to Vuetify One', () => {
    expect(DEFAULT_OPEN_RAIL).toBe('saved')
    expect(normalizeOpenRail(undefined)).toBe('saved')
    expect(normalizeOpenRail('nope')).toBe('saved')
  })

  it('should keep known rails', () => {
    expect(normalizeOpenRail('v0')).toBe('v0')
    expect(normalizeOpenRail('vuetify')).toBe('vuetify')
    expect(normalizeOpenRail('saved')).toBe('saved')
  })

  it('should map legacy kind rails to v0', () => {
    expect(normalizeOpenRail('components')).toBe('v0')
    expect(normalizeOpenRail('composables')).toBe('v0')
    expect(normalizeOpenRail('plugins')).toBe('v0')
  })
})
