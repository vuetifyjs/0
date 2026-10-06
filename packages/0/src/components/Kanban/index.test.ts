import { afterEach, describe, expect, it, vi } from 'vitest'

import { Kanban, useKanbanRoot } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { KanbanMovePayload, KanbanRootContext } from './index'
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

  describe('keyboard pick-up', () => {
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
      const { wrapper, press, moves } = mountBoard()

      await press('a', 'ArrowDown')

      expect(wrapper.find('[data-drop]').exists()).toBe(false)
      expect(moves).toHaveLength(0)
    })

    it('should ignore modified keys and keys from descendants', async () => {
      const { item, press } = mountBoard()

      await press('a', ' ', { ctrlKey: true })
      expect(item('a').attributes('data-state')).toBe('idle')

      const child = document.createElement('span')
      item('a').element.append(child)
      child.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      await nextTick()

      expect(item('a').attributes('data-state')).toBe('idle')
    })
  })

  describe('keyboard target', () => {
    it('should preview without touching the board', async () => {
      const { board, press, moves, item, wrapper, live } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
      expect(item('c').attributes('data-drop')).toBe('before')
      expect(wrapper.find('[data-list="todo"]').attributes('data-target')).toBeDefined()
      expect(wrapper.find('[data-column="todo"]').attributes('data-target')).toBeDefined()
      expect(live()).toContain('position 2 of 3')
    })

    it('should mark the end of a column with data-drop after', async () => {
      const { press, item } = mountBoard()

      await press('a', ' ')
      await press('a', 'End')

      expect(item('c').attributes('data-drop')).toBe('after')
      expect(item('b').attributes('data-drop')).toBeUndefined()
    })

    it('should clear the preview when the target returns to the origin', async () => {
      const { press, wrapper } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', 'ArrowUp')

      expect(wrapper.find('[data-drop]').exists()).toBe(false)
      expect(wrapper.find('[data-target]').exists()).toBe(false)
    })

    it('should not move the target past the ends of a column', async () => {
      const { press, wrapper } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowUp')

      expect(wrapper.find('[data-drop]').exists()).toBe(false)
    })

    it('should not move the target past the first or last column', async () => {
      const { press, wrapper, live } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowLeft')

      expect(wrapper.find('[data-target]').exists()).toBe(false)
      expect(live()).not.toContain('cannot')
    })

    it('should target another column, keeping the index when it fits', async () => {
      const { press, item, wrapper } = mountBoard()

      await press('b', ' ')
      await press('b', 'ArrowRight')

      expect(wrapper.find('[data-list="doing"]').attributes('data-target')).toBeDefined()
      expect(item('d').attributes('data-drop')).toBe('after')
    })

    it('should swap arrow roles for a vertical board', async () => {
      const { board, press } = mountBoard({ root: { orientation: 'vertical' } })

      await press('a', ' ')
      await press('a', 'ArrowRight')
      await press('a', 'Enter')

      expect(board.value.todo).toEqual(['b', 'a', 'c'])

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', 'Enter')

      expect(board.value.doing).toEqual(['d', 'a'])
    })
  })

  describe('keyboard drop', () => {
    it('should commit one move per drop', async () => {
      const { board, press, moves, item, live } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', 'ArrowDown')
      await press('a', 'ArrowRight')
      await press('a', 'ArrowDown')
      await press('a', 'Enter')

      expect(board.value.todo).toEqual(['b', 'c'])
      expect(board.value.doing).toEqual(['d', 'a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'doing', fromIndex: 0, toIndex: 1 }])
      expect(item('a').attributes('data-state')).toBe('idle')
      expect(live()).toContain('position 2 of 2')
    })

    it('should reorder within a column on drop', async () => {
      const { board, press, moves } = mountBoard()

      await press('a', ' ')
      await press('a', 'End')
      await press('a', ' ')

      expect(board.value.todo).toEqual(['b', 'c', 'a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'todo', fromIndex: 0, toIndex: 2 }])
    })

    it('should not emit when dropped where it was picked up', async () => {
      const { press, moves, item } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', 'ArrowUp')
      await press('a', ' ')

      expect(moves).toHaveLength(0)
      expect(item('a').attributes('data-state')).toBe('idle')
    })

    it('should move focus with the item into its new column', async () => {
      const { press, item } = mountBoard()

      ;(item('b').element as HTMLElement).focus()
      await press('b', ' ')
      await press('b', 'ArrowRight')
      await press('b', 'Enter')

      expect(document.activeElement).toBe(item('b').element)
    })
  })

  describe('keyboard cancel', () => {
    it('should discard the target with Escape without touching the board', async () => {
      const { board, press, moves, item, wrapper, live } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await press('a', 'ArrowRight')
      await press('a', 'Escape')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(board.value.doing).toEqual(['d'])
      expect(moves).toHaveLength(0)
      expect(item('a').attributes('data-state')).toBe('idle')
      expect(wrapper.find('[data-target]').exists()).toBe(false)
      expect(live()).toContain('todo')
    })

    it('should cancel when focus leaves', async () => {
      const { board, item, press, moves } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')
      await item('a').trigger('blur')

      expect(item('a').attributes('data-state')).toBe('idle')
      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })

    it('should not consult the origin column accept on Escape', async () => {
      let calls = 0
      const { board, press, moves, live } = mountBoard({
        columns: {
          todo: {
            accept: () => {
              calls++
              return false
            },
          },
        },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')
      await press('a', 'Escape')

      expect(calls).toBe(0)
      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(board.value.doing).toEqual(['d'])
      expect(moves).toHaveLength(0)
      expect(live()).not.toContain('cannot')
    })

    it('should keep an external reorder made mid-pickup on Escape', async () => {
      const { board, press, flush, moves, item } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowDown')

      board.value.todo = ['c', 'b', 'a']
      await flush()

      await press('a', 'Escape')

      expect(board.value.todo).toEqual(['c', 'b', 'a'])
      expect(moves).toHaveLength(0)
      expect(item('a').attributes('aria-posinset')).toBe('3')
    })
  })

  describe('gates', () => {
    it('should skip a column that does not accept the item', async () => {
      const { board, press, moves, wrapper } = mountBoard({
        columns: { doing: { accept: () => false } },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(wrapper.find('[data-list="done"]').attributes('data-target')).toBeDefined()
      expect(wrapper.find('[data-list="doing"]').attributes('data-target')).toBeUndefined()

      await press('a', 'Enter')

      expect(board.value.doing).toEqual(['d'])
      expect(board.value.done).toEqual(['a'])
      expect(moves).toEqual([{ value: 'a', from: 'todo', to: 'done', fromIndex: 0, toIndex: 0 }])
    })

    it('should skip a disabled column', async () => {
      const { board, press } = mountBoard({
        columns: { doing: { disabled: true } },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')
      await press('a', 'Enter')

      expect(board.value.doing).toEqual(['d'])
      expect(board.value.done).toEqual(['a'])
    })

    it('should announce and stay when no column in that direction accepts', async () => {
      const { press, wrapper, live } = mountBoard({
        columns: { doing: { accept: () => false }, done: { disabled: true } },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(wrapper.find('[data-target]').exists()).toBe(false)
      expect(live()).toContain('cannot')
    })

    it('should pass value, source, and target index to accept', async () => {
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

      expect(calls[0]).toEqual(['c', 'todo', 1])
    })

    it('should make items of a disabled column inert', async () => {
      const { item, press, wrapper } = mountBoard({
        columns: { doing: { disabled: true } },
      })

      expect(wrapper.find('[data-column="doing"]').attributes('data-disabled')).toBeDefined()
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
      await press('e', 'Home')
      await press('e', 'Enter')

      expect(board.value.todo).toEqual(['e', 'a', 'b', 'c'])
    })

    it('should drop items removed from the bound array', async () => {
      const { board, item, flush } = mountBoard()

      board.value.todo = ['c', 'a']
      await flush()

      expect(item('b').exists()).toBe(false)
      expect(item('c').attributes('aria-posinset')).toBe('1')
    })

    it('should release the pick-up when the item leaves the board', async () => {
      const { board, press, flush, item, wrapper } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowRight')

      board.value.todo = ['b', 'c']
      await flush()

      expect(wrapper.find('[data-target]').exists()).toBe(false)

      board.value.todo = ['a', 'b', 'c']
      await flush()

      expect(item('a').attributes('data-state')).toBe('idle')
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

  describe('edge cases', () => {
    it('should name unlabelled items by value, and objects generically', async () => {
      const { press, live } = mountBoard({ items: { a: { label: undefined } } })

      await press('a', ' ')

      expect(live()).toContain('a picked up')

      const card = { id: 1 }
      const Harness = defineComponent({
        setup () {
          return () => h(Kanban.Root as Component, null, () => [
            h(Kanban.Column as unknown as Component, { label: 'Solo', modelValue: [card] }, {
              default: ({ items }: { items: object[] }) => h(Kanban.List as Component, null, () => items.map(item => h(Kanban.Item as unknown as Component, { 'key': 1, 'value': item, 'data-card': '' }))),
            }),
            h(Kanban.LiveRegion as Component, { 'data-solo': '' }),
          ])
        },
      })

      const wrapper = mount(Harness, { attachTo: document.body })
      wrappers.push(wrapper)

      await wrapper.find('[data-card]').trigger('keydown', { key: ' ' })
      await nextTick()
      await nextTick()

      expect(wrapper.find('[data-solo]').text()).toContain('Item picked up')
    })

    it('should ignore unrelated keys while picked up', async () => {
      const { press, item, wrapper } = mountBoard()

      await press('a', ' ')
      await press('a', 'x')

      expect(item('a').attributes('data-state')).toBe('grabbed')
      expect(wrapper.find('[data-drop]').exists()).toBe(false)
    })

    it('should sync a changed column value into the board', async () => {
      const value = ref({ title: 'Todo' })
      let context: KanbanRootContext | undefined
      const Probe = defineComponent({
        setup () {
          context = useKanbanRoot('v0:kanban')
          return () => null
        },
      })
      const Harness = defineComponent({
        setup () {
          return () => h(Kanban.Root as Component, null, () => [
            h(Kanban.Column as unknown as Component, { id: 'todo', label: 'Todo', value: value.value }, {
              default: () => h(Kanban.List as Component),
            }),
            h(Probe),
          ])
        },
      })

      const wrapper = mount(Harness, { attachTo: document.body })
      wrappers.push(wrapper)

      value.value = { title: 'Backlog' }
      await nextTick()
      await nextTick()

      expect(context?.kanban.columns.get('todo')?.value).toEqual({ title: 'Backlog' })
    })

    it('should treat a throwing accept as a refusal', async () => {
      using spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { press, wrapper } = mountBoard({
        columns: {
          doing: {
            accept: () => {
              throw new Error('boom')
            },
          },
        },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(wrapper.find('[data-list="done"]').attributes('data-target')).toBeDefined()
      expect(spy).toHaveBeenCalled()
    })

    it('should refuse an index the target column does not accept', async () => {
      const { press, item, live } = mountBoard({
        board: { todo: ['x', 'a'], doing: ['d', 'e'] },
        columns: { doing: { accept: (_: unknown, __: unknown, index: number) => index > 0 } },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      expect(item('e').attributes('data-drop')).toBe('before')

      await press('a', 'Home')

      expect(item('e').attributes('data-drop')).toBe('before')
      expect(live()).toContain('cannot')
    })

    it('should announce and keep the item when the drop is refused late', async () => {
      const open = ref(true)
      const { board, press, moves, live } = mountBoard({
        columns: { doing: { accept: () => open.value } },
      })

      await press('a', ' ')
      await press('a', 'ArrowRight')

      open.value = false
      await press('a', 'Enter')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
      expect(live()).toContain('cannot')
    })

    it('should keep the target through unrelated board changes', async () => {
      const { board, press, flush, item } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowRight')

      board.value.done = ['x']
      await flush()

      expect(item('d').attributes('data-drop')).toBe('before')
    })

    it('should clamp the target when its column shrinks', async () => {
      const { board, press, flush, item, wrapper } = mountBoard({
        board: { todo: ['a', 'b', 'c'], doing: ['d', 'e', 'f'] },
      })

      await press('c', ' ')
      await press('c', 'ArrowRight')

      expect(item('f').attributes('data-drop')).toBe('before')

      board.value.doing = ['d']
      await flush()

      expect(item('d').attributes('data-drop')).toBe('after')
      expect(wrapper.find('[data-list="doing"]').attributes('data-target')).toBeDefined()
    })
  })

  describe('lifecycle', () => {
    it('should unregister a column on unmount', async () => {
      const { board, press, flush } = mountBoard()

      delete board.value.doing
      await flush()

      await press('a', ' ')
      await press('a', 'ArrowRight')
      await press('a', 'Enter')

      expect(board.value.done).toEqual(['a'])
    })

    it('should retarget when the target column unmounts mid-pickup', async () => {
      const { board, press, flush, moves } = mountBoard()

      await press('a', ' ')
      await press('a', 'ArrowRight')

      delete board.value.doing
      await flush()

      await press('a', 'Enter')

      expect(board.value.todo).toEqual(['a', 'b', 'c'])
      expect(moves).toHaveLength(0)
    })
  })
})
