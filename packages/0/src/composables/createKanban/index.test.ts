import { describe, expect, it, vi } from 'vitest'

// Utilities
import { isUndefined } from '#v0/utilities'

// Types
import type { SortableTicketInput } from '#v0/composables/createSortable'
import type { KanbanColumnTicketInput } from './index'

import { createKanban } from './index'

interface CardInput extends SortableTicketInput {
  value: { title: string }
}

interface ColumnInput extends KanbanColumnTicketInput<CardInput> {
  value: { title: string }
}

describe('createKanban', () => {
  describe('shape', () => {
    it('should expose columns sortable, transfer, on, off', () => {
      const kanban = createKanban()

      expect(typeof kanban.columns.register).toBe('function')
      expect(typeof kanban.columns.move).toBe('function')
      expect(typeof kanban.transfer).toBe('function')
      expect(typeof kanban.on).toBe('function')
      expect(typeof kanban.off).toBe('function')
    })

    it('should expose a live kanban.columns.size getter', () => {
      const kanban = createKanban<CardInput, ColumnInput>()

      expect(kanban.columns.size).toBe(0)

      kanban.columns.register({ value: { title: 'Todo' } })
      expect(kanban.columns.size).toBe(1)

      const done = kanban.columns.register({ value: { title: 'Done' } })
      expect(kanban.columns.size).toBe(2)

      done.unregister()
      expect(kanban.columns.size).toBe(1)
    })
  })

  describe('columns.register', () => {
    it('should attach a SortableContext to each registered column on `items`', () => {
      const kanban = createKanban<CardInput, ColumnInput>()

      const column = kanban.columns.register({ value: { title: 'Todo' } })

      expect(column.items).toBeDefined()
      expect(typeof column.items.register).toBe('function')
      expect(typeof column.items.move).toBe('function')
      expect(column.items.size).toBe(0)
    })

    it('should give each column its own independent items sortable', () => {
      const kanban = createKanban<CardInput, ColumnInput>()

      const a = kanban.columns.register({ value: { title: 'A' } })
      const b = kanban.columns.register({ value: { title: 'B' } })

      a.items.register({ value: { title: 'card-a' } })
      expect(a.items.size).toBe(1)
      expect(b.items.size).toBe(0)
    })

    it('should keep the per-column items sortable functional after register/move', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const a = todo.items.register({ value: { title: 'a' } })
      const b = todo.items.register({ value: { title: 'b' } })

      // Intra-column reorder delegates to the inner sortable; cross-column lookup
      // consistency is verified through the transfer suite below.
      const moved = todo.items.move(a.id, 1)
      expect(moved?.id).toBe(a.id)
      expect(moved?.index).toBe(1)
      expect(b.index).toBe(0)
    })

    it('should attach items to every column registered via onboard', () => {
      const kanban = createKanban<CardInput, ColumnInput>()

      const [todo, done] = kanban.columns.onboard([
        { value: { title: 'Todo' } },
        { value: { title: 'Done' } },
      ])

      expect(typeof todo!.items.register).toBe('function')
      expect(typeof done!.items.register).toBe('function')
      expect(todo!.items.size).toBe(0)
      expect(done!.items.size).toBe(0)
    })

    it('should attach items when upserting a new column id', () => {
      const kanban = createKanban<CardInput, ColumnInput>()

      const todo = kanban.columns.upsert('todo-1', { value: { title: 'Todo' } })

      expect(typeof todo.items.register).toBe('function')
      expect(todo.items.size).toBe(0)
    })

    it('should support kanban.columns.swap to swap column positions', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const a = kanban.columns.register({ value: { title: 'A' } })
      kanban.columns.register({ value: { title: 'B' } })
      const c = kanban.columns.register({ value: { title: 'C' } })

      kanban.columns.swap(a.id, c.id)

      expect(kanban.columns.values().map(col => col.value.title)).toEqual(['C', 'B', 'A'])
    })

    it('should support kanban.columns.reorder for full column reorder', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const a = kanban.columns.register({ value: { title: 'A' } })
      const b = kanban.columns.register({ value: { title: 'B' } })
      const c = kanban.columns.register({ value: { title: 'C' } })

      kanban.columns.reorder([c.id, a.id, b.id])

      expect(kanban.columns.values().map(col => col.value.title)).toEqual(['C', 'A', 'B'])
    })

    it('should support column.items.swap and column.items.reorder within a column', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const a = todo.items.register({ value: { title: 'a' } })
      const b = todo.items.register({ value: { title: 'b' } })
      const c = todo.items.register({ value: { title: 'c' } })

      todo.items.swap(a.id, c.id)
      expect(todo.items.values().map(t => t.value.title)).toEqual(['c', 'b', 'a'])

      todo.items.reorder([b.id, c.id, a.id])
      expect(todo.items.values().map(t => t.value.title)).toEqual(['b', 'c', 'a'])
    })
  })

  describe('transfer', () => {
    function setup () {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      const a = todo.items.register({ value: { title: 'a' } })
      const b = todo.items.register({ value: { title: 'b' } })
      return { kanban, todo, done, a, b }
    }

    it('should move a ticket across columns preserving its id', () => {
      const { kanban, todo, done, a } = setup()

      const moved = kanban.transfer(a.id, done.id, 0)

      expect(moved?.id).toBe(a.id)
      expect(todo.items.get(a.id)).toBeUndefined()
      expect(done.items.get(a.id)?.id).toBe(a.id)
      expect(done.items.get(a.id)?.index).toBe(0)
    })

    it('should fire transfer:ticket with the full payload', () => {
      const { kanban, todo, done, a } = setup()

      const handler = vi.fn()
      kanban.on('transfer:ticket', handler)

      kanban.transfer(a.id, done.id, 0)

      expect(handler).toHaveBeenCalledTimes(1)
      const payload = handler.mock.calls[0]![0]
      expect(payload.ticket.id).toBe(a.id)
      expect(payload.from).toBe(todo.id)
      expect(payload.to).toBe(done.id)
      expect(payload.fromIndex).toBe(0)
      expect(payload.toIndex).toBe(0)
    })

    it('should collapse same-column transfer to move and not fire transfer:ticket', () => {
      const { kanban, todo, a } = setup()

      const handler = vi.fn()
      kanban.on('transfer:ticket', handler)

      const moved = kanban.transfer(a.id, todo.id, 1)

      expect(moved?.id).toBe(a.id)
      expect(moved?.index).toBe(1)
      expect(handler).not.toHaveBeenCalled()
    })

    it('should no-op when kanban.disabled is true', () => {
      const kanban = createKanban<CardInput, ColumnInput>({ disabled: true })
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(todo.items.get(a.id)?.id).toBe(a.id)
      expect(done.items.size).toBe(0)
    })

    it('should no-op when source column is disabled', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' }, disabled: true })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(done.items.size).toBe(0)
    })

    it('should no-op when destination column is disabled', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' }, disabled: true })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(done.items.size).toBe(0)
    })

    it('should no-op when the ticket itself is disabled', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      const a = todo.items.register({ value: { title: 'a' }, disabled: true })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(done.items.size).toBe(0)
    })

    it('should reject the transfer when dest.accept returns false', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({
        value: { title: 'Done' },
        accept: () => false,
      })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(done.items.size).toBe(0)
    })

    it('should accept when dest.accept returns true', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({
        value: { title: 'Done' },
        accept: () => true,
      })
      const a = todo.items.register({ value: { title: 'a' } })

      const moved = kanban.transfer(a.id, done.id, 0)
      expect(moved?.id).toBe(a.id)
    })

    it('should warn and return undefined for an unknown ticket id', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })

      expect(kanban.transfer('does-not-exist', todo.id, 0)).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('unknown ticket id'))
      spy.mockRestore()
    })

    it('should warn and return undefined for an unknown destination column', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, 'no-such-column', 0)).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('unknown destination column'))
      spy.mockRestore()
    })

    it('should land the transferred ticket at the requested index when dest already has items', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })

      const a = todo.items.register({ value: { title: 'a' } })
      done.items.register({ value: { title: 'x' } })
      done.items.register({ value: { title: 'y' } })
      done.items.register({ value: { title: 'z' } })

      const moved = kanban.transfer(a.id, done.id, 1)

      expect(moved?.id).toBe(a.id)
      expect(moved?.index).toBe(1)
      expect(done.items.size).toBe(4)
      expect(done.items.values().map(t => t.value.title)).toEqual(['x', 'a', 'y', 'z'])
    })

    it('should reject and warn when dest.accept returns a thenable', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({
        value: { title: 'Done' },
        accept: (() => Promise.resolve(true)) as unknown as ColumnInput['accept'],
      })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('thenable'))
      spy.mockRestore()
    })

    it('should bind the transferred ticket\'s unregister to the destination column', () => {
      const { kanban, todo, done, a } = setup()

      const moved = kanban.transfer(a.id, done.id, 0)
      expect(moved?.id).toBe(a.id)

      // Calling unregister on the returned ticket should remove from done, not todo.
      moved!.unregister()
      expect(done.items.get(a.id)).toBeUndefined()
      expect(done.items.size).toBe(0)
      // todo had its own item removed already during transfer; size should still be 1 (b).
      expect(todo.items.size).toBe(1)
    })

    it('should reject and log an error when dest.accept throws', () => {
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({
        value: { title: 'Done' },
        accept: () => {
          throw new Error('boom')
        },
      })
      const a = todo.items.register({ value: { title: 'a' } })

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(done.items.size).toBe(0)
      expect(errSpy).toHaveBeenCalledTimes(1)

      errSpy.mockRestore()
    })

    it('should never call dest.accept on same-column transfer', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const acceptSpy = vi.fn(() => true)
      const todo = kanban.columns.register({
        value: { title: 'Todo' },
        accept: acceptSpy,
      })
      const a = todo.items.register({ value: { title: 'a' } })
      todo.items.register({ value: { title: 'b' } })

      kanban.transfer(a.id, todo.id, 1)

      expect(acceptSpy).not.toHaveBeenCalled()
    })

    it('should clamp toIndex above destination size to the end', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      const a = todo.items.register({ value: { title: 'a' } })
      done.items.register({ value: { title: 'x' } })
      done.items.register({ value: { title: 'y' } })

      const moved = kanban.transfer(a.id, done.id, 99)

      expect(moved?.id).toBe(a.id)
      expect(moved?.index).toBe(2)
      expect(done.items.values().map(t => t.value.title)).toEqual(['x', 'y', 'a'])
    })

    it('should expose final state to transfer:ticket subscribers (batch consistency)', () => {
      const { kanban, todo, done, a } = setup()

      let observedSrc = -1
      let observedDst = -1
      let observedDstHas = false

      kanban.on('transfer:ticket', () => {
        observedSrc = todo.items.size
        observedDst = done.items.size
        observedDstHas = !isUndefined(done.items.get(a.id))
      })

      kanban.transfer(a.id, done.id, 0)

      expect(observedSrc).toBe(1)
      expect(observedDst).toBe(1)
      expect(observedDstHas).toBe(true)
    })

    it('should unsubscribe a transfer:ticket listener via off()', () => {
      const { kanban, done, a, b } = setup()

      const handler = vi.fn()
      kanban.on('transfer:ticket', handler)

      kanban.transfer(a.id, done.id, 0)
      expect(handler).toHaveBeenCalledTimes(1)

      kanban.off('transfer:ticket', handler)

      kanban.transfer(b.id, done.id, 0)
      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('column lifecycle', () => {
    it('should not be findable for transfer after the source column is unregistered', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      const a = todo.items.register({ value: { title: 'a' } })

      todo.unregister()

      expect(kanban.transfer(a.id, done.id, 0)).toBeUndefined()
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockRestore()
    })

    it('should leave sibling columns untouched when one column is unregistered', () => {
      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })
      todo.items.register({ value: { title: 'a' } })
      const b = done.items.register({ value: { title: 'b' } })

      todo.unregister()

      expect(done.items.get(b.id)?.id).toBe(b.id)
      expect(kanban.columns.get(done.id)?.id).toBe(done.id)
    })

    it('should keep lookup consistent after register/unregister/transfer churn', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const kanban = createKanban<CardInput, ColumnInput>()
      const todo = kanban.columns.register({ value: { title: 'Todo' } })
      const done = kanban.columns.register({ value: { title: 'Done' } })

      const a = todo.items.register({ value: { title: 'a' } })
      const b = todo.items.register({ value: { title: 'b' } })
      todo.items.unregister(b.id)

      kanban.transfer(a.id, done.id, 0)

      // a was transferred; lookup should now route a.id → done; b is gone.
      // Verifying via behavior: another transfer of a should now find it in done.
      expect(kanban.transfer(a.id, todo.id, 0)?.id).toBe(a.id)
      expect(todo.items.size).toBe(1)
      expect(done.items.size).toBe(0)

      // Non-existent id should warn (lookup correctly returns undefined for stale keys).
      expect(kanban.transfer(b.id, done.id, 0)).toBeUndefined()
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('unknown ticket id'))

      spy.mockRestore()
    })
  })
})
