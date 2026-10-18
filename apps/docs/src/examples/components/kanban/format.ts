import type { KanbanMovePayload } from '@vuetify/v0'

export function formatMove ({ value, from, to, fromIndex, toIndex }: KanbanMovePayload): string {
  if (from === to) {
    return `"${value}" reordered in ${to}: ${fromIndex + 1} → ${toIndex + 1}`
  }

  return `"${value}" moved ${from} → ${to} at ${toIndex + 1}`
}
