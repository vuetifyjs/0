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
  root?: Record<string, unknown>
  columns?: Record<string, Record<string, unknown>>
  items?: Record<string, Record<string, unknown>>
  instructions?: boolean
} = {}) {
  const board = ref<Board>(options.board ?? { todo: ['a', 'b', 'c'], doing: ['d'], done: [] })
  const moves: KanbanMovePayload[] = []

  const Harness = defineComponent({
    setup () {
      return () => h(Kanban.Root as Component, {
        label: 'Sprint',
        onMove: (payload: KanbanMovePayload) => moves.push(payload),
        ...options.root,
      }, () => [
        ...Object.keys(board.value).map(key => h(Kanban.Column as unknown as Component, {
          key,
          'id': key,
          'label': key,
          'data-column': key,
          'modelValue': board.value[key],
          'onUpdate:modelValue': (value: string[]) => {
            board.value[key] = value
          },
          ...options.columns?.[key],
        }, {
          default: ({ items }: { items: string[] }) => h(Kanban.List as Component, { 'data-list': key }, () =>
            items.map(item => h(Kanban.Item as unknown as Component, {
              'key': item,
              'value': item,
              'label': `Card ${item}`,
              'data-item': item,
              ...options.items?.[item],
            }, () => item)),
          ),
        })),
        options.instructions === false ? null : h(Kanban.Instructions as Component, { 'data-instructions': '' }),
        h(Kanban.LiveRegion as Component, { 'data-live': '' }),
      ])
    },
  })

  const wrapper = mount(Harness, { attachTo: document.body })
  wrappers.push(wrapper)

  function item (value: string) {
    return wrapper.find(`[data-item="${value}"]`)
  }

  async function press (value: string, key: string, init: KeyboardEventInit = {}) {
    await item(value).trigger('keydown', { key, ...init })
    await flush()
  }

  async function flush () {
    await nextTick()
    await nextTick()
    await nextTick()
  }

  return {
    wrapper,
    board,
    moves,
    item,
    press,
    flush,
    live: () => wrapper.find('[data-live]').text(),
  }
}

describe('kanban', () => {
  describe('rendering', () => {
    it('should render the board as a labelled group', () => {
      const { wrapper } = mountBoard()
      const root = wrapper.find('[role="group"][aria-label="Sprint"]')

      expect(root.exists()).toBe(true)
      expect(root.attributes('data-orientation')).toBe('horizontal')
      expect(root.attributes('aria-disabled')).toBe('false')
    })

    it('should fall back to a locale board label', () => {
      const { wrapper } = mountBoard({ root: { label: undefined } })
      const root = wrapper.findAll('[role="group"]')[0]

      expect(root.attributes('aria-label')).toBeDefined()
    })

    it('should render each column as a labelled group with a list', () => {
      const { wrapper } = mountBoard()
      const column = wrapper.find('[data-column="todo"]')

      expect(column.attributes('role')).toBe('group')
      expect(column.attributes('aria-label')).toBe('todo')
      expect(wrapper.find('[data-list="todo"]').attributes('role')).toBe('list')
      expect(wrapper.find('[data-list="todo"]').attributes('data-orientation')).toBe('vertical')
    })

    it('should render items as positioned list items', () => {
      const { item } = mountBoard()

      expect(item('b').attributes('role')).toBe('listitem')
      expect(item('b').attributes('tabindex')).toBe('0')
      expect(item('b').attributes('aria-posinset')).toBe('2')
      expect(item('b').attributes('aria-setsize')).toBe('3')
      expect(item('b').attributes('aria-roledescription')).toBeDefined()
      expect(item('b').attributes('data-state')).toBe('idle')
    })

    it('should describe items with the instructions element', async () => {
      const { wrapper, item, flush } = mountBoard()
      await flush()

      const id = wrapper.find('[data-instructions]').attributes('id')

      expect(id).toBeDefined()
      expect(wrapper.find('[data-instructions]').text()).not.toBe('')
      expect(item('a').attributes('aria-describedby')).toBe(id)
    })

    it('should omit aria-describedby without instructions', () => {
      const { item } = mountBoard({ instructions: false })

      expect(item('a').attributes('aria-describedby')).toBeUndefined()
    })

    it('should render a polite live region', () => {
      const { wrapper } = mountBoard()
      const live = wrapper.find('[data-live]')

      expect(live.attributes('role')).toBe('status')
      expect(live.attributes('aria-live')).toBe('polite')
    })
  })

  describe('keyboard moves', () => {
    it('should pick up an item with Space', async () => {
      const { item, press, live } = mountBoard()

      await press('a', ' ')

      expect(item('a').attributes('data-state')).toBe('grabbed')
      expect(live()).toContain('Card a')
    })

    it('should pick up an item with Enter', async () => {
      const { item, press } = mountBoard()

      await press('a', 'Enter')

      expect(item('a').attributes('data-state')).toBe('grabbed')
    })

    it('should ignore arrows while not picked up', async () => {
      const { board, press, moves } = mountBoard()

      await press('a', 'ArrowDown')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })

    it('should move within a column with ArrowDown and ArrowUp', async () => {
      const { board, press, moves } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')

      expect(board.value.todo).toEqual(['b', 'a', 'c'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'todo', fromIndex: 0, toIndex: 1 }])

      await press('a', 'ArrowUp')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(2)
    })

    it('should not move past the ends of a column', async () => {
      const { board, press, moves } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowUp')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })

    it('should jump to the ends with Home and End', async () => {
      const { board, press } = mountBoard()

      await press('a', ' ')
      await press('a', 'End')

      expect(board.value.todo).toEqual(['b', 'c', 'a'])

      await press('a', 'Home')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
    })

    it('should transfer across columns with ArrowRight and ArrowLeft', async () => {
      const { board, press, moves, item, live } = mountBoard()

      await press('b', ' ')
      await press('b', 'ArrowRight')

      expect(board.value.todo).toEqual(['a', 'c'])
      expect(board.value.doing).toEqual(['d', 'b'])
      expect(moves.at(-1)).toEqual({ value: 'b', from: 'todo', to: 'doing', fromIndex: 1, toIndex: 1 })
      expect(item('b').attributes('data-state')).toBe('grabbed')
      expect(live()).toContain('doing')

      await press('b', 'ArrowLeft')

      expect(board.value.doing).toEqual(['d'])
      expect(board.value.todo).toEqual(['a', 'b', 'c'])
    })

    it('should not move past the first or last column', async () => {
      const { board, press, moves } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowLeft')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })

    it('should move focus with the item into its new column', async () => {
      const { press, item } = mountBoard()

      ;(item('b').element as HTMLElement).focus()
      await press('b', ' ')
      await press('b', 'ArrowRight')

      expect(document.activeElement).toBe(item('b').element)
    })

    it('should drop with Space and announce the landing', async () => {
      const { item, press, live } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', ' ')

      expect(item('a').attributes('data-state')).toBe('idle')
      expect(live()).toContain('position 2 of 3')
    })

    it('should return the item to its origin with Escape', async () => {
      const { board, press, moves, item } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', 'ArrowRight')
      await press('a', 'Escape')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(board.value.doing).toEqual(['d'])
      expect(item('a').attributes('data-state')).toBe('idle')
      expect(moves.at(-1)).toMatchObject({ value: 'a', to: 'todo', toIndex: 0 })
    })

    it('should cancel without moving when nothing changed', async () => {
      const { press, moves, live } = mountBoard()

      await press('a', ' ')
      await press('a', 'Escape')

      expect(moves).toHaveLength(0)
      expect(live()).toContain('todo')
    })

    it('should drop in place when focus leaves', async () => {
      const { item, press } = mountBoard()

      await press('a', ' ')
      await item('a').trigger('blur')

      expect(item('a').attributes('data-state')).toBe('idle')
    })

    it('should ignore modified keys and keys from descendants', async () => {
      const { item, press, wrapper } = mountBoard()

      await press('a', ' ', { ctrlKey: true })
      expect(item('a').attributes('data-state')).toBe('idle')

      const child = document.createElement('span')
      item('a').element.append(child)
      child.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(item('a').attributes('data-state')).toBe('idle')
      expect(wrapper.exists()).toBe(true)
    })

    it('should swap arrow roles for a vertical board', async () => {
      const { board, press } = mountBoard({ root: { orientation: 'vertical' } })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(board.value.todo).toEqual(['b', 'a', 'c'])

      await press('a', 'ArrowDown')

      expect(board.value.doing).toEqual(['d', 'a'])
    })
  })

  describe('gates', () => {
    it('should reject a move the destination does not accept', async () => {
      const { board, press, moves, live } = mountBoard({
        columns: { doing: { accept: () => false } },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(board.value.doing).toEqual(['d'])
      expect(moves).toHaveLength(0)
      expect(live()).toContain('cannot')
    })

    it('should pass value, source, and index to accept', async () => {
      const calls: unknown[][] = []
      const { press } = mountBoard({
        columns: {
          doing: {
            accept: (...args: unknown[]) => {
              calls.push(args)
              return true
            },
          },
        },
      })

      await press('c', ' ')
      await press('c', 'ArrowRight')

      expect(calls).toEqual([['c', 'todo', 1]])
    })

    it('should reject moves into a disabled column', async () => {
      const { wrapper, board, press } = mountBoard({
        columns: { doing: { disabled: true } },
      })

      expect(wrapper.find('[data-column="doing"]').attributes('data-disabled')).toBeDefined()

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(board.value.doing).toEqual(['d'])
    })

    it('should make items of a disabled column inert', async () => {
      const { item, press } = mountBoard({
        columns: { doing: { disabled: true } },
      })

      expect(item('d').attributes('tabindex')).toBe('-1')
      expect(item('d').attributes('aria-disabled')).toBe('true')

      await press('d', ' ')

      expect(item('d').attributes('data-state')).toBe('idle')
    })

    it('should make a disabled item inert', async () => {
      const { item, press } = mountBoard({
        items: { a: { disabled: true } },
      })

      expect(item('a').attributes('tabindex')).toBe('-1')
      expect(item('a').attributes('data-disabled')).toBeDefined()

      await press('a', ' ')

      expect(item('a').attributes('data-state')).toBe('idle')
    })

    it('should freeze the whole board when disabled', async () => {
      const { wrapper, item, press } = mountBoard({ root: { disabled: true } })

      expect(wrapper.find('[aria-label="Sprint"]').attributes('data-disabled')).toBeDefined()
      expect(item('a').attributes('tabindex')).toBe('-1')

      await press('a', ' ')

      expect(item('a').attributes('data-state')).toBe('idle')
    })
  })

  describe('v-model', () => {
    it('should register items pushed into the bound array', async () => {
      const { board, press, flush } = mountBoard()

      board.value.todo.push('e')
      await flush()

      await press('e', ' ')
      await press('e', 'ArrowUp')

      expect(board.value.todo).toEqual(['a', 'b', 'e', 'c'])
    })

    it('should drop items removed from the bound array', async () => {
      const { board, item, flush, press } = mountBoard()

      board.value.todo = ['c', 'a']
      await flush()

      expect(item('b').exists()).toBe(false)
      expect(item('c').attributes('aria-posinset')).toBe('1')

      await press('a', ' ')
      await press('a', 'ArrowUp')

      expect(board.value.todo).toEqual(['a', 'c'])
    })

    it('should follow a reorder of the bound array while disabled', async () => {
      const { board, item, flush } = mountBoard({ root: { disabled: true } })

      board.value.todo = ['c', 'b', 'a']
      await flush()

      expect(item('a').attributes('aria-posinset')).toBe('3')
    })

    it('should work without a bound model', async () => {
      const Harness = defineComponent({
        setup () {
          return () => h(Kanban.Root as Component, null, () => [
            h(Kanban.Column as unknown as Component, { label: 'Solo' }, {
              default: ({ items }: { items: string[] }) => h(Kanban.List as Component, null, () => items.map(item => h(Kanban.Item as unknown as Component, { key: item, value: item }))),
            }),
          ])
        },
      })

      const wrapper = mount(Harness, { attachTo: document.body })
      wrappers.push(wrapper)

      expect(wrapper.findAll('[role="listitem"]')).toHaveLength(0)
    })
  })

  describe('lifecycle', () => {
    it('should unregister a column on unmount', async () => {
      const { board, press, flush } = mountBoard()

      delete board.value.doing
      await flush()

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(board.value.done).toEqual(['a'])
    })
  })
})
