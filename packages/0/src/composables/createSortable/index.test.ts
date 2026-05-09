import { describe, expect, it } from 'vitest'

// Types
import type { ID } from '#v0/types'
import type { SortableTicketInput } from './index'

import { createSortable } from './index'

interface StringTicket extends SortableTicketInput {
  value: string
}

interface ItemTicket extends SortableTicketInput {
  value: { id: number, label: string }
}

describe('createSortable', () => {
  describe('inheritance', () => {
    it('should expose register/onboard/unregister/move from createRegistry', () => {
      const sortable = createSortable()

      expect(typeof sortable.register).toBe('function')
      expect(typeof sortable.onboard).toBe('function')
      expect(typeof sortable.unregister).toBe('function')
      expect(typeof sortable.move).toBe('function')
      expect(typeof sortable.lookup).toBe('function')
      expect(typeof sortable.browse).toBe('function')
      expect(typeof sortable.seek).toBe('function')
      expect(typeof sortable.keys).toBe('function')
      expect(typeof sortable.values).toBe('function')
      expect(typeof sortable.on).toBe('function')
    })

    it('should register a typed ticket with value', () => {
      const sortable = createSortable<ItemTicket>()
      const ticket = sortable.register({ value: { id: 1, label: 'A' } })

      expect(ticket.id).toBeDefined()
      expect(ticket.index).toBe(0)
      expect(ticket.value).toEqual({ id: 1, label: 'A' })
    })

    it('should onboard multiple tickets in input order', () => {
      const sortable = createSortable<StringTicket>()
      const tickets = sortable.onboard([
        { value: 'a' },
        { value: 'b' },
        { value: 'c' },
      ])

      expect(tickets).toHaveLength(3)
      expect(tickets[0]!.value).toBe('a')
      expect(tickets[1]!.value).toBe('b')
      expect(tickets[2]!.value).toBe('c')
      expect(tickets.map(t => t.index)).toEqual([0, 1, 2])
    })

    it('should expose a reactive size that tracks the registry count', () => {
      const sortable = createSortable<StringTicket>()

      expect(sortable.size).toBe(0)

      sortable.register({ value: 'a' })
      expect(sortable.size).toBe(1)

      sortable.onboard([{ value: 'b' }, { value: 'c' }])
      expect(sortable.size).toBe(3)

      const tickets = sortable.values()
      sortable.unregister(tickets[0]!.id)
      expect(sortable.size).toBe(2)
    })
  })

  describe('move', () => {
    it('should emit move:ticket with from/to when index changes', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      const b = sortable.register({ value: 'b' })
      const c = sortable.register({ value: 'c' })

      const events: Array<{ ticketId: ID, from: number, to: number }> = []
      sortable.on('move:ticket', payload => {
        events.push({ ticketId: payload.ticket.id, from: payload.from, to: payload.to })
      })

      sortable.move(a.id, 2)

      expect(events).toHaveLength(1)
      expect(events[0]).toEqual({ ticketId: a.id, from: 0, to: 2 })

      void b
      void c
    })

    it('should not emit move:ticket when toIndex equals current index', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      const events: unknown[] = []
      sortable.on('move:ticket', payload => events.push(payload))

      sortable.move(a.id, 0)

      expect(events).toHaveLength(0)
    })

    it('should return the moved ticket', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      const result = sortable.move(a.id, 1)

      expect(result).toBeDefined()
      expect(result!.id).toBe(a.id)
      expect(result!.index).toBe(1)
    })

    it('should return undefined for unknown id', () => {
      const sortable = createSortable<StringTicket>()

      const result = sortable.move('nope', 0)

      expect(result).toBeUndefined()
    })
  })

  describe('swap', () => {
    it('should swap two tickets and emit two move:ticket events', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })
      const c = sortable.register({ value: 'c' })

      const events: Array<{ ticketId: ID, from: number, to: number }> = []
      sortable.on('move:ticket', payload => {
        events.push({ ticketId: payload.ticket.id, from: payload.from, to: payload.to })
      })

      sortable.swap(a.id, c.id)

      expect(sortable.get(a.id)!.index).toBe(2)
      expect(sortable.get(c.id)!.index).toBe(0)
      expect(events).toHaveLength(2)
      expect(events).toContainEqual({ ticketId: a.id, from: 0, to: 2 })
      expect(events).toContainEqual({ ticketId: c.id, from: 2, to: 0 })
    })

    it('should be a no-op when ids are equal', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      const events: unknown[] = []
      sortable.on('move:ticket', payload => events.push(payload))

      sortable.swap(a.id, a.id)

      expect(events).toHaveLength(0)
    })

    it('should be a no-op when either id is unknown', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })

      const events: unknown[] = []
      sortable.on('move:ticket', payload => events.push(payload))

      sortable.swap(a.id, 'nope')
      sortable.swap('nope', a.id)

      expect(events).toHaveLength(0)
    })
  })

  describe('reorder', () => {
    it('should set the canonical order to the given ids', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      const b = sortable.register({ value: 'b' })
      const c = sortable.register({ value: 'c' })

      sortable.reorder([c.id, a.id, b.id])

      expect(sortable.get(c.id)!.index).toBe(0)
      expect(sortable.get(a.id)!.index).toBe(1)
      expect(sortable.get(b.id)!.index).toBe(2)
    })

    it('should throw when ids length differs from registry size', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      expect(() => sortable.reorder([a.id])).toThrow(/expected 2 ids, got 1/)
    })

    it('should throw when ids contain an unknown id', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      expect(() => sortable.reorder([a.id, 'nope'])).toThrow(/unknown id/)
    })

    it('should throw when ids contain duplicates', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      expect(() => sortable.reorder([a.id, a.id])).toThrow(/duplicate/)
    })

    it('should be a no-op when given the current order', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      const b = sortable.register({ value: 'b' })

      const events: unknown[] = []
      sortable.on('move:ticket', payload => events.push(payload))

      sortable.reorder([a.id, b.id])

      expect(events).toHaveLength(0)
    })
  })

  describe('disabled gates mutations', () => {
    it('should no-op move when root disabled is true', () => {
      const sortable = createSortable<StringTicket>({ disabled: true })
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      const events: unknown[] = []
      sortable.on('move:ticket', payload => events.push(payload))

      const result = sortable.move(a.id, 1)

      expect(result).toBeUndefined()
      expect(sortable.get(a.id)!.index).toBe(0)
      expect(events).toHaveLength(0)
    })

    it('should no-op move when ticket is disabled', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a', disabled: true })
      sortable.register({ value: 'b' })

      const result = sortable.move(a.id, 1)

      expect(result).toBeUndefined()
      expect(sortable.get(a.id)!.index).toBe(0)
    })

    it('should no-op swap when root disabled is true', () => {
      const sortable = createSortable<StringTicket>({ disabled: true })
      const a = sortable.register({ value: 'a' })
      const b = sortable.register({ value: 'b' })

      sortable.swap(a.id, b.id)

      expect(sortable.get(a.id)!.index).toBe(0)
      expect(sortable.get(b.id)!.index).toBe(1)
    })

    it('should no-op swap when either ticket is disabled', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a', disabled: true })
      const b = sortable.register({ value: 'b' })
      const c = sortable.register({ value: 'c' })

      sortable.swap(a.id, b.id)
      sortable.swap(b.id, a.id)

      expect(sortable.get(a.id)!.index).toBe(0)
      expect(sortable.get(b.id)!.index).toBe(1)
      expect(sortable.get(c.id)!.index).toBe(2)
    })

    it('should still swap when both tickets are enabled', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a', disabled: true })
      const b = sortable.register({ value: 'b' })
      const c = sortable.register({ value: 'c' })

      sortable.swap(b.id, c.id)

      expect(sortable.get(a.id)!.index).toBe(0)
      expect(sortable.get(b.id)!.index).toBe(2)
      expect(sortable.get(c.id)!.index).toBe(1)
    })

    it('should no-op reorder when root disabled is true', () => {
      const sortable = createSortable<StringTicket>({ disabled: true })
      const a = sortable.register({ value: 'a' })
      const b = sortable.register({ value: 'b' })

      sortable.reorder([b.id, a.id])

      expect(sortable.get(a.id)!.index).toBe(0)
      expect(sortable.get(b.id)!.index).toBe(1)
    })

    it('should move disabled tickets during reorder (bypasses per-ticket gate)', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a', disabled: true })
      const b = sortable.register({ value: 'b' })
      const c = sortable.register({ value: 'c' })

      sortable.reorder([c.id, a.id, b.id])

      expect(sortable.get(a.id)!.index).toBe(1)
      expect(sortable.get(b.id)!.index).toBe(2)
      expect(sortable.get(c.id)!.index).toBe(0)
    })

    it('should emit move:ticket for disabled tickets during reorder', () => {
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a', disabled: true })
      const b = sortable.register({ value: 'b' })

      const movedIds: Array<string | number> = []
      sortable.on('move:ticket', payload => {
        const p = payload as { ticket: { id: string | number } }
        movedIds.push(p.ticket.id)
      })

      sortable.reorder([b.id, a.id])

      // Both move; the disabled ticket's emit fires too because reorder bypasses.
      expect(movedIds).toContain(a.id)
      expect(movedIds).toContain(b.id)
    })

    it('should re-enable mutations when disabled flips back to false', async () => {
      const { ref } = await import('vue')
      const disabled = ref(true)
      const sortable = createSortable<StringTicket>({ disabled })
      const a = sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      sortable.move(a.id, 1)
      expect(sortable.get(a.id)!.index).toBe(0)

      disabled.value = false
      sortable.move(a.id, 1)
      expect(sortable.get(a.id)!.index).toBe(1)
    })

    it('should not block register / onboard / unregister when disabled is true', () => {
      const sortable = createSortable<StringTicket>({ disabled: true })

      const a = sortable.register({ value: 'a' })
      expect(sortable.get(a.id)).toBeDefined()

      const tickets = sortable.onboard([{ value: 'b' }, { value: 'c' }])
      expect(tickets).toHaveLength(2)

      sortable.unregister(a.id)
      expect(sortable.get(a.id)).toBeUndefined()
    })
  })

  describe('integration', () => {
    it('should keep useProxyRegistry snapshot in sync with move', async () => {
      const { useProxyRegistry } = await import('#v0/composables/useProxyRegistry')
      const sortable = createSortable<StringTicket>()
      const a = sortable.register({ value: 'a' })
      const b = sortable.register({ value: 'b' })

      const proxy = useProxyRegistry(sortable)

      expect(proxy.keys).toEqual([a.id, b.id])

      sortable.move(a.id, 1)

      expect(proxy.keys).toEqual([b.id, a.id])
    })

    it('should keep useProxyRegistry size in sync with the registry', async () => {
      const { useProxyRegistry } = await import('#v0/composables/useProxyRegistry')
      const sortable = createSortable<StringTicket>()
      sortable.register({ value: 'a' })
      sortable.register({ value: 'b' })

      const proxy = useProxyRegistry(sortable)

      expect(proxy.size).toBe(2)

      sortable.register({ value: 'c' })
      expect(proxy.size).toBe(3)
    })
  })
})
