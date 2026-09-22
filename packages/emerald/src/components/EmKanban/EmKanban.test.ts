import { afterEach, describe, expect, it, vi } from 'vitest'

// Context
import EmKanban from './EmKanban.vue'
import EmKanbanColumn from './EmKanbanColumn.vue'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { EmKanbanContext, EmKanbanDrag } from './context'
import type { ActiveDrag } from '@vuetify/v0'
import type { App } from 'vue'

const apps: App[] = []

interface Board {
  kanban: EmKanbanContext['kanban']
  dnd: EmKanbanContext['dnd']
  announce: EmKanbanContext['announce']
}

function mountBoard () {
  const onMove = vi.fn()
  const board = shallowRef<Board>()
  const host = document.createElement('div')

  document.body.append(host)

  const app = createApp({
    setup () {
      return () => h(EmKanban, { ref: board, onMove }, () => [
        h(EmKanbanColumn, {
          id: 'todo',
          title: 'Todo',
          cards: [{ id: 'c1', value: 'Alpha' }],
        }),
        h(EmKanbanColumn, { id: 'done', title: 'Done' }),
      ])
    },
  })

  apps.push(app)
  app.mount(host)

  return { host, onMove, board: () => board.value! }
}

function status (host: HTMLElement) {
  return host.querySelector('[role="status"]')?.textContent
}

function drop (board: Board, column: string, card: string, index: number) {
  const zone = board.dnd.zones.get(column)
  const drag: ActiveDrag<EmKanbanDrag> = {
    id: card,
    type: 'card',
    value: undefined,
    origin: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    delta: { x: 0, y: 0 },
    over: column,
    willAccept: true,
    via: 'keyboard',
  }

  expect(zone?.onDrop).toBeTypeOf('function')
  zone!.onDrop!(drag, { index, pointer: { x: 0, y: 0 } })
}

afterEach(() => {
  for (const app of apps.splice(0)) app.unmount()

  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('emKanban', () => {
  describe('rejected drop announcement', () => {
    it('should announce a rejected drop instead of leaving the pickup message', async () => {
      const { host, board, onMove } = mountBoard()

      await nextTick()

      board().kanban.columns.upsert('done', { accept: () => false })
      board().announce('Picked up card 1 in Todo.')

      await nextTick()

      expect(status(host)).toBe('Picked up card 1 in Todo.')

      drop(board(), 'done', 'c1', 0)

      await nextTick()

      expect(status(host)).toBe('Move not allowed, the card stayed where it was.')
      expect(board().kanban.columns.get('todo')!.items.get('c1')).toBeDefined()
      expect(board().kanban.columns.get('done')!.items.size).toBe(0)
      expect(onMove).not.toHaveBeenCalled()
    })

    it('should not treat a same-column stay as a rejected move', async () => {
      const { host, board } = mountBoard()

      await nextTick()

      drop(board(), 'todo', 'c1', 0)

      await nextTick()

      expect(status(host)).toBe('Moved card to Todo, position 1 of 1.')
      expect(board().kanban.columns.get('todo')!.items.get('c1')).toBeDefined()
    })
  })
})
