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
      expect(typeof otp.put).toBe('function')
      expect(typeof otp.distribute).toBe('function')
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
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('multi-character'))
      spy.mockRestore()
    })

    it('should reject multi-character input', () => {
      const otp = setup()
      expect(otp.accepts('12')).toBe(false)
      expect(otp.accepts('ab')).toBe(false)
    })
  })

  describe('put', () => {
    it('should write a single character at the index', () => {
      const otp = setup()
      otp.put(0, '4')
      expect(otp.value.value).toBe('4')
    })

    it('should write at the configured length boundary', () => {
      const otp = setup({ length: 4 })
      otp.fill('12')
      otp.put(2, '3')
      otp.put(3, '4')
      expect(otp.value.value).toBe('1234')
    })

    it('should silently drop out-of-range indices', () => {
      const otp = setup({ length: 4 })
      otp.put(-1, '1')
      otp.put(4, '1')
      expect(otp.value.value).toBe('')
    })

    it('should truncate to-the-end when char is empty', () => {
      const otp = setup()
      otp.fill('12345')
      otp.put(2, '')
      expect(otp.value.value).toBe('12')
    })

    it('should use the first character when multi-char is passed', () => {
      const otp = setup({ pattern: 'alphanumeric' })
      otp.put(0, 'ab')
      expect(otp.value.value).toBe('a')
    })

    it('should drop characters that fail the pattern', () => {
      const otp = setup() // numeric default
      otp.put(0, 'a')
      expect(otp.value.value).toBe('')
    })
  })

  describe('distribute', () => {
    it('should distribute filtered characters and return the count consumed', () => {
      const otp = setup({ length: 6 })
      const count = otp.distribute('123456')
      expect(count).toBe(6)
      expect(otp.value.value).toBe('123456')
    })

    it('should filter rejected characters before distribution', () => {
      const otp = setup({ length: 6 })
      const count = otp.distribute('12-34-56')
      expect(count).toBe(6)
      expect(otp.value.value).toBe('123456')
    })

    it('should splice into the existing value at the given index', () => {
      const otp = setup({ length: 6 })
      otp.fill('12')
      const count = otp.distribute('34', 2)
      expect(count).toBe(2)
      expect(otp.value.value).toBe('1234')
    })

    it('should clip to length when distribute would overflow', () => {
      const otp = setup({ length: 4 })
      const count = otp.distribute('123456')
      expect(count).toBe(4)
      expect(otp.value.value).toBe('1234')
    })

    it('should return 0 when every character is rejected', () => {
      const otp = setup({ length: 4 })
      const count = otp.distribute('abc')
      expect(count).toBe(0)
      expect(otp.value.value).toBe('')
    })

    it('should clamp a negative index to 0', () => {
      const otp = setup({ length: 4 })
      const count = otp.distribute('12', -5)
      expect(count).toBe(2)
      expect(otp.value.value).toBe('12')
    })

    it('should return 0 when distributing at index equal to length', () => {
      const otp = setup({ length: 4 })
      otp.fill('1234')
      const count = otp.distribute('5', 4)
      expect(count).toBe(0)
      expect(otp.value.value).toBe('1234')
    })
  })

  describe('clear', () => {
    it('should empty the joined value', () => {
      const otp = setup()
      otp.fill('1234')
      otp.clear()
      expect(otp.value.value).toBe('')
    })
  })

  describe('fill', () => {
    it('should replace the joined value with filtered, length-clipped input', () => {
      const otp = setup({ length: 4 })
      otp.fill('1-2-3-4-5')
      expect(otp.value.value).toBe('1234')
    })
  })

  describe('isComplete', () => {
    it('should be false until the value reaches length', () => {
      const otp = setup({ length: 4 })
      expect(otp.isComplete.value).toBe(false)
      otp.fill('123')
      expect(otp.isComplete.value).toBe(false)
      otp.put(3, '4')
      expect(otp.isComplete.value).toBe(true)
    })

    it('should drop back to false when the value shrinks', () => {
      const otp = setup({ length: 4 })
      otp.fill('1234')
      expect(otp.isComplete.value).toBe(true)
      otp.put(3, '')
      expect(otp.isComplete.value).toBe(false)
    })

    it('should update when reactive length changes', () => {
      const length = shallowRef(6)
      const otp = setup({ length })
      otp.fill('123456')
      expect(otp.isComplete.value).toBe(true)
      length.value = 8
      expect(otp.isComplete.value).toBe(false)
      otp.fill('12345678')
      expect(otp.isComplete.value).toBe(true)
    })
  })

  describe('disabled / readonly gating', () => {
    it('should no-op mutations when disabled is true', () => {
      const disabled = shallowRef(true)
      const otp = setup({ disabled })
      otp.put(0, '1')
      otp.distribute('123')
      otp.fill('999')
      expect(otp.value.value).toBe('')
      disabled.value = false
      otp.put(0, '1')
      expect(otp.value.value).toBe('1')
    })

    it('should no-op mutations when readonly is true', () => {
      const otp = setup({ readonly: true })
      otp.put(0, '1')
      otp.distribute('123')
      otp.fill('999')
      otp.clear()
      expect(otp.value.value).toBe('')
    })
  })

  describe('onComplete (sync)', () => {
    it('should fire once on the false → true edge', async () => {
      const onComplete = vi.fn()
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await Promise.resolve()
      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith('1234')
    })

    it('should fire again on a subsequent false → true cycle', async () => {
      const onComplete = vi.fn()
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await Promise.resolve()
      otp.clear()
      otp.fill('5678')
      await Promise.resolve()
      expect(onComplete).toHaveBeenCalledTimes(2)
    })

    it('should clear value and set error when sync onComplete returns false', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await Promise.resolve()
      expect(otp.value.value).toBe('')
      expect(otp.input.isValid.value).toBe(false)
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
    })

    it('should clear error state on the next mutation', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await Promise.resolve()
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
      otp.put(0, '9')
      expect(otp.input.errors.value).not.toContain('v0.otp.rejected')
    })

    it('should fire onComplete again when the same value is re-entered after rejection', async () => {
      let allow = false
      const onComplete = vi.fn(() => allow)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await Promise.resolve()
      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(otp.value.value).toBe('')
      allow = true
      otp.fill('1234')
      await Promise.resolve()
      expect(onComplete).toHaveBeenCalledTimes(2)
      expect(otp.value.value).toBe('1234')
    })

    it('should clear value and warn when onComplete throws', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({ length: 4, onComplete: () => {
        throw new Error('boom')
      } })
      otp.fill('1234')
      await Promise.resolve()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('onComplete threw'))
      spy.mockRestore()
    })

    it('should leave the value intact when sync onComplete returns undefined', async () => {
      const otp = setup({ length: 4, onComplete: () => {} })
      otp.fill('1234')
      await Promise.resolve()
      expect(otp.value.value).toBe('1234')
      expect(otp.input.errors.value).toEqual([])
    })

    it('should fire onComplete again after clear and re-entry of the same accepted value', async () => {
      const onComplete = vi.fn(() => true)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await Promise.resolve()
      expect(onComplete).toHaveBeenCalledTimes(1)
      otp.clear()
      otp.fill('1234')
      await Promise.resolve()
      expect(onComplete).toHaveBeenCalledTimes(2)
    })

    it('should handle onComplete throwing a non-Error value without crashing', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({ length: 4, onComplete: () => {
        throw null
      } })
      otp.fill('1234')
      await Promise.resolve()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })
  })

  describe('onComplete (async)', () => {
    it('should no-op mutations and clear value on async rejection', async () => {
      let resolve!: (ok: boolean) => void
      const otp = setup({
        length: 4,
        onComplete: () => new Promise<boolean>(r => {
          resolve = r
        }),
      })
      otp.fill('1234')
      await Promise.resolve()
      otp.put(0, '9')
      expect(otp.value.value).toBe('1234')
      resolve(false)
      await Promise.resolve()
      await Promise.resolve()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
    })

    it('should leave the value intact on async accept', async () => {
      const otp = setup({
        length: 4,
        onComplete: () => Promise.resolve(true),
      })
      otp.fill('1234')
      await Promise.resolve()
      await Promise.resolve()
      expect(otp.value.value).toBe('1234')
      expect(otp.input.errors.value).toEqual([])
    })

    it('should clear value and warn when onComplete returns a rejected promise', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({
        length: 4,
        onComplete: () => Promise.reject(new Error('network error')),
      })
      otp.fill('1234')
      await Promise.resolve()
      await Promise.resolve()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('onComplete rejected'))
      spy.mockRestore()
    })

    it('should handle a rejected promise with a non-Error value without crashing', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({
        length: 4,
        onComplete: () => Promise.reject(null),
      })
      otp.fill('1234')
      await Promise.resolve()
      await Promise.resolve()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('v0.otp.rejected')
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })

    it('should accept a thenable that is not a native Promise', async () => {
      const onComplete = vi.fn(() => ({
        // eslint-disable-next-line unicorn/no-thenable
        then (onfulfilled?: ((v: boolean) => unknown) | null) {
          onfulfilled?.(true)
        },
      }) as PromiseLike<boolean>)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await Promise.resolve()
      await Promise.resolve()
      expect(otp.value.value).toBe('1234')
      expect(otp.input.errors.value).toEqual([])
    })
  })

  describe('input passthrough', () => {
    it('should apply rules to the joined value through createInput', async () => {
      const otp = setup({
        length: 4,
        rules: [(v: unknown) => v === '1234' || 'Invalid code'],
      })
      otp.fill('5678')
      await otp.input.validate()
      expect(otp.input.errors.value).toContain('Invalid code')
    })

    it('should reset the OTP value via input.reset()', () => {
      const otp = setup({ length: 4 })
      otp.fill('1234')
      expect(otp.value.value).toBe('1234')
      otp.input.reset()
      expect(otp.value.value).toBe('')
    })
  })
})
