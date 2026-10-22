import { describe, expect, it } from 'vitest'

import { SKILL_CATEGORY_META } from '@/types/skill'

import { defineTour as defineReading } from './essentials/reading-the-api/index'
import reading from './essentials/reading-the-api/index.json'
import { defineTour as defineStyling } from './fundamentals/style-the-control/index'
import styling from './fundamentals/style-the-control/index.json'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { StepHandlerContext } from '@/composables/useDiscovery'

describe('skillz tours', () => {
  it('should cover every Reading the API step', () => {
    expect(reading.id).toBe('reading-the-api')
    expect(reading.mode).toBe('guided')
    expect(reading.track).toBe('essentials')
    expect(reading.level).toBe(1)
    expect(reading.order).toBe(4)
    expect(reading.startRoute).toBe('/components/disclosure/tabs')
    expect(reading.prerequisites).toEqual([])
    expect(reading.categories.every(category => category in SKILL_CATEGORY_META)).toBe(true)

    const ids = reading.steps.map(step => step.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.at(-1)).toBe('conclusion')

    const tour = defineReading({
      settings: { showInlineApi: shallowRef(false) },
    })
    const handlers = tour.handlers as Record<string, { enter?: unknown } | undefined>
    for (const step of reading.steps) {
      if (step.noActivator) {
        expect(handlers[step.id]).toBeUndefined()
        continue
      }
      expect(handlers[step.id]?.enter).toBeTypeOf('function')
    }
  })

  it('should restore showInlineApi on exit', async () => {
    const ctx = { activate () {} } as StepHandlerContext

    const closed = shallowRef(false)
    const closedTour = defineReading({ settings: { showInlineApi: closed } })
    await closedTour.handlers.inline.enter(ctx)
    expect(closed.value).toBe(true)
    closedTour.exit()
    expect(closed.value).toBe(false)

    const open = shallowRef(true)
    const openTour = defineReading({ settings: { showInlineApi: open } })
    await openTour.handlers.reference.enter(ctx)
    expect(open.value).toBe(false)
    openTour.exit()
    expect(open.value).toBe(true)
  })

  it('should cover every Style the control step', () => {
    expect(styling.id).toBe('style-the-control')
    expect(styling.mode).toBe('guided')
    expect(styling.track).toBe('fundamentals')
    expect(styling.level).toBe(2)
    expect(styling.order).toBe(0)
    expect(styling.startRoute).toBe('/components/forms/switch')
    expect(styling.prerequisites).toEqual(['reading-the-api'])
    expect(styling.categories).toEqual(['styling'])
    expect(styling.categories.every(category => category in SKILL_CATEGORY_META)).toBe(true)

    const ids = styling.steps.map(step => step.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.at(-1)).toBe('conclusion')

    const tour = defineStyling()
    const handlers = tour.handlers as Record<string, { enter?: unknown } | undefined>
    for (const step of styling.steps) {
      if (step.noActivator) {
        expect(handlers[step.id]).toBeUndefined()
        continue
      }
      expect(handlers[step.id]?.enter).toBeTypeOf('function')
    }
  })
})
