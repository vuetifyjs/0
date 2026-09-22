import { createTour } from '@vuetify/v0'
import { toRef } from 'vue'

import type { TourEnterContext, TourTicketInput } from '@vuetify/v0'

interface Copy {
  title: string
  body: string
}

const copy: Record<string, Copy> = {
  welcome: {
    title: 'Welcome',
    body: 'Two controls in the bar — search and your avatar. Start here.',
  },
  search: {
    title: 'Search',
    body: 'Type here to find pages, docs, and people.',
  },
  avatar: {
    title: 'Account',
    body: 'Open your profile and settings from the avatar.',
  },
}

const steps: TourTicketInput[] = [
  {
    id: 'welcome',
    placement: 'bottom',
  },
  {
    id: 'search',
    placement: 'bottom',
    enter ({ done, activate }: TourEnterContext) {
      const el = document.querySelector('[data-tour="search"]')
      if (el) activate(el, { scroll: false })
      done()
    },
  },
  {
    id: 'avatar',
    placement: 'left',
    enter ({ done, activate }: TourEnterContext) {
      const el = document.querySelector('[data-tour="avatar"]')
      if (el) activate(el, { scroll: false })
      done()
    },
  },
]

export function useOnboarding () {
  const tour = createTour()

  tour.steps.onboard(steps)

  const current = toRef(() => {
    const id = tour.selectedId.value
    return id ? copy[id] : undefined
  })
  const index = toRef(() => (tour.steps.selectedIndex.value ?? 0) + 1)
  const placement = toRef(() => tour.steps.selectedItem.value?.placement)

  return { tour, current, index, placement }
}
