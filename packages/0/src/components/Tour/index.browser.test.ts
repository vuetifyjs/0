import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createTourContext } from '#v0/composables/createTour'
import { createStackPlugin } from '#v0/composables/useStack'

// Components
import { Tour } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

// Types
import type { TourContext } from '#v0/composables/createTour'
import type { TourRootSlotProps } from './TourRoot.vue'
import type { VueWrapper } from '@vue/test-utils'

let stackPlugin: ReturnType<typeof createStackPlugin>
const wrappers: VueWrapper[] = []

beforeEach(() => {
  stackPlugin = createStackPlugin()
})

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

interface Harness {
  wrapper: VueWrapper
  tour: TourContext
  slot: () => TourRootSlotProps | undefined
}

function mountTour (): Harness {
  let tour!: TourContext
  let slot: TourRootSlotProps | undefined

  const Host = defineComponent({
    setup () {
      const [, provideTour, context] = createTourContext()
      provideTour()
      tour = context
      tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

      return () => h('div', [
        h(Tour.Keyboard),
        h(Tour.Highlight),
        h(Tour.Root, { step: 'one' }, {
          default: (props: TourRootSlotProps) => {
            slot = props
            return [
              h(Tour.Activator, { step: 'one' }, () => 'Target one'),
              h(Tour.Content, {}, () => [
                h(Tour.Title, {}, () => 'Title one'),
                h(Tour.Description, {}, () => 'Desc one'),
                h(Tour.Progress),
                h(Tour.Prev, {}, () => 'Back'),
                h(Tour.Next, {}, () => 'Next'),
                h(Tour.Skip, {}, () => 'Skip'),
              ]),
            ]
          },
        }),
        h(Tour.Root, { step: 'two' }, {
          default: () => [
            h(Tour.Activator, { step: 'two' }, () => 'Target two'),
            h(Tour.Content, {}, () => [
              h(Tour.Title, {}, () => 'Title two'),
              h(Tour.Description, {}, () => 'Desc two'),
              h(Tour.Next, {}, () => 'Done'),
            ]),
          ],
        }),
      ])
    },
  })

  const wrapper = mount(Host, {
    attachTo: document.body,
    global: {
      plugins: [stackPlugin],
    },
  })
  wrappers.push(wrapper)

  return {
    wrapper,
    tour,
    slot: () => slot,
  }
}

async function startAndWait (tour: TourContext, stepId?: string) {
  tour.start(stepId ? { stepId } : undefined)
  await nextTick()
  await vi.waitFor(() => {
    expect(document.querySelector('[data-part="content"][role="dialog"]')).not.toBeNull()
  })
}

describe('tour', () => {
  describe('root', () => {
    it('should expose isActive false before start and true after start for that step', async () => {
      const { tour, slot } = mountTour()
      await nextTick()

      expect(slot()?.isActive).toBe(false)

      tour.start()
      await nextTick()

      expect(slot()?.isActive).toBe(true)
      expect(tour.selectedId.value).toBe('one')
    })
  })

  describe('content', () => {
    it('should match Title and Description ids with Content aria-labelledby and aria-describedby', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const content = document.querySelector('[data-part="content"][role="dialog"]')
      const title = document.querySelector('[data-part="title"]')
      const description = document.querySelector('[data-part="description"]')

      expect(content).not.toBeNull()
      expect(title).not.toBeNull()
      expect(description).not.toBeNull()
      expect(content!.getAttribute('aria-modal')).toBeNull()
      expect(content!.getAttribute('aria-labelledby')).toBe(title!.id)
      expect(content!.getAttribute('aria-describedby')).toBe(description!.id)
      expect(title!.id).toBeDefined()
      expect(description!.id).toBeDefined()
    })
  })

  describe('next', () => {
    it('should advance selectedId', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      expect(tour.selectedId.value).toBe('one')

      const next = document.querySelector('[data-part="next"]') as HTMLElement
      const prev = document.querySelector('[data-part="prev"]') as HTMLElement
      expect(next).not.toBeNull()
      expect(next.hasAttribute('aria-disabled')).toBe(false)
      expect(prev.hasAttribute('disabled')).toBe(true)
      expect(prev.hasAttribute('aria-disabled')).toBe(false)
      next.click()
      await nextTick()

      expect(tour.selectedId.value).toBe('two')
    })

    it('should complete on the last step', async () => {
      const { tour } = mountTour()
      await startAndWait(tour, 'two')

      expect(tour.selectedId.value).toBe('two')
      expect(tour.isLast.value).toBe(true)

      const next = document.querySelector('[data-part="next"]') as HTMLElement
      expect(next).not.toBeNull()
      next.click()
      await nextTick()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(true)
    })
  })

  describe('skip', () => {
    it('should stop the tour without completing', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const skip = document.querySelector('[data-part="skip"]') as HTMLElement
      expect(skip).not.toBeNull()
      skip.click()
      await nextTick()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })
  })

  describe('highlight', () => {
    it('should render an svg when the tour is active', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const svg = document.querySelector('[data-part="highlight"] svg')
      expect(svg).not.toBeNull()
    })
  })

  describe('blocking', () => {
    it('should leave the control inside the activator operable', async () => {
      let tour!: TourContext
      let clicked = 0

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h('div', [
            h(Tour.Highlight, { blocking: true }),
            h(Tour.Root, { step: 'one' }, () => h(Tour.Activator, { step: 'one' }, () => h('button', {
              class: 'tour-target',
              onClick: () => {
                clicked += 1
              },
            }, 'Go'))),
          ])
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      tour.start()
      await nextTick()

      const button = document.querySelector('.tour-target') as HTMLButtonElement
      expect(button.inert).toBe(false)
      button.click()
      expect(clicked).toBe(1)
    })

    it('should swallow clicks on a last-step scrim', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h('div', [
            h(Tour.Highlight, { blocking: true }),
            h(Tour.Root, { step: 'two' }, () => h(Tour.Activator, { step: 'two' }, () => 'Last')),
          ])
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      tour.start({ stepId: 'two' })
      await nextTick()

      const shield = document.querySelector('[data-part="shield"]') as HTMLElement
      expect(shield).not.toBeNull()
      expect(getComputedStyle(shield).pointerEvents).toBe('auto')
    })

    it('should restore focus after a blocking tour stops', async () => {
      const opener = document.createElement('button')
      document.body.append(opener)
      opener.focus()

      let tour!: TourContext
      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h('div', [
            h(Tour.Highlight, { blocking: true }),
            h(Tour.Root, { step: 'one' }, () => [
              h(Tour.Activator, { step: 'one' }, () => 'Target'),
              h(Tour.Content, {}, () => 'Card'),
            ]),
          ])
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      tour.start()
      await nextTick()
      await vi.waitFor(() => {
        expect(document.querySelector('[data-part="content"]')).not.toBeNull()
      })

      tour.stop()

      expect(document.activeElement).toBe(opener)
      opener.remove()
    })
  })

  describe('keyboard', () => {
    it('should stop on Escape', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      window.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }))
      await nextTick()

      expect(tour.isActive.value).toBe(false)
    })
  })
})
