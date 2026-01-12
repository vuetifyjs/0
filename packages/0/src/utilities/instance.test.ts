import { describe, expect, it, vi, afterEach } from 'vitest'

// Types
import type * as Vue from 'vue'

import { instanceExists, instanceName } from './instance'

const mocks = vi.hoisted(() => ({
  getCurrentInstance: vi.fn(),
  currentInstance: undefined as any,
  hasCurrentInstance: false,
}))

vi.mock('vue', async importOriginal => {
  const actual = await importOriginal<typeof Vue>()

  // Create a proxy to control whether currentInstance exists
  return new Proxy({
    ...actual,
    getCurrentInstance: mocks.getCurrentInstance,
  }, {
    get (target, prop) {
      if (prop === 'currentInstance') {
        return mocks.hasCurrentInstance ? mocks.currentInstance : undefined
      }
      return Reflect.get(target, prop)
    },
    has (target, prop) {
      if (prop === 'currentInstance') {
        return mocks.hasCurrentInstance
      }
      return Reflect.has(target, prop)
    },
  })
})

describe('instance', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mocks.hasCurrentInstance = false
    mocks.currentInstance = undefined
    mocks.getCurrentInstance.mockReturnValue(null)
  })

  describe('instanceExists', () => {
    it('should use getCurrentInstance when currentInstance not exported', () => {
      mocks.hasCurrentInstance = false
      mocks.getCurrentInstance.mockReturnValue({} as any)

      expect(instanceExists()).toBe(true)
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    })

    it('should return false if getCurrentInstance returns null', () => {
      mocks.hasCurrentInstance = false
      mocks.getCurrentInstance.mockReturnValue(null)

      expect(instanceExists()).toBe(false)
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    })

    it('should use currentInstance when exported (Vue 3.6+)', () => {
      mocks.hasCurrentInstance = true
      mocks.currentInstance = {}

      expect(instanceExists()).toBe(true)
      expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
    })

    it('should return false if currentInstance is null (Vue 3.6+)', () => {
      mocks.hasCurrentInstance = true
      mocks.currentInstance = null

      expect(instanceExists()).toBe(false)
      expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
    })
  })

  describe('instanceName', () => {
    it('should get name from getCurrentInstance when currentInstance not exported', () => {
      mocks.hasCurrentInstance = false
      mocks.getCurrentInstance.mockReturnValue({ type: { name: 'TestComponent' } } as any)

      expect(instanceName()).toBe('TestComponent')
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    })

    it('should return undefined if getCurrentInstance returns null', () => {
      mocks.hasCurrentInstance = false
      mocks.getCurrentInstance.mockReturnValue(null)

      expect(instanceName()).toBeUndefined()
    })

    it('should get name from currentInstance when exported (Vue 3.6+)', () => {
      mocks.hasCurrentInstance = true
      mocks.currentInstance = { type: { name: 'TestComponent36' } }

      expect(instanceName()).toBe('TestComponent36')
      expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
    })

    it('should return undefined if currentInstance is null (Vue 3.6+)', () => {
      mocks.hasCurrentInstance = true
      mocks.currentInstance = null

      expect(instanceName()).toBeUndefined()
    })
  })
})
