import { describe, expect, it } from 'vitest'

import { SINCE_LEGEND, sinceInFramework } from './maturity'

describe('sinceInFramework', () => {
  it('should name the first release', () => {
    expect(sinceInFramework('1.0.0')).toBe('This feature was first released in v1.0.0.')
  })

  it('should use a release alias when one exists', () => {
    expect(sinceInFramework('1.0.0-beta.0')).toBe('This feature was first released in beta.0.')
  })

  it('should return an empty string when the feature has no release', () => {
    expect(sinceInFramework(null)).toBe('')
    expect(sinceInFramework(undefined)).toBe('')
  })
})

describe('sINCE_LEGEND', () => {
  it('should define since as the first release', () => {
    expect(SINCE_LEGEND).toBe(
      'Since is the version a feature was first released in.',
    )
  })
})
