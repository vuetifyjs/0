import { createTourContext, type TourTicketInput } from '@vuetify/v0'

const steps: TourTicketInput[] = [
  { id: 'search', placement: 'bottom' },
  { id: 'settings', placement: 'bottom' },
  { id: 'avatar', placement: 'left' },
]

export function useOnboarding () {
  const [, provideTour, tour] = createTourContext()

  provideTour()

  tour.steps.onboard(steps)

  return { tour }
}
