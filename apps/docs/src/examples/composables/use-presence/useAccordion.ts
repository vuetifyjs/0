import { shallowRef } from 'vue'

import type { ShallowRef } from 'vue'

export interface Panel {
  id: string
  title: string
  body: string
}

export interface AccordionState {
  panels: Panel[]
  active: ShallowRef<string | null>
  toggle: (id: string) => void
}

export function useAccordion (): AccordionState {
  const panels: Panel[] = [
    {
      id: 'shipping',
      title: 'When will my order ship?',
      body: 'Orders placed before 2pm ship the same business day. Tracking is emailed once the carrier scans the parcel.',
    },
    {
      id: 'returns',
      title: 'What is the return policy?',
      body: 'Returns are accepted within 30 days of delivery. Items must be unused and in their original packaging.',
    },
    {
      id: 'support',
      title: 'How do I contact support?',
      body: 'Reach the team through live chat or email. Most tickets receive a first reply within a few hours.',
    },
  ]

  const active = shallowRef<string | null>(panels[0].id)

  function toggle (id: string) {
    active.value = active.value === id ? null : id
  }

  return { panels, active, toggle }
}
