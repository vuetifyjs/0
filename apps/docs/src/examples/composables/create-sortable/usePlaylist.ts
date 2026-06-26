import { createSortable, useProxyRegistry } from '@vuetify/v0'
import { shallowRef } from 'vue'

import type { SortableTicket, SortableTicketInput } from '@vuetify/v0'

export interface Track {
  title: string
  artist: string
}

export interface TrackTicket extends SortableTicketInput {
  value: Track
}

export type PlaylistTicket = SortableTicket<TrackTicket>

export function usePlaylist () {
  const sortable = createSortable<TrackTicket>()

  sortable.onboard([
    { value: { title: 'Midnight City', artist: 'M83' } },
    { value: { title: 'Nightcall', artist: 'Kavinsky' } },
    { value: { title: 'Resonance', artist: 'Home' } },
    { value: { title: 'Strobe', artist: 'deadmau5' } },
    { value: { title: 'Faded', artist: 'Alan Walker' } },
  ])

  const proxy = useProxyRegistry(sortable)
  const status = shallowRef('Reorder the queue with the arrows or your keyboard.')

  sortable.on('move:ticket', ({ ticket, from, to }) => {
    status.value = `Moved ${ticket.value.title} from #${from + 1} to #${to + 1}.`
  })

  function moveUp (ticket: PlaylistTicket) {
    if (ticket.index <= 0) return
    sortable.move(ticket.id, ticket.index - 1)
  }

  function moveDown (ticket: PlaylistTicket) {
    if (ticket.index >= proxy.size - 1) return
    sortable.move(ticket.id, ticket.index + 1)
  }

  return { proxy, status, moveUp, moveDown }
}
