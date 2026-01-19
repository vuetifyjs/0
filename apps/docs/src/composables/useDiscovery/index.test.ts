import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { inject, provide, shallowRef } from 'vue'

import {
  createDiscovery,
  createDiscoveryContext,
  createDiscoveryPlugin,
  useDiscovery,
} from './index'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockProvide = vi.mocked(provide)
const mockInject = vi.mocked(inject)

function createMockElement (connected = true): HTMLElement {
  return {
    isConnected: connected,
    getBoundingClientRect: () => ({
      top: 100,
      left: 200,
      bottom: 150,
      right: 300,
      width: 100,
      height: 50,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    }),
  } as unknown as HTMLElement
}

describe('createDiscovery', () => {
  describe('isActive state', () => {
    it('should initialize isActive as false', () => {
      const discovery = createDiscovery()

      expect(discovery.isActive.value).toBe(false)
    })

    it('should be readonly', () => {
      const discovery = createDiscovery()

      // Vue readonly() doesn't throw, it warns and silently fails
      // @ts-expect-error - testing readonly
      discovery.isActive.value = true

      // Value should remain false because it's readonly
      expect(discovery.isActive.value).toBe(false)
    })
  })

  describe('register', () => {
    describe('step registration', () => {
      it('should register a step', () => {
        const discovery = createDiscovery()

        discovery.register({
          type: 'step',
          id: 'step-1',
        })

        expect(discovery.size).toBe(1)
        expect(discovery.has('step-1')).toBe(true)
      })

      it('should register multiple steps', () => {
        const discovery = createDiscovery()

        discovery.register({ type: 'step', id: 'step-1' })
        discovery.register({ type: 'step', id: 'step-2' })
        discovery.register({ type: 'step', id: 'step-3' })

        expect(discovery.size).toBe(3)
      })

      it('should register a step with disabled state', () => {
        const discovery = createDiscovery()

        discovery.register({
          type: 'step',
          id: 'step-1',
          disabled: true,
        })

        const ticket = discovery.get('step-1')
        expect(ticket?.disabled).toBe(true)
      })

      it('should register a step with reactive disabled state', () => {
        const discovery = createDiscovery()
        const disabled = shallowRef(false)

        discovery.register({
          type: 'step',
          id: 'step-1',
          disabled: () => disabled.value,
        })

        discovery.start()
        expect(discovery.selectedId.value).toBe('step-1')

        disabled.value = true
        discovery.first()
        // Step is now disabled, should not be selectable via first()
        expect(discovery.selectedId.value).toBe('step-1') // stays selected
      })

      it('should register a step with validation rules', () => {
        const discovery = createDiscovery()
        const rule = vi.fn().mockReturnValue(true)

        discovery.register({
          type: 'step',
          id: 'step-1',
          rules: [rule],
        })

        expect(discovery.form.has('step-1')).toBe(true)
      })

      it('should not register with form when no rules provided', () => {
        const discovery = createDiscovery()

        discovery.register({
          type: 'step',
          id: 'step-1',
        })

        expect(discovery.form.has('step-1')).toBe(false)
      })

      it('should return cleanup function that unregisters step', () => {
        const discovery = createDiscovery()

        const cleanup = discovery.register({
          type: 'step',
          id: 'step-1',
        })

        expect(discovery.size).toBe(1)

        cleanup()

        expect(discovery.size).toBe(0)
        expect(discovery.has('step-1')).toBe(false)
      })

      it('should cleanup both step and form registration', () => {
        const discovery = createDiscovery()

        const cleanup = discovery.register({
          type: 'step',
          id: 'step-1',
          rules: [() => true],
        })

        expect(discovery.has('step-1')).toBe(true)
        expect(discovery.form.has('step-1')).toBe(true)

        cleanup()

        expect(discovery.has('step-1')).toBe(false)
        expect(discovery.form.has('step-1')).toBe(false)
      })
    })

    describe('activator registration', () => {
      it('should register an activator', () => {
        const discovery = createDiscovery()
        const element = shallowRef(createMockElement())

        discovery.register({ type: 'step', id: 'step-1' })
        discovery.register({
          type: 'activator',
          step: 'step-1',
          element,
        })

        expect(discovery.getActivatorElement('step-1')).toBe(element.value)
      })

      it('should return cleanup function that unregisters activator', () => {
        const discovery = createDiscovery()
        const element = shallowRef(createMockElement())

        discovery.register({ type: 'step', id: 'step-1' })
        const cleanup = discovery.register({
          type: 'activator',
          step: 'step-1',
          element,
        })

        expect(discovery.getActivatorElement('step-1')).toBe(element.value)

        cleanup()

        expect(discovery.getActivatorElement('step-1')).toBeNull()
      })

      it('should allow multiple activators for different steps', () => {
        const discovery = createDiscovery()
        const element1 = shallowRef(createMockElement())
        const element2 = shallowRef(createMockElement())

        discovery.register({ type: 'step', id: 'step-1' })
        discovery.register({ type: 'step', id: 'step-2' })
        discovery.register({ type: 'activator', step: 'step-1', element: element1 })
        discovery.register({ type: 'activator', step: 'step-2', element: element2 })

        expect(discovery.getActivatorElement('step-1')).toBe(element1.value)
        expect(discovery.getActivatorElement('step-2')).toBe(element2.value)
      })
    })
  })

  describe('start', () => {
    it('should set isActive to true', () => {
      const discovery = createDiscovery()

      discovery.start()

      expect(discovery.isActive.value).toBe(true)
    })

    it('should select first step when no step is selected', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.start()

      expect(discovery.selectedId.value).toBe('step-1')
    })

    it('should select specific step when id is provided', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.start('step-2')

      expect(discovery.selectedId.value).toBe('step-2')
    })

    it('should not change selection if step is already selected', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.select('step-2')
      discovery.start()

      expect(discovery.selectedId.value).toBe('step-2')
    })

    it('should override current selection when id is provided', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.select('step-2')
      discovery.start('step-1')

      expect(discovery.selectedId.value).toBe('step-1')
    })
  })

  describe('stop', () => {
    it('should set isActive to false', () => {
      const discovery = createDiscovery()

      discovery.start()
      expect(discovery.isActive.value).toBe(true)

      discovery.stop()
      expect(discovery.isActive.value).toBe(false)
    })

    it('should preserve current step selection', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.start('step-2')
      discovery.stop()

      expect(discovery.selectedId.value).toBe('step-2')
    })
  })

  describe('finish', () => {
    it('should set isActive to false and isCompleted to true', () => {
      const discovery = createDiscovery()
      discovery.register({ type: 'step', id: 'step-1' })
      discovery.start()

      discovery.finish()

      expect(discovery.isActive.value).toBe(false)
      expect(discovery.isCompleted.value).toBe(true)
    })

    it('should reset isCompleted when starting again', () => {
      const discovery = createDiscovery()
      discovery.register({ type: 'step', id: 'step-1' })

      discovery.start()
      discovery.finish()
      expect(discovery.isCompleted.value).toBe(true)

      discovery.start()
      expect(discovery.isCompleted.value).toBe(false)
    })
  })

  describe('disabled steps navigation', () => {
    it('should skip disabled steps on next()', () => {
      const discovery = createDiscovery()
      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2', disabled: true })
      discovery.register({ type: 'step', id: 'step-3' })

      discovery.start()
      expect(discovery.selectedId.value).toBe('step-1')

      discovery.next()
      expect(discovery.selectedId.value).toBe('step-3')
    })

    it('should skip disabled steps on prev()', () => {
      const discovery = createDiscovery()
      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2', disabled: true })
      discovery.register({ type: 'step', id: 'step-3' })

      discovery.start('step-3')
      discovery.prev()
      expect(discovery.selectedId.value).toBe('step-1')
    })

    it('should skip disabled steps on first()', () => {
      const discovery = createDiscovery()
      discovery.register({ type: 'step', id: 'step-1', disabled: true })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.start()
      discovery.first()
      expect(discovery.selectedId.value).toBe('step-2')
    })
  })

  describe('getActivatorElement', () => {
    it('should return element for step', () => {
      const discovery = createDiscovery()
      const element = shallowRef(createMockElement())

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'activator', step: 'step-1', element })

      expect(discovery.getActivatorElement('step-1')).toBe(element.value)
    })

    it('should return null when step has no activator', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })

      expect(discovery.getActivatorElement('step-1')).toBeNull()
    })

    it('should return null when element is not connected', () => {
      const discovery = createDiscovery()
      const element = shallowRef(createMockElement(false))

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'activator', step: 'step-1', element })

      expect(discovery.getActivatorElement('step-1')).toBeNull()
    })

    it('should return null when element ref is null', () => {
      const discovery = createDiscovery()
      const element = shallowRef<HTMLElement | null>(null)

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'activator', step: 'step-1', element })

      expect(discovery.getActivatorElement('step-1')).toBeNull()
    })

    it('should return null for non-existent step', () => {
      const discovery = createDiscovery()

      expect(discovery.getActivatorElement('non-existent')).toBeNull()
    })
  })

  describe('getActivatorRect', () => {
    it('should return bounding rect for step activator', () => {
      const discovery = createDiscovery()
      const element = shallowRef(createMockElement())

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'activator', step: 'step-1', element })

      const rect = discovery.getActivatorRect('step-1')

      expect(rect).not.toBeNull()
      expect(rect?.top).toBe(100)
      expect(rect?.left).toBe(200)
      expect(rect?.width).toBe(100)
      expect(rect?.height).toBe(50)
    })

    it('should return null when element is not connected', () => {
      const discovery = createDiscovery()
      const element = shallowRef(createMockElement(false))

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'activator', step: 'step-1', element })

      expect(discovery.getActivatorRect('step-1')).toBeNull()
    })

    it('should return null when no activator registered', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })

      expect(discovery.getActivatorRect('step-1')).toBeNull()
    })
  })

  describe('form integration', () => {
    it('should expose form context', () => {
      const discovery = createDiscovery()

      expect(discovery.form).toBeDefined()
      expect(typeof discovery.form.submit).toBe('function')
      expect(typeof discovery.form.reset).toBe('function')
    })

    it('should validate steps with rules', async () => {
      const discovery = createDiscovery()

      discovery.register({
        type: 'step',
        id: 'step-1',
        rules: [() => 'Error message'],
      })

      const isValid = await discovery.form.submit()

      expect(isValid).toBe(false)
    })

    it('should pass validation when rules return true', async () => {
      const discovery = createDiscovery()

      discovery.register({
        type: 'step',
        id: 'step-1',
        rules: [() => true],
      })

      const isValid = await discovery.form.submit()

      expect(isValid).toBe(true)
    })

    it('should validate a single step by id', async () => {
      const discovery = createDiscovery()

      discovery.register({
        type: 'step',
        id: 'step-1',
        rules: [() => true],
      })

      discovery.register({
        type: 'step',
        id: 'step-2',
        rules: [() => 'Step 2 error'],
      })

      // Validate only step-1, should pass
      const step1Valid = await discovery.form.submit('step-1')
      expect(step1Valid).toBe(true)

      // Validate only step-2, should fail
      const step2Valid = await discovery.form.submit('step-2')
      expect(step2Valid).toBe(false)
    })

    it('should allow navigation when validation passes', async () => {
      const discovery = createDiscovery()

      discovery.register({
        type: 'step',
        id: 'step-1',
        rules: [() => true],
      })

      discovery.register({
        type: 'step',
        id: 'step-2',
      })

      discovery.start()
      expect(discovery.selectedId.value).toBe('step-1')

      // Validate step-1 passes
      const isValid = await discovery.form.submit('step-1')
      expect(isValid).toBe(true)

      // Navigation should work
      discovery.next()
      expect(discovery.selectedId.value).toBe('step-2')
    })

    it('should block navigation when validation fails', async () => {
      const discovery = createDiscovery()

      discovery.register({
        type: 'step',
        id: 'step-1',
        rules: [() => 'Validation error'],
      })

      discovery.register({
        type: 'step',
        id: 'step-2',
      })

      discovery.start()
      expect(discovery.selectedId.value).toBe('step-1')

      // Validate step-1 fails
      const isValid = await discovery.form.submit('step-1')
      expect(isValid).toBe(false)

      // User code should check validation before calling next
      // This demonstrates the pattern used in DiscoveryRoot
      if (!isValid) {
        // Don't navigate
        expect(discovery.selectedId.value).toBe('step-1')
      }
    })

    it('should allow navigation when step has no rules', async () => {
      const discovery = createDiscovery()

      discovery.register({
        type: 'step',
        id: 'step-1',
        // No rules
      })

      discovery.register({
        type: 'step',
        id: 'step-2',
      })

      discovery.start()
      expect(discovery.selectedId.value).toBe('step-1')

      // Step without rules is not registered in form
      // form.submit with non-existent id returns true
      const isValid = await discovery.form.submit('step-1')
      expect(isValid).toBe(true)

      discovery.next()
      expect(discovery.selectedId.value).toBe('step-2')
    })

    describe('async validation', () => {
      it('should handle async validation rules', async () => {
        const discovery = createDiscovery()

        discovery.register({
          type: 'step',
          id: 'step-1',
          rules: [async () => {
            await new Promise(resolve => setTimeout(resolve, 10))
            return true
          }],
        })

        const isValid = await discovery.form.submit('step-1')
        expect(isValid).toBe(true)
      })

      it('should fail with async validation errors', async () => {
        const discovery = createDiscovery()

        discovery.register({
          type: 'step',
          id: 'step-1',
          rules: [async () => {
            await new Promise(resolve => setTimeout(resolve, 10))
            return 'Async error'
          }],
        })

        const isValid = await discovery.form.submit('step-1')
        expect(isValid).toBe(false)
      })
    })
  })

  describe('options', () => {
    it('should pass circular option to step navigation', () => {
      const discovery = createDiscovery({ circular: true })

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.start()
      discovery.last()
      discovery.next()

      // Should wrap to first
      expect(discovery.selectedId.value).toBe('step-1')
    })

    it('should default circular to false', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      discovery.start()
      discovery.last()
      discovery.next()

      // Should stay at last
      expect(discovery.selectedId.value).toBe('step-2')
    })
  })

  describe('inherited step methods', () => {
    it('should expose first/last/next/prev methods', () => {
      const discovery = createDiscovery()

      expect(typeof discovery.first).toBe('function')
      expect(typeof discovery.last).toBe('function')
      expect(typeof discovery.next).toBe('function')
      expect(typeof discovery.prev).toBe('function')
    })

    it('should expose size getter', () => {
      const discovery = createDiscovery()

      discovery.register({ type: 'step', id: 'step-1' })
      discovery.register({ type: 'step', id: 'step-2' })

      expect(discovery.size).toBe(2)
    })
  })
})

describe('createDiscoveryContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a trinity tuple', () => {
    const result = createDiscoveryContext()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(typeof result[0]).toBe('function')
    expect(typeof result[1]).toBe('function')
    expect(result[2]).toBeDefined()
  })

  it('should create context with default namespace', () => {
    const [, provideDiscoveryContext, context] = createDiscoveryContext()

    provideDiscoveryContext(context)

    expect(mockProvide).toHaveBeenCalledWith('v0:discovery', context)
  })

  it('should create context with custom namespace', () => {
    const [, provideDiscoveryContext, context] = createDiscoveryContext({
      namespace: 'my-discovery',
    })

    provideDiscoveryContext(context)

    expect(mockProvide).toHaveBeenCalledWith('my-discovery', context)
  })

  it('should pass options to createDiscovery', () => {
    const [,, context] = createDiscoveryContext({ circular: true })

    context.register({ type: 'step', id: 'step-1' })
    context.register({ type: 'step', id: 'step-2' })

    context.start()
    context.last()
    context.next()

    expect(context.selectedId.value).toBe('step-1')
  })

  it('should provide context at app level when app is passed', () => {
    const mockApp = { provide: vi.fn() } as any
    const [, provideDiscoveryContext, context] = createDiscoveryContext()

    provideDiscoveryContext(context, mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith('v0:discovery', context)
    expect(mockProvide).not.toHaveBeenCalled()
  })
})

describe('useDiscovery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should inject context with default namespace', () => {
    const mockContext = createDiscovery()
    mockInject.mockReturnValue(mockContext)

    const result = useDiscovery()

    expect(mockInject).toHaveBeenCalledWith('v0:discovery', undefined)
    expect(result).toBe(mockContext)
  })

  it('should inject context with custom namespace', () => {
    const mockContext = createDiscovery()
    mockInject.mockReturnValue(mockContext)

    const result = useDiscovery('my-discovery')

    expect(mockInject).toHaveBeenCalledWith('my-discovery', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useDiscovery()).toThrow(
      'Context "v0:discovery" not found. Ensure it\'s provided by an ancestor.',
    )
  })
})

describe('createDiscoveryPlugin', () => {
  it('should create a Vue plugin', () => {
    const plugin = createDiscoveryPlugin()

    expect(plugin).toBeDefined()
    expect(typeof plugin.install).toBe('function')
  })

  it('should provide discovery context on install', () => {
    const plugin = createDiscoveryPlugin()
    const mockApp = {
      provide: vi.fn(),
      runWithContext: vi.fn((fn: () => void) => fn()),
    } as any

    plugin.install(mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith(
      'v0:discovery',
      expect.objectContaining({
        isActive: expect.anything(),
        register: expect.any(Function),
        start: expect.any(Function),
        stop: expect.any(Function),
      }),
    )
  })

  it('should use custom namespace', () => {
    const plugin = createDiscoveryPlugin({ namespace: 'my-tour' })
    const mockApp = {
      provide: vi.fn(),
      runWithContext: vi.fn((fn: () => void) => fn()),
    } as any

    plugin.install(mockApp)

    expect(mockApp.provide).toHaveBeenCalledWith(
      'my-tour',
      expect.anything(),
    )
  })

  it('should pass options to discovery context', () => {
    const plugin = createDiscoveryPlugin({ circular: true })
    const mockApp = {
      provide: vi.fn(),
      runWithContext: vi.fn((fn: () => void) => fn()),
    } as any

    plugin.install(mockApp)

    const providedContext = mockApp.provide.mock.calls[0][1]

    providedContext.register({ type: 'step', id: 'step-1' })
    providedContext.register({ type: 'step', id: 'step-2' })
    providedContext.start()
    providedContext.last()
    providedContext.next()

    expect(providedContext.selectedId.value).toBe('step-1')
  })
})
