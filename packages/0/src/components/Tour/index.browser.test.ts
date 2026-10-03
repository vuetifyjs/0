import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createBreakpointsPlugin } from '#v0/composables/useBreakpoints'
import { createStackPlugin } from '#v0/composables/useStack'
import { createTourContext } from '#v0/composables/useTour'

import { Tour } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

// Types
import type { TourContext, TourPlacement, TourTicketInput } from '#v0/composables/useTour'
import type { ID } from '#v0/types'
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
  describe('activator', () => {
    it('should scroll again when the tour restarts on the same step', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const target = document.querySelector('[data-part="activator"]') as HTMLElement
      const scroll = vi.spyOn(target, 'scrollIntoView')

      tour.stop()
      await nextTick()
      tour.start()
      await nextTick()
      await nextTick()

      expect(scroll).toHaveBeenCalled()
      scroll.mockRestore()
    })

    it('should scroll when stop and start happen in the same turn', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const target = document.querySelector('[data-part="activator"]') as HTMLElement
      const scroll = vi.spyOn(target, 'scrollIntoView')

      tour.stop()
      tour.start()
      await nextTick()
      await nextTick()

      expect(scroll).toHaveBeenCalled()
      scroll.mockRestore()
    })

    it('should scroll a shared activator when the step changes', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Activator, { step: ['one', 'two'] }, () => 'Both')
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      tour.start()
      await nextTick()
      await nextTick()

      const target = document.querySelector('[data-part="activator"]') as HTMLElement
      const scroll = vi.spyOn(target, 'scrollIntoView')

      await tour.next()
      await nextTick()
      await nextTick()

      expect(scroll).toHaveBeenCalled()
      scroll.mockRestore()
    })
  })

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

    it('should omit aria-labelledby and aria-describedby when title and description are absent', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }])

          return () => h(Tour.Root, { step: 'one' }, () => h(Tour.Content, {}, () => 'Body'))
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      await startAndWait(tour)

      const content = document.querySelector('[data-part="content"][role="dialog"]')
      expect(content).not.toBeNull()
      expect(content!.hasAttribute('aria-labelledby')).toBe(false)
      expect(content!.hasAttribute('aria-describedby')).toBe(false)
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
      expect(next.getAttribute('aria-disabled')).toBe('false')
      expect(prev.hasAttribute('disabled')).toBe(true)
      expect(prev.getAttribute('aria-disabled')).toBe('true')
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

    it('should keep an already inert element inert after a blocking tour stops', async () => {
      const locked = document.createElement('button')
      locked.inert = true
      document.body.append(locked)

      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h('div', [
            h(Tour.Highlight, { blocking: true }),
            h(Tour.Root, { step: 'one' }, () => h(Tour.Activator, { step: 'one' }, () => 'Target')),
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

      expect(locked.inert).toBe(true)
      expect(locked.dataset.tourInert).toBe('')

      tour.stop()

      expect(locked.inert).toBe(true)
      expect(locked.dataset.tourInert).toBeUndefined()
      locked.remove()
    })

    it('should leave the step status region operable under a blocking tour', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h('div', [
            h(Tour.Highlight, { blocking: true }),
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
      await tour.next()
      await nextTick()

      const status = document.querySelector('[data-part="status"]')
      expect(status).not.toBeNull()
      expect((status as HTMLElement).inert).toBe(false)
    })
  })

  describe('keyboard', () => {
    it('should stop on Escape', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      press('Escape')
      await nextTick()

      expect(tour.isActive.value).toBe(false)
    })

    it('should move with ArrowRight and ArrowLeft', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      press('ArrowRight')
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('two')
      })

      press('ArrowLeft')
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('one')
      })
    })

    it('should ignore a repeated arrow', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      press('ArrowRight', window, { repeat: true })
      await nextTick()

      expect(tour.selectedId.value).toBe('one')
    })

    it('should advance on Enter unless a control is focused', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      press('Enter')
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('two')
      })

      const next = [...document.querySelectorAll('button')].find(button => button.textContent === 'Done')
      expect(next).toBeDefined()
      next!.focus()
      press('Enter')
      await nextTick()

      expect(tour.selectedId.value).toBe('two')
      expect(tour.isActive.value).toBe(true)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should leave arrow keys with a composite widget', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const widget = document.createElement('div')
      widget.setAttribute('role', 'slider')
      const child = document.createElement('span')
      widget.append(child)
      document.body.append(widget)

      press('ArrowRight', child)
      await nextTick()

      expect(tour.selectedId.value).toBe('one')
      widget.remove()
    })

    it('should leave Escape inside an open dialog', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      const dialog = document.createElement('dialog')
      dialog.open = true
      const button = document.createElement('button')
      button.textContent = 'Inside'
      dialog.append(button)
      document.body.append(dialog)

      press('Escape', button)
      await nextTick()

      expect(tour.isActive.value).toBe(true)
      dialog.remove()

      const closed = document.createElement('dialog')
      const inside = document.createElement('button')
      closed.append(inside)
      document.body.append(closed)

      press('Escape', inside)
      await nextTick()

      expect(tour.isActive.value).toBe(false)
      closed.remove()
    })
  })

  describe('placement', () => {
    it('should place content on the bottom by default', async () => {
      const { tour } = mountPlaced([{ id: 'one' }, { id: 'two' }])
      await startAndWait(tour)

      expect(placed(content())).toBe('bottom')
    })

    it('should let the ticket placement override the content prop', async () => {
      const { tour } = mountPlaced(
        [{ id: 'one', placement: 'left' }, { id: 'two' }],
        { placement: 'bottom' },
      )
      await startAndWait(tour)

      expect(placed(content())).toBe('left')
    })

    it('should center the last step', async () => {
      const { tour } = mountPlaced([
        { id: 'one' },
        { id: 'two', placement: 'bottom' },
      ])
      await startAndWait(tour)
      await tour.next()
      await vi.waitFor(() => {
        expect(placed(content())).toBe('center')
      })
    })

    it('should center a step with no activator', async () => {
      const { tour } = mountPlaced([
        { id: 'one', noActivator: true, placement: 'left' },
        { id: 'two', placement: 'left' },
      ])
      await startAndWait(tour)

      expect(tour.selectedId.value).toBe('one')
      expect(placed(content())).toBe('center')
    })

    it('should center the last step ahead of placementMobile', async () => {
      const { tour } = mountPlaced(
        [{ id: 'one' }, { id: 'two' }],
        { placementMobile: 'top' },
        false,
      )
      await startAndWait(tour)
      await tour.next()
      await vi.waitFor(() => {
        expect(placed(content())).toBe('center')
      })
    })

    it('should use placementMobile when the breakpoint says mobile', async () => {
      // No breakpoints plugin: the fallback reports smAndDown, so the
      // mobile override is observable without resizing the browser.
      const { tour } = mountPlaced(
        [{ id: 'one', placement: 'left' }, { id: 'two' }],
        { placement: 'bottom', placementMobile: 'top' },
        false,
      )
      await startAndWait(tour)

      expect(placed(content())).toBe('top')
    })
  })
})

function press (key: string, target: EventTarget = window, init: KeyboardEventInit = {}) {
  target.dispatchEvent(new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...init,
  }))
}

function content (): HTMLElement {
  const el = document.querySelector('[data-part="content"]')
  expect(el).not.toBeNull()
  return el as HTMLElement
}

function placed (el: HTMLElement): TourPlacement | '' {
  const centered = el.style.position === 'fixed'
    && (el.style.inset === '0' || el.style.inset === '0px')
    && el.style.margin === 'auto'
  if (centered) return 'center'

  const area = el.style.getPropertyValue('position-area')
  if (area === 'top' || area === 'bottom' || area === 'left' || area === 'right') return area

  if (el.style.top.startsWith('anchor(bottom)')) return 'bottom'
  if (el.style.bottom.startsWith('anchor(top)')) return 'top'
  if (el.style.left === 'var(--tour-offset)') return 'left'
  if (el.style.right === 'var(--tour-offset)') return 'right'
  if (el.style.bottom === 'var(--tour-offset)') return 'bottom'
  if (el.style.top === 'var(--tour-offset)') return 'top'

  return ''
}

function mountPlaced (
  steps: Array<TourTicketInput & { id: ID }>,
  contentProps: { placement?: TourPlacement, placementMobile?: TourPlacement } = {},
  breakpoints = true,
): Harness {
  let tour!: TourContext

  const Host = defineComponent({
    setup () {
      const [, provideTour, context] = createTourContext()
      provideTour()
      tour = context
      tour.steps.onboard(steps)

      return () => h('div', steps.map(step => h(Tour.Root, { step: step.id }, {
        default: () => [
          step.noActivator
            ? null
            : h(Tour.Activator, { step: step.id }, () => step.id),
          h(Tour.Content, contentProps, () => step.id),
        ],
      })))
    },
  })

  const plugins = breakpoints
    ? [stackPlugin, createBreakpointsPlugin()]
    : [stackPlugin]

  const wrapper = mount(Host, {
    attachTo: document.body,
    global: { plugins },
  })
  wrappers.push(wrapper)

  return {
    wrapper,
    tour,
    slot: () => undefined,
  }
}
