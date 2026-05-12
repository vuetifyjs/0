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

  describe('accepts', () => {
    it('should accept digits with the default numeric pattern', () => {
      const otp = setup()
      expect(otp.accepts('0')).toBe(true)
      expect(otp.accepts('9')).toBe(true)
    })

    it('should reject non-digits with the numeric pattern', () => {
      const otp = setup()
      expect(otp.accepts('a')).toBe(false)
      expect(otp.accepts(' ')).toBe(false)
      expect(otp.accepts('')).toBe(false)
    })

    it('should accept letters and digits with the alphanumeric pattern', () => {
      const otp = setup({ pattern: 'alphanumeric' })
      expect(otp.accepts('A')).toBe(true)
      expect(otp.accepts('z')).toBe(true)
      expect(otp.accepts('4')).toBe(true)
      expect(otp.accepts('-')).toBe(false)
    })

    it('should accept letters only with the alphabetic pattern', () => {
      const otp = setup({ pattern: 'alphabetic' })
      expect(otp.accepts('A')).toBe(true)
      expect(otp.accepts('9')).toBe(false)
    })

    it('should apply a custom single-character RegExp', () => {
      const otp = setup({ pattern: /^[0-9a-fA-F]$/ })
      expect(otp.accepts('f')).toBe(true)
      expect(otp.accepts('G')).toBe(false)
    })

    it('should react to pattern changes through MaybeRefOrGetter', () => {
      const mode = shallowRef<'numeric' | 'alphabetic'>('numeric')
      const otp = setup({ pattern: () => mode.value })
      expect(otp.accepts('1')).toBe(true)
      mode.value = 'alphabetic'
      expect(otp.accepts('1')).toBe(false)
      expect(otp.accepts('a')).toBe(true)
    })

    it('should warn through useLogger when a RegExp matches multi-character input', () => {
      const otp = setup({ pattern: /^[0-9]+$/ })
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      otp.accepts('1')
      otp.accepts('2')
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })
  })
})
