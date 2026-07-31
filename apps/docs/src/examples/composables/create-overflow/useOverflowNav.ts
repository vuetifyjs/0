import { createOverflow } from '@vuetify/v0'
import { shallowRef, toRef } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

export interface NavEntry {
  id: string
  label: string
}

const items: NavEntry[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'logs', label: 'Logs' },
  { id: 'team', label: 'Team' },
  { id: 'settings', label: 'Settings' },
]

export function useOverflowNav (container: MaybeRefOrGetter<Element | null | undefined>) {
  const overflow = createOverflow({ container, gap: 8, reserved: 80 })

  const active = shallowRef('overview')
  const hidden = toRef(() => items.slice(overflow.capacity.value))

  function select (id: string) {
    active.value = id
  }

  function measure (index: number, el: Element | null) {
    overflow.measure(index, el ?? undefined)
  }

  return { items, overflow, active, hidden, select, measure }
}

export type OverflowNav = ReturnType<typeof useOverflowNav>
