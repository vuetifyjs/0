import { describe, expect, it } from 'vitest'

import { isV0Error, V0Error } from './errors'

describe('v0Error', () => {
  it('should assign safe detail fields onto the instance', () => {
    const err = new V0Error('missing', { code: 'V0_CONTEXT_MISSING', key: 'v0:test' })

    expect(err.code).toBe('V0_CONTEXT_MISSING')
    expect(err.key).toBe('v0:test')
    expect(isV0Error(err, 'V0_CONTEXT_MISSING')).toBe(true)
  })

  it('should not copy prototype-polluting detail keys', () => {
    const details = JSON.parse('{"code": "V0_CONTEXT_MISSING", "key": "v0:test", "__proto__": {"polluted": true}, "constructor": {"polluted": true}}')

    const err = new V0Error('missing', details as never)

    expect(err.key).toBe('v0:test')
    expect(Object.hasOwn(err, 'constructor')).toBe(false)
    expect(Object.getPrototypeOf(err)).toBe(V0Error.prototype)
  })
})
