import { useProxyRegistry } from '@vuetify/v0'

import type { KanbanContext, ID } from '@vuetify/v0'
import type { Card, Column } from './types'

// Reactive view over a kanban. Returns the column registry as a proxy plus a
// Map of per-column item proxies that stays in sync as columns are registered
// or unregistered. useProxyRegistry must be called in a setup-time scope, so a
// v-for can't call it directly — this helper handles the two-level pattern
// every kanban consumer needs.
export function useKanbanView (kanban: KanbanContext<Card, Column>) {
  const columns = useProxyRegistry(kanban.columns)
  const items = new Map<ID, ReturnType<typeof useProxyRegistry<Card>>>()

  for (const column of kanban.columns.values()) {
    items.set(column.id, useProxyRegistry(column.items))
  }

  kanban.columns.on('register:ticket', column => {
    items.set(column.id, useProxyRegistry(column.items))
  })

  kanban.columns.on('unregister:ticket', column => {
    items.delete(column.id)
  })

  return { columns, items }
}
