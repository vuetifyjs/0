/**
 * SSR-specific tests for useTour.
 *
 * IN_BROWSER is false for this file only. vi.mock is hoisted and would
 * change the client tests if these lived beside them.
 */
import { describe, expect, it, vi } from 'vitest'

// Types
import type { ShallowRef } from 'vue'

vi.mock('#v0/constants/globals', async () => ({
  ...await vi.importActual('#v0/constants/globals'),
  IN_BROWSER: false,
}))

import { createTour } from './index'

function write (flag: Readonly<ShallowRef<boolean>>, value: boolean) {
  (flag as ShallowRef<boolean>).value = value
}

describe('createTour SSR', () => {
  it('should ignore start when there is no document', () => {
    const tour = createTour()

    tour.steps.onboard([{ id: 'a' }])
    tour.start()

    expect(tour.isActive.value).toBe(false)
    expect(tour.steps.selectedId.value).toBeUndefined()
  })

  it('should ignore activate when there is no document', () => {
    const tour = createTour()
    const el = document.createElement('div')

    tour.steps.onboard([{ id: 'a' }])
    tour.steps.select('a')
    write(tour.isActive, true)
    tour.activate(el, { scroll: false })

    expect(tour.activators.size).toBe(0)
    expect(el.style.getPropertyValue('anchor-name')).toBe('')
  })
})
