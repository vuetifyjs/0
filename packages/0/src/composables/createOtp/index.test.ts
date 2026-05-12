import { describe, expect, it, vi } from 'vitest'

import { createOtp } from './index'

// Utilities
import { shallowRef } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return { ...actual, provide: vi.fn(), inject: vi.fn() }
})

function setup (options: Parameters<typeof createOtp>[0] = {}) {
  return createOtp(options)
}

describe('createOtp', () => {
  describe('shape', () => {
    it('should expose the documented context surface', () => {
      const otp = setup()
      expect(otp.value).toBeDefined()
      expect(otp.length.value).toBe(6)
      expect(otp.input).toBeDefined()
      expect(otp.isComplete.value).toBe(false)
      expect(typeof otp.setAt).toBe('function')
      expect(typeof otp.paste).toBe('function')
      expect(typeof otp.clear).toBe('function')
      expect(typeof otp.fill).toBe('function')
      expect(typeof otp.accepts).toBe('function')
    })

    it('should accept an external value ref', () => {
      const value = shallowRef('123')
      const otp = setup({ value })
      expect(otp.value.value).toBe('123')
    })
  })
})
