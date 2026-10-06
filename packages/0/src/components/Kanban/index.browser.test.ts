import { afterEach, describe, expect, it } from 'vitest'

import { Kanban } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { KanbanMovePayload } from './index'
import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'

type Board = Record<string, string[]>

const wrappers: VueWrapper[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

function mountBoard (options: {
  board?: Board
  columns?: Record<string, Record<string, unknown>>
  dir?: 'ltr' | 'rtl'
} = {}) {
  const board = ref<Board>(options.board ?? { todo: ['a', 'b', 'c'], doing: ['d'] })
  const moves: KanbanMovePayload[] = []

  const Harness = defineComponent({
    setup () {
      return () => h('div', { dir: options.dir ?? 'ltr' }, h(Kanban.Root as Component, {
        label: 'Sprint',
        style: 'display: flex; gap: 16px; padding: 16px',
        onMove: (payload: KanbanMovePayload) => moves.push(payload),
      }, () => [
        ...Object.keys(board.value).map(key => h(Kanban.Column as unknown as Component, {
          key,
          'id': key,
          'label': key,
          'style': 'width: 160px',
          'modelValue': board.value[key],
          'onUpdate:modelValue': (value: string[]) => {
            board.value[key] = value
          },
          ...options.columns?.[key],
        }, {
          default: ({ items }: { items: string[] }) => h(Kanban.List as Component, {
            'data-list': key,
            'style': 'display: flex; flex-direction: column; gap: 8px; min-height: 200px',
          }, () => items.map(item => h(Kanban.Item as unknown as Component, {
            'key': item,
            'value': item,
            'label': `Card ${item}`,
            'data-item': item,
            'style': 'height: 40px; touch-action: none',
          }, () => item))),
        })),
        h(Kanban.LiveRegion as Component, { 'data-live': '' }),
      ]))
    },
  })

  const wrapper = mount(Harness, { attachTo: document.body })
  wrappers.push(wrapper)

  function el (selector: string) {
    return wrapper.find(selector).element as HTMLElement
  }

  function center (target: HTMLElement) {
    const rect = target.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }

  function pointer (target: EventTarget, type: string, point: { x: number, y: number }) {
    target.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      button: 0,
      pointerId: 1,
      clientX: point.x,
      clientY: point.y,
    }))
  }

  async function drag (value: string, to: { x: number, y: number }) {
    const source = el(`[data-item="${value}"]`)
    const from = center(source)

    pointer(source, 'pointerdown', from)
    pointer(document, 'pointermove', { x: from.x + 10, y: from.y + 10 })
    await nextTick()
    pointer(document, 'pointermove', to)
    await nextTick()
    pointer(document, 'pointerup', to)
    await nextTick()
    await nextTick()
  }

  return { wrapper, board, moves, el, center, drag }
}

describe('kanban (browser)', () => {
  describe('pointer drag', () => {
    it('should transfer an item into another column', async () => {
      const { board, moves, el, drag } = mountBoard()
      const list = el('[data-list="doing"]').getBoundingClientRect()

      await drag('a', { x: list.left + list.width / 2, y: list.bottom - 10 })

      expect(board.value.todo).toEqual(['b', 'c'])
      expect(board.value.doing).toEqual(['d', 'a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'doing', fromIndex: 0, toIndex: 1 }])
    })

    it('should insert before the item under the pointer', async () => {
      const { board, el, center, drag } = mountBoard()
      const target = center(el('[data-item="d"]'))

      await drag('c', { x: target.x, y: target.y - 10 })

      expect(board.value.doing).toEqual(['c', 'd'])
    })

    it('should reorder within a column without overshooting', async () => {
      const { board, moves, el, center, drag } = mountBoard()
      const target = center(el('[data-item="c"]'))

      await drag('a', { x: target.x, y: target.y + 15 })

      expect(board.value.todo).toEqual(['b', 'c', 'a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'todo', fromIndex: 0, toIndex: 2 }])
    })

    it('should not move when the destination rejects', async () => {
      const { board, moves, el, drag, wrapper } = mountBoard({
        columns: { doing: { accept: () => false } },
      })
      const list = el('[data-list="doing"]').getBoundingClientRect()

      await drag('a', { x: list.left + list.width / 2, y: list.bottom - 10 })
      await nextTick()

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
      expect(wrapper.find('[data-live]').text()).toContain('cannot')
    })

    it('should not emit when dropped back on its own slot', async () => {
      const { board, moves, el, center, drag } = mountBoard()
      const target = center(el('[data-item="b"]'))

      await drag('b', { x: target.x, y: target.y - 5 })

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })

    it('should drop into an empty column', async () => {
      const { board, moves, el, drag } = mountBoard({ board: { todo: ['a', 'b'], doing: [] } })
      const list = el('[data-list="doing"]').getBoundingClientRect()

      await drag('a', { x: list.left + list.width / 2, y: list.top + 20 })

      expect(board.value.doing).toEqual(['a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'doing', fromIndex: 0, toIndex: 0 }])
    })

    it('should mark the list under an accepted drag', async () => {
      const { el, center } = mountBoard()
      const source = el('[data-item="a"]')
      const from = center(source)
      const list = el('[data-list="doing"]')
      const rect = list.getBoundingClientRect()

      source.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, clientX: from.x, clientY: from.y }))
      document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: from.x + 10, clientY: from.y }))
      await nextTick()
      document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: rect.left + 20, clientY: rect.top + 20 }))
      await nextTick()

      expect(list.dataset.over).toBeDefined()
      expect(el('[data-item="a"]').dataset.state).toBe('dragging')

      document.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 }))
      await nextTick()

      expect(list.dataset.over).toBeUndefined()
    })
  })

  describe('keyboard', () => {
    async function key (target: HTMLElement, value: string) {
      target.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true }))
      await nextTick()
      await nextTick()
    }

    it('should keep focus on the item through a cross-column drop', async () => {
      const { board, moves, el } = mountBoard()
      const item = el('[data-item="b"]')

      item.focus()
      await key(item, ' ')
      await key(item, 'ArrowRight')

      expect(document.activeElement).toBe(item)
      expect(board.value.doing).toEqual(['d'])

      await key(item, 'Enter')

      expect(board.value.doing).toEqual(['d', 'b'])
      expect(moves).toHaveLength(1)
      expect(document.activeElement).toBe(el('[data-item="b"]'))
      expect(el('[data-item="b"]').dataset.state).toBe('idle')
    })

    it('should keep focus on the item through a same-column drop', async () => {
      const { board, el } = mountBoard()
      const item = el('[data-item="a"]')

      item.focus()
      await key(item, ' ')
      await key(item, 'ArrowDown')
      await key(item, 'Enter')

      expect(board.value.todo).toEqual(['b', 'a', 'c'])
      expect(document.activeElement).toBe(el('[data-item="a"]'))
    })

    it('should cancel when focus moves to another element', async () => {
      const { board, moves, el } = mountBoard()
      const item = el('[data-item="a"]')

      item.focus()
      await key(item, ' ')
      await key(item, 'ArrowRight')
      el('[data-item="c"]').focus()
      await nextTick()

      expect(item.dataset.state).toBe('idle')
      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })

    it('should skip a rejecting column like a pointer drag can', async () => {
      const { board, moves, el } = mountBoard({
        board: { todo: ['a'], doing: ['d'], done: [] },
        columns: { doing: { accept: () => false } },
      })
      const item = el('[data-item="a"]')

      item.focus()
      await key(item, ' ')
      await key(item, 'ArrowRight')

      expect(el('[data-list="done"]').dataset.target).toBeDefined()

      await key(item, 'Enter')

      expect(board.value.done).toEqual(['a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'done', fromIndex: 0, toIndex: 0 }])
    })

    it('should mirror horizontal arrows in RTL', async () => {
      const { board, el } = mountBoard({ dir: 'rtl' })
      const item = el('[data-item="d"]')

      item.focus()
      await key(item, ' ')
      await key(item, 'ArrowRight')
      await key(item, 'Enter')

      expect(board.value.todo).toEqual(['d', 'a', 'b', 'c'])
    })
  })
})
