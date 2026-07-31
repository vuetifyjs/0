import { createSelection } from '@vuetify/v0'
import { ref, toRef, toValue } from 'vue'

import type { SelectionTicket, SelectionTicketInput } from '@vuetify/v0'

export interface Track {
  id: string
  title: string
  artist: string
  duration: string
  unavailable?: boolean
}

export type TrackInput = SelectionTicketInput<Track>
export type TrackTicket = SelectionTicket<TrackInput>

const tracks: Track[] = [
  { id: 'midnight', title: 'Midnight City', artist: 'M83', duration: '4:03' },
  { id: 'instant', title: 'Instant Crush', artist: 'Daft Punk', duration: '5:37' },
  { id: 'redbone', title: 'Redbone', artist: 'Childish Gambino', duration: '5:27' },
  { id: 'dreams', title: 'Dreams', artist: 'Fleetwood Mac', duration: '4:14', unavailable: true },
  { id: 'flashing', title: 'Flashing Lights', artist: 'Kanye West', duration: '3:58' },
  { id: 'electric', title: 'Electric Feel', artist: 'MGMT', duration: '3:49' },
  { id: 'borderline', title: 'Borderline', artist: 'Tame Impala', duration: '3:57' },
]

export function useTracklist () {
  const selection = createSelection<TrackInput, TrackTicket>({ multiple: true })

  const tickets = selection.onboard(tracks.map(track => ({
    id: track.id,
    value: track,
    disabled: track.unavailable,
  })))

  const selectable = tickets.filter(ticket => !toValue(ticket.disabled))

  const count = toRef(() => selection.selectedIds.size)
  const allSelected = toRef(() => selectable.length > 0 && selectable.every(ticket => ticket.isSelected.value))

  const queue = ref<string[]>([])

  function toggleAll () {
    if (allSelected.value) selection.reset()
    else for (const ticket of selectable) ticket.select()
  }

  function enqueue () {
    for (const track of selection.selectedValues.value) {
      if (track && !queue.value.includes(track.title)) queue.value.push(track.title)
    }
    selection.reset()
  }

  function clearQueue () {
    queue.value = []
  }

  return { selection, tickets, count, allSelected, queue, toggleAll, enqueue, clearQueue }
}

export type Tracklist = ReturnType<typeof useTracklist>
