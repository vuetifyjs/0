import { afterEach, describe, expect, it, vi } from 'vitest'

import { createCombobox, createComboboxContext, useCombobox } from './index'

// Utilities
import { effectScope, inject, nextTick } from 'vue'

// Types
import type { EffectScope } from 'vue'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    provide: vi.fn(),
    inject: vi.fn(),
  }
})

const mockInject = vi.mocked(inject)

let scope: EffectScope

function setup (options: Parameters<typeof createCombobox>[0] = {}) {
  let ctx: ReturnType<typeof createCombobox>
  scope = effectScope()
  scope.run(() => {
    ctx = createCombobox(options)
  })
  return ctx!
}

afterEach(() => {
  scope?.stop()
})

describe('createCombobox', () => {
  describe('basic functionality', () => {
    it('should create a combobox context with defaults', () => {
      const ctx = setup()

      expect(ctx.query.value).toBe('')
      expect(ctx.pristine.value).toBe(true)
      expect(ctx.isOpen.value).toBe(false)
      expect(ctx.multiple).toBe(false)
    })

    it('should generate unique ids', () => {
      const ctx = setup()

      expect(ctx.id).toBeDefined()
      expect(ctx.inputId).toContain('-input')
      expect(ctx.listboxId).toContain('-listbox')
      expect(ctx.descriptionId).toContain('-description')
      expect(ctx.errorId).toContain('-error')
    })

    it('should accept custom id', () => {
      const ctx = setup({ id: 'my-combo' })

      expect(ctx.id).toBe('my-combo')
      expect(ctx.inputId).toBe('my-combo-input')
      expect(ctx.listboxId).toBe('my-combo-listbox')
    })

    it('should accept name and form options', () => {
      const ctx = setup({ name: 'search', form: 'my-form' })

      expect(ctx.name).toBe('search')
      expect(ctx.form).toBe('my-form')
    })
  })

  describe('open / close / toggle', () => {
    it('should open the popover', () => {
      const ctx = setup()
      ctx.open()

      expect(ctx.isOpen.value).toBe(true)
    })

    it('should close the popover and reset query', () => {
      const ctx = setup()
      ctx.open()
      ctx.query.value = 'search'
      ctx.pristine.value = false

      ctx.close()

      expect(ctx.isOpen.value).toBe(false)
      expect(ctx.query.value).toBe('')
      expect(ctx.pristine.value).toBe(true)
    })

    it('should toggle open/close', () => {
      const ctx = setup()

      ctx.toggle()
      expect(ctx.isOpen.value).toBe(true)

      ctx.toggle()
      expect(ctx.isOpen.value).toBe(false)
    })

    it('should not open when disabled', () => {
      const ctx = setup({ disabled: true })
      ctx.open()

      expect(ctx.isOpen.value).toBe(false)
    })
  })

  describe('selection', () => {
    it('should select an item in single mode', () => {
      const ctx = setup()
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.register({ id: 'b', value: 'Banana' })

      ctx.open()
      ctx.select('a')

      expect(ctx.selection.selectedIds.has('a')).toBe(true)
      expect(ctx.isOpen.value).toBe(false)
    })

    it('should select an item in multiple mode', () => {
      const ctx = setup({ multiple: true })
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.register({ id: 'b', value: 'Banana' })

      ctx.open()
      ctx.select('a')

      expect(ctx.selection.selectedIds.has('a')).toBe(true)
      // In multiple mode, dropdown stays open
      expect(ctx.isOpen.value).toBe(true)
    })

    it('should clear all selections', () => {
      const ctx = setup()
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.select('a')

      ctx.clear()

      expect(ctx.selection.selectedIds.size).toBe(0)
      expect(ctx.query.value).toBe('')
      expect(ctx.pristine.value).toBe(true)
    })
  })

  describe('display', () => {
    it('should show selected value display when pristine', () => {
      const ctx = setup()
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.select('a')

      expect(ctx.display.value).toBe('Apple')
    })

    it('should show query when not pristine', () => {
      const ctx = setup()
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.select('a')

      ctx.pristine.value = false
      ctx.query.value = 'Ap'

      expect(ctx.display.value).toBe('Ap')
    })

    it('should return empty string when no selection', () => {
      const ctx = setup()

      expect(ctx.display.value).toBe('')
    })

    it('should use custom displayValue function', () => {
      const ctx = setup({
        displayValue: v => `Item: ${v}`,
      })
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.select('a')

      expect(ctx.display.value).toBe('Item: Apple')
    })

    it('should show query in multiple mode even when pristine', () => {
      const ctx = setup({ multiple: true })
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.select('a')
      ctx.query.value = 'search'

      expect(ctx.display.value).toBe('search')
    })
  })

  describe('error handling', () => {
    it('should compute isValid as false when error is true', () => {
      const ctx = setup({ error: true })

      expect(ctx.isValid.value).toBe(false)
    })

    it('should compute isValid as false when errorMessages are provided', () => {
      const ctx = setup({ errorMessages: 'Required field' })

      expect(ctx.isValid.value).toBe(false)
      expect(ctx.errors.value).toEqual(['Required field'])
    })

    it('should compute isValid as null when no errors', () => {
      const ctx = setup()

      expect(ctx.isValid.value).toBe(null)
    })

    it('should handle array errorMessages', () => {
      const ctx = setup({ errorMessages: ['Error 1', 'Error 2'] })

      expect(ctx.errors.value).toEqual(['Error 1', 'Error 2'])
      expect(ctx.isValid.value).toBe(false)
    })
  })

  describe('filtering', () => {
    it('should filter items based on query', async () => {
      const ctx = setup()
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.register({ id: 'b', value: 'Banana' })
      ctx.selection.register({ id: 'c', value: 'Cherry' })

      await nextTick()

      ctx.query.value = 'an'
      await nextTick()

      expect(ctx.filtered.value.has('b')).toBe(true)
    })

    it('should show all items when query is empty', async () => {
      const ctx = setup()
      ctx.selection.register({ id: 'a', value: 'Apple' })
      ctx.selection.register({ id: 'b', value: 'Banana' })

      await nextTick()

      expect(ctx.filtered.value.size).toBe(2)
    })
  })
})

describe('createComboboxContext', () => {
  it('should return a trinity tuple', () => {
    let result: ReturnType<typeof createComboboxContext>
    scope = effectScope()
    scope.run(() => {
      result = createComboboxContext()
    })

    expect(result!).toHaveLength(3)
    expect(typeof result![0]).toBe('function')
    expect(typeof result![1]).toBe('function')
    expect(result![2]).toBeDefined()
  })

  it('should use custom namespace', () => {
    let useCtx: ReturnType<typeof createComboboxContext>[0]
    scope = effectScope()
    scope.run(() => {
      ;([useCtx] = createComboboxContext({ namespace: 'custom:combo' }))
    })

    mockInject.mockReturnValue(undefined)

    expect(() => useCtx!()).toThrow()
    expect(mockInject).toHaveBeenCalledWith('custom:combo', undefined)
  })
})

describe('useCombobox', () => {
  it('should retrieve context from default namespace', () => {
    const mockContext = setup()
    mockInject.mockReturnValue(mockContext)

    const result = useCombobox()

    expect(mockInject).toHaveBeenCalledWith('v0:combobox', undefined)
    expect(result).toBe(mockContext)
  })

  it('should throw when context is not provided', () => {
    mockInject.mockReturnValue(undefined)

    expect(() => useCombobox()).toThrow()
  })
})
