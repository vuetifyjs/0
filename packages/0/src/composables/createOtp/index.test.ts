import { describe, expect, it, vi } from 'vitest'

import { createOtp } from './index'

// Utilities
import { nextTick, shallowRef } from 'vue'

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
      expect(typeof otp.write).toBe('function')
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
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      otp.accepts('1')
      otp.accepts('2')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('multi-character'))
    })

    it('should reject multi-character input', () => {
      const otp = setup()
      expect(otp.accepts('12')).toBe(false)
      expect(otp.accepts('ab')).toBe(false)
    })
  })

  describe('write', () => {
    it('should write a single character at the index', () => {
      const otp = setup()
      otp.write(0, '4')
      expect(otp.value.value).toBe('4')
    })

    it('should write at the configured length boundary', () => {
      const otp = setup({ length: 4 })
      otp.fill('12')
      otp.write(2, '3')
      otp.write(3, '4')
      expect(otp.value.value).toBe('1234')
    })

    it('should silently drop out-of-range indices', () => {
      const otp = setup({ length: 4 })
      otp.write(-1, '1')
      otp.write(4, '1')
      expect(otp.value.value).toBe('')
    })

    it('should truncate to-the-end when char is empty', () => {
      const otp = setup()
      otp.fill('12345')
      otp.write(2, '')
      expect(otp.value.value).toBe('12')
    })

    it('should use the first character when multi-char is passed', () => {
      const otp = setup({ pattern: 'alphanumeric' })
      otp.write(0, 'ab')
      expect(otp.value.value).toBe('a')
    })

    it('should drop characters that fail the pattern', () => {
      const otp = setup() // numeric default
      otp.write(0, 'a')
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
      otp.write(3, '4')
      expect(otp.isComplete.value).toBe(true)
    })

    it('should drop back to false when the value shrinks', () => {
      const otp = setup({ length: 4 })
      otp.fill('1234')
      expect(otp.isComplete.value).toBe(true)
      otp.write(3, '')
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

    it('should drop isComplete to false when pattern change invalidates existing characters', async () => {
      const mode = shallowRef<'numeric' | 'alphabetic'>('numeric')
      const otp = setup({ length: 4, pattern: () => mode.value })
      otp.fill('1234')
      expect(otp.isComplete.value).toBe(true)
      mode.value = 'alphabetic'
      await nextTick()
      expect(otp.isComplete.value).toBe(false)
    })
  })

  describe('disabled / readonly gating', () => {
    it('should no-op mutations when disabled is true', () => {
      const disabled = shallowRef(true)
      const otp = setup({ disabled })
      otp.write(0, '1')
      otp.distribute('123')
      otp.fill('999')
      expect(otp.value.value).toBe('')
      disabled.value = false
      otp.write(0, '1')
      expect(otp.value.value).toBe('1')
    })

    it('should no-op mutations when readonly is true', () => {
      const otp = setup({ readonly: true })
      otp.write(0, '1')
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
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledWith('1234')
    })

    it('should fire again on a subsequent false → true cycle', async () => {
      const onComplete = vi.fn()
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await nextTick()
      otp.clear()
      otp.fill('5678')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(2)
    })

    it('should clear value and set error when sync onComplete returns false', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.isValid.value).toBe(false)
      expect(otp.input.errors.value).toContain('Invalid code')
    })

    it('should clear error state on the next mutation', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await nextTick()
      expect(otp.input.errors.value).toContain('Invalid code')
      otp.write(0, '9')
      expect(otp.input.errors.value).not.toContain('Invalid code')
    })

    it('should fire onComplete again when the same value is re-entered after rejection', async () => {
      let allow = false
      const onComplete = vi.fn(() => allow)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(otp.value.value).toBe('')
      allow = true
      otp.fill('1234')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(2)
      expect(otp.value.value).toBe('1234')
    })

    it('should clear value and warn when onComplete throws', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({ length: 4, onComplete: () => {
        throw new Error('boom')
      } })
      otp.fill('1234')
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('Invalid code')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toEqual(expect.stringContaining('onComplete threw'))
    })

    it('should leave the value intact when sync onComplete returns undefined', async () => {
      const otp = setup({ length: 4, onComplete: () => {} })
      otp.fill('1234')
      await nextTick()
      expect(otp.value.value).toBe('1234')
      expect(otp.input.errors.value).toEqual([])
    })

    it('should fire onComplete again after clear and re-entry of the same accepted value', async () => {
      const onComplete = vi.fn(() => true)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(1)
      otp.clear()
      otp.fill('1234')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(2)
    })

    it('should handle onComplete throwing a non-Error value without crashing', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({ length: 4, onComplete: () => {
        throw null
      } })
      otp.fill('1234')
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('Invalid code')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toEqual(expect.stringContaining('onComplete threw'))
    })

    it('should preserve rejection error when fill receives only rejected characters', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await nextTick()
      expect(otp.input.errors.value).toContain('Invalid code')
      otp.fill('----')
      expect(otp.input.errors.value).toContain('Invalid code')
      expect(otp.value.value).toBe('')
    })

    it('should clear rejection error when fill receives empty input', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await nextTick()
      expect(otp.input.errors.value).toContain('Invalid code')
      otp.fill('')
      expect(otp.input.errors.value).not.toContain('Invalid code')
      expect(otp.value.value).toBe('')
    })

    it('should not fire onComplete when reactive length decrease makes value complete', async () => {
      const length = shallowRef(4)
      const onComplete = vi.fn(() => true)
      const otp = setup({ length, onComplete })
      otp.fill('12')
      await nextTick()
      expect(onComplete).not.toHaveBeenCalled()
      length.value = 2
      await nextTick()
      // The watcher is on `value`, not on `isComplete` — length-driven completion
      // does not trigger onComplete. Consumers driving length reactively must watch
      // isComplete themselves if they need to react to length-induced completion.
      expect(onComplete).not.toHaveBeenCalled()
      expect(otp.isComplete.value).toBe(true)
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
      await nextTick()
      otp.write(0, '9')
      expect(otp.value.value).toBe('1234')
      resolve(false)
      await nextTick()
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('Invalid code')
    })

    it('should leave the value intact on async accept', async () => {
      const otp = setup({
        length: 4,
        onComplete: () => Promise.resolve(true),
      })
      otp.fill('1234')
      await nextTick()
      await nextTick()
      expect(otp.value.value).toBe('1234')
      expect(otp.input.errors.value).toEqual([])
    })

    it('should clear value and warn when onComplete returns a rejected promise', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({
        length: 4,
        onComplete: () => Promise.reject(new Error('network error')),
      })
      otp.fill('1234')
      await nextTick()
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('Invalid code')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toEqual(expect.stringContaining('onComplete rejected'))
    })

    it('should handle a rejected promise with a non-Error value without crashing', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const otp = setup({
        length: 4,
        onComplete: () => Promise.reject(null),
      })
      otp.fill('1234')
      await nextTick()
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('Invalid code')
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy.mock.calls[0][0]).toEqual(expect.stringContaining('onComplete rejected'))
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
      await nextTick()
      await nextTick()
      expect(otp.value.value).toBe('1234')
      expect(otp.input.errors.value).toEqual([])
    })

    it('should reject when a non-native thenable resolves false', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const onComplete = vi.fn(() => ({
        // eslint-disable-next-line unicorn/no-thenable
        then (onfulfilled?: ((v: boolean) => unknown) | null) {
          onfulfilled?.(false)
        },
      }) as PromiseLike<boolean>)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await nextTick()
      await nextTick()
      expect(otp.value.value).toBe('')
      expect(otp.input.errors.value).toContain('Invalid code')
      spy.mockRestore()
    })

    it('should unblock mutations after async onComplete resolves true', async () => {
      let resolve!: (ok: boolean) => void
      const otp = setup({
        length: 4,
        onComplete: () => new Promise<boolean>(r => {
          resolve = r
        }),
      })
      otp.fill('1234')
      await nextTick()
      // During pending, mutations no-op
      otp.write(0, '9')
      expect(otp.value.value).toBe('1234')
      // Accept the completion
      resolve(true)
      await nextTick()
      await nextTick()
      // Now mutations should work again
      otp.write(0, '9')
      expect(otp.value.value).toBe('9234')
    })

    it('should no-op clear() while async onComplete is pending', async () => {
      let resolve!: (ok: boolean) => void
      const otp = setup({
        length: 4,
        onComplete: () => new Promise<boolean>(r => {
          resolve = r
        }),
      })
      otp.fill('1234')
      await nextTick()
      otp.clear()
      expect(otp.value.value).toBe('1234')
      resolve(true)
      await nextTick()
      await nextTick()
      // Unlocked after accept; clear works now
      otp.clear()
      expect(otp.value.value).toBe('')
    })

    it('should leave value intact when async onComplete resolves undefined (void)', async () => {
      const otp = setup({
        length: 4,
        onComplete: async () => { /* void */ },
      })
      otp.fill('1234')
      await nextTick()
      await nextTick()
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

    it('should clear the rejection error when input.reset() is called', async () => {
      const otp = setup({ length: 4, onComplete: () => false })
      otp.fill('1234')
      await nextTick()
      expect(otp.input.errors.value).toContain('Invalid code')
      otp.input.reset()
      expect(otp.input.errors.value).not.toContain('Invalid code')
      expect(otp.value.value).toBe('')
    })

    it('should fire onComplete again after input.reset() and same-value re-entry', async () => {
      const onComplete = vi.fn(() => true)
      const otp = setup({ length: 4, onComplete })
      otp.fill('1234')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(1)
      otp.input.reset()
      otp.fill('1234')
      await nextTick()
      expect(onComplete).toHaveBeenCalledTimes(2)
    })
  })
})
