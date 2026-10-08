import { describe, expect, it } from 'vitest'

import { conform } from './conform'

describe('conform', () => {
  it('should export the conformance diff', () => {
    expect(typeof conform).toBe('function')
  })
})
