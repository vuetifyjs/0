import { describe, expect, it, vi, afterEach } from 'vitest'

// Types
import type * as Vue from 'vue'

import { instanceExists, instanceName } from './instance'

const mocks = vi.hoisted(() => ({
  version: '3.5.0',
  getCurrentInstance: vi.fn(),
  currentInstance: null as any,
}))

vi.mock('vue', async importOriginal => {
  const actual = await importOriginal<typeof Vue>()
  return {
    ...actual,
    get version () {
      return mocks.version
    },
    getCurrentInstance: mocks.getCurrentInstance,
    get currentInstance () {
      return mocks.currentInstance
    },
  }
})

describe('instance', () => {
  afterEach(() => {
    vi.clearAllMocks()
    mocks.version = '3.5.0'
    mocks.currentInstance = null
    mocks.getCurrentInstance.mockReturnValue(null)
  })

  describe('instanceExists', () => {
    it('should use getCurrentInstance for version < 3.6', () => {
      mocks.version = '3.5.0'
      mocks.getCurrentInstance.mockReturnValue({} as any)

      expect(instanceExists()).toBe(true)
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    })

    it('should return false if getCurrentInstance returns null for version < 3.6', () => {
      mocks.version = '3.5.0'
      mocks.getCurrentInstance.mockReturnValue(null)

      expect(instanceExists()).toBe(false)
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    })

    it('should use currentInstance for version >= 3.6', () => {
      mocks.version = '3.6.0'
      mocks.currentInstance = {}

      expect(instanceExists()).toBe(true)
      // getCurrentInstance should NOT be called in this path (based on the code implementation)
      expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
    })

    it('should return false if currentInstance is null for version >= 3.6', () => {
      mocks.version = '3.6.0'
      mocks.currentInstance = null

      expect(instanceExists()).toBe(false)
      expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
    })
  })

  describe('instanceName', () => {
    it('should get name from getCurrentInstance for version < 3.6', () => {
      mocks.version = '3.5.0'
      mocks.getCurrentInstance.mockReturnValue({ type: { name: 'TestComponent' } } as any)

      expect(instanceName()).toBe('TestComponent')
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    })

    it('should return undefined if getCurrentInstance returns null for version < 3.6', () => {
      mocks.version = '3.5.0'
      mocks.getCurrentInstance.mockReturnValue(null)

      expect(instanceName()).toBeUndefined()
    })

    it('should get name from currentInstance for version >= 3.6', () => {
      mocks.version = '3.6.0'
      mocks.currentInstance = { type: { name: 'TestComponent36' } }

      expect(instanceName()).toBe('TestComponent36')
      expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
    })

    it('should return undefined if currentInstance is null for version >= 3.6', () => {
      mocks.version = '3.6.0'
      mocks.currentInstance = null

      expect(instanceName()).toBeUndefined()
    })
  })
})
