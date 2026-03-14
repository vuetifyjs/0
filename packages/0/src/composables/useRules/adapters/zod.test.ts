import { describe, expect, it } from 'vitest'

// Types
import type { ZodSchema } from './zod'

import { toZodRule } from './zod'

function mockSchema (result: { success: true } | { success: false, error: { issues: { message: string }[] } }): ZodSchema {
  return {
    safeParseAsync: async () => result,
  }
}

describe('toZodRule', () => {
  it('should return true for valid input', async () => {
    const rule = toZodRule(mockSchema({ success: true }))
    expect(await rule('valid')).toBe(true)
  })

  it('should return error message for invalid input', async () => {
    const rule = toZodRule(mockSchema({
      success: false,
      error: { issues: [{ message: 'Must be an email' }] },
    }))
    expect(await rule('bad')).toBe('Must be an email')
  })

  it('should return first issue when multiple issues exist', async () => {
    const rule = toZodRule(mockSchema({
      success: false,
      error: { issues: [{ message: 'First error' }, { message: 'Second error' }] },
    }))
    expect(await rule('bad')).toBe('First error')
  })

  it('should return fallback message when no issues', async () => {
    const rule = toZodRule(mockSchema({
      success: false,
      error: { issues: [] },
    }))
    expect(await rule('bad')).toBe('Invalid value')
  })
})
