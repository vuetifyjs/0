import { describe, expect, it, vi } from 'vitest'

import { createCellEditing } from './editing'

describe('createCellEditing', () => {
  const columns = [
    { key: 'name', editable: true },
    { key: 'email', editable: true, validate: (v: unknown) => (typeof v === 'string' && v.includes('@')) || 'Invalid email' },
    { key: 'id', editable: false },
  ]

  it('starts with no active cell', () => {
    const editing = createCellEditing({ columns })
    expect(editing.active.value).toBeNull()
  })

  it('edit sets active cell', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    expect(editing.active.value).toEqual({ row: 1, column: 'name' })
  })

  it('edit rejects non-editable columns', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'id')
    expect(editing.active.value).toBeNull()
  })

  it('cancel clears active cell', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    editing.cancel()
    expect(editing.active.value).toBeNull()
  })

  it('commit calls onEdit and clears active', () => {
    const onEdit = vi.fn()
    const editing = createCellEditing({ columns, onEdit })
    editing.edit(1, 'name')
    editing.commit('Alice')
    expect(onEdit).toHaveBeenCalledWith(1, 'name', 'Alice')
    expect(editing.active.value).toBeNull()
  })

  it('commit rejects invalid value and sets error', () => {
    const onEdit = vi.fn()
    const editing = createCellEditing({ columns, onEdit })
    editing.edit(1, 'email')
    editing.commit('not-an-email')
    expect(onEdit).not.toHaveBeenCalled()
    expect(editing.error.value).toBe('Invalid email')
    expect(editing.active.value).toEqual({ row: 1, column: 'email' })
  })

  it('commit accepts valid value after previous error', () => {
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

  it('tracks dirty cells', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'name')
    editing.dirty.value.get(1)?.set('name', 'pending')
    expect(editing.dirty.value.get(1)?.get('name')).toBe('pending')
  })

  it('cancel clears error', () => {
    const editing = createCellEditing({ columns })
    editing.edit(1, 'email')
    editing.commit('bad')
    expect(editing.error.value).toBe('Invalid email')
    editing.cancel()
    expect(editing.error.value).toBeNull()
  })
})
