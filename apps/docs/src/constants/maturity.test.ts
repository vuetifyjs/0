import { describe, expect, it } from 'vitest'

import { SINCE_LEGEND, sinceInFramework } from './maturity'

describe('sinceInFramework', () => {
  it('should name the first ship version, not the current level', () => {
    expect(sinceInFramework('1.0.0', 'Stable')).toBe(
      'First shipped in v1.0.0. Not when it became stable.',
    )
  })

  it('should use a release alias when one exists', () => {
    expect(sinceInFramework('1.0.0-beta.0', 'Preview')).toBe(
      'First shipped in beta.0. Not when it became preview.',
    )
  })

  it('should omit the level clause when no level is given', () => {
    expect(sinceInFramework('1.2.0')).toBe('First shipped in v1.2.0.')
  })

  it('should return an empty string when the feature has no release', () => {
    expect(sinceInFramework(null, 'Draft')).toBe('')
    expect(sinceInFramework(undefined, 'Draft')).toBe('')
  })
})

describe('sINCE_LEGEND', () => {
  it('should define since as the first ship version', () => {
    expect(SINCE_LEGEND).toBe(
      'Since is the version a feature first shipped in. It does not update when the feature moves to a new level.',
    )
  })
})
