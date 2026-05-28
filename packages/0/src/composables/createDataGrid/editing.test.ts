import { describe, expect, it, vi } from 'vitest'

import { createCellEditing } from './editing'

// Types
import type { ID } from '#v0/types'

describe('createCellEditing', () => {
  const columns = [
    { id: 'name', editable: true },
    { id: 'email', editable: true, validate: (v: unknown) => (typeof v === 'string' && v.includes('@')) || 'Invalid email' },
    { id: 'id', editable: false },
  ]

  function createRegistryStub () {
    const listeners = new Map<string, ((data: unknown) => void)[]>()
    return {
      on (event: string, listener: (data: unknown) => void) {
        const list = listeners.get(event) ?? []
        list.push(listener)
        listeners.set(event, list)
      },
      emit (event: string, data?: { id: ID }) {
        for (const listener of listeners.get(event) ?? []) listener(data)
      },
    }
  }

  it('should start with no active cell', () => {
    const editing = createCellEditing({ columns })
    expect(editing.active.value).toBeNull()
  })

  it('should set active cell on edit', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    expect(editing.active.value).toEqual({ row: 1, column: 'name' })
  })

  it('should reject non-editable columns', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'id')
    expect(editing.active.value).toBeNull()
  })

  it('should clear active cell on cancel', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    editing.cancel()
    expect(editing.active.value).toBeNull()
  })

  it('should call onEdit and clear active on commit', () => {
    const onEdit = vi.fn()
    const editing = createCellEditing({ columns, onEdit })
    editing.edit(1, 'name')
    editing.commit('Alice')
    expect(onEdit).toHaveBeenCalledWith(1, 'name', 'Alice')
    expect(editing.active.value).toBeNull()
  })

  it('should reject invalid value and set error on commit', () => {
    const onEdit = vi.fn()
    const editing = createCellEditing({ columns, onEdit })
    editing.edit(1, 'email')
    editing.commit('not-an-email')
    expect(onEdit).not.toHaveBeenCalled()
    expect(editing.error.value).toBe('Invalid email')
    expect(editing.active.value).toEqual({ row: 1, column: 'email' })
  })

  it('should accept valid value after previous error', () => {
    const onEdit = vi.fn()
    const editing = createCellEditing({ columns, onEdit })
    editing.edit(1, 'email')
    editing.commit('not-an-email')
    expect(editing.error.value).toBe('Invalid email')

    editing.commit('valid@email.com')
    expect(onEdit).toHaveBeenCalledWith(1, 'email', 'valid@email.com')
    expect(editing.error.value).toBeNull()
    expect(editing.active.value).toBeNull()
  })

  it('should track staged dirty cell values', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    editing.dirty.set(1, new Map([['name', 'pending']]))
    expect(editing.dirty.get(1)?.get('name')).toBe('pending')
  })

  it('should clear error on cancel', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'email')
    editing.commit('bad')
    expect(editing.error.value).toBe('Invalid email')
    editing.cancel()
    expect(editing.error.value).toBeNull()
  })

  it('should not leak an empty dirty entry when edit is followed by cancel', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    editing.cancel()
    expect(editing.dirty.has(1)).toBe(false)
    expect(editing.dirty.size).toBe(0)
  })

  it('should clear the active cell entry from dirty on cancel', () => {
    const editing = createCellEditing({ columns })
    editing.dirty.set(1, new Map([['name', 'staged'], ['email', 'other@example.com']]))
    editing.edit(1, 'name')
    editing.cancel()
    expect(editing.dirty.get(1)?.has('name')).toBe(false)
    expect(editing.dirty.get(1)?.get('email')).toBe('other@example.com')
  })

  it('should drop the row entry on cancel when only the active cell was staged', () => {
    const editing = createCellEditing({ columns })
    editing.dirty.set(1, new Map([['name', 'staged']]))
    editing.edit(1, 'name')
    editing.cancel()
    expect(editing.dirty.has(1)).toBe(false)
  })

  it('should clear active and dirty when the row is unregistered', () => {
    const registry = createRegistryStub()
    const editing = createCellEditing({ columns, registry })
    editing.edit(1, 'name')
    editing.dirty.set(1, new Map([['name', 'pending']]))

    registry.emit('unregister:ticket', { id: 1 })

    expect(editing.active.value).toBeNull()
    expect(editing.dirty.has(1)).toBe(false)
  })

  it('should not clear active when an unrelated row is unregistered', () => {
    const registry = createRegistryStub()
    const editing = createCellEditing({ columns, registry })
    editing.edit(1, 'name')
    editing.dirty.set(2, new Map([['name', 'pending']]))

    registry.emit('unregister:ticket', { id: 2 })

    expect(editing.active.value).toEqual({ row: 1, column: 'name' })
    expect(editing.dirty.has(2)).toBe(false)
  })

  it('should clear active, error, and dirty when the registry is cleared', () => {
    const registry = createRegistryStub()
    const editing = createCellEditing({ columns, registry })
    editing.edit(1, 'email')
    editing.commit('bad')
    editing.dirty.set(1, new Map([['email', 'pending']]))
    editing.dirty.set(2, new Map([['name', 'pending']]))

    registry.emit('clear:registry')

    expect(editing.active.value).toBeNull()
    expect(editing.error.value).toBeNull()
    expect(editing.dirty.size).toBe(0)
  })
})
