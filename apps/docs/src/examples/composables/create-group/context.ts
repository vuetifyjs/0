import { createGroup } from '@vuetify/v0'
import type { GroupTicket, GroupTicketInput } from '@vuetify/v0'

export interface TagInput extends GroupTicketInput<string> {
  color: string
}

export type TagTicket = GroupTicket<TagInput> & TagInput

export function createTagFilter () {
  return createGroup<TagInput, TagTicket>()
}

export const tags: TagInput[] = [
  { id: 'vue', value: 'Vue', color: '#10b981' },
  { id: 'react', value: 'React', color: '#0ea5e9' },
  { id: 'svelte', value: 'Svelte', color: '#f97316' },
  { id: 'angular', value: 'Angular', color: '#ef4444' },
  { id: 'solid', value: 'Solid', color: '#3b82f6' },
  { id: 'qwik', value: 'Qwik', color: '#8b5cf6' },
]
