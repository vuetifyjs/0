/**
 * @module TourCard
 *
 * @internal
 * Measure of the open Tour.Content, shared with Tour.Activator.
 * The activator usually sits outside Tour.Root, so the two do not share that
 * context. The tour context object is the key. Not a public tour field.
 */

// Utilities
import { shallowRef } from 'vue'

// Types
import type { TourPlacement } from '#v0/composables/useTour'
import type { ID } from '#v0/types'
import type { ShallowRef } from 'vue'

export interface TourCardBox {
  /** Step whose content published this box */
  step: ID
  /** Side the card is actually on */
  placement: TourPlacement
  width: number
  height: number
  /** Gap the card keeps from the target, in px */
  offset: number
}

const cards = /* @__PURE__ */ new WeakMap<object, ShallowRef<TourCardBox | null>>()

export function useTourCard (tour: object): ShallowRef<TourCardBox | null> {
  const existing = cards.get(tour)
  if (existing) return existing

  const card = shallowRef<TourCardBox | null>(null)
  cards.set(tour, card)
  return card
}
