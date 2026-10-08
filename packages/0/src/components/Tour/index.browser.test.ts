import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createBreakpointsPlugin } from '#v0/composables/useBreakpoints'
import { createStackPlugin } from '#v0/composables/useStack'
import { createTourContext } from '#v0/composables/useTour'

import { Tour } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, shallowRef } from 'vue'

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

    it('should skip scrolling when the activator renders no element', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Root, { step: 'one' }, () => h(Tour.Activator, {
            renderless: true,
            step: 'one',
          }, () => 'Target'))
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

      expect(tour.isActive.value).toBe(true)
      expect(document.querySelector('[data-part="activator"]')).toBeNull()
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

    it('should move back when the slot calls prev', async () => {
      const { tour, slot } = mountTour()
      await startAndWait(tour)
      await tour.next()
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('two')
      })

      slot()?.prev()
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('one')
      })
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

          return () => h(Tour.Root, { step: 'one' }, () => [
            h(Tour.Activator, { step: 'one' }, () => 'Target'),
            h(Tour.Content, {}, () => 'Body'),
          ])
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

    it('should move focus into content that mounts onto an open step', async () => {
      let tour!: TourContext
      const show = shallowRef(false)

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }])

          return () => h(Tour.Root, { step: 'one' }, () => [
            h(Tour.Activator, { step: 'one' }, () => 'Target'),
            show.value ? h(Tour.Content, {}, () => 'Body') : null,
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
      await frame()

      show.value = true

      await vi.waitFor(() => {
        expect(document.activeElement).toBe(content())
      })
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

      await vi.waitFor(() => {
        expect(document.querySelector('[data-part="highlight"] svg')).not.toBeNull()
      })
    })

    it('should announce the step after the status timer', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)

      await vi.waitFor(() => {
        const status = document.querySelector('[data-part="status"]')
        expect(status?.textContent).toContain('1')
      })
    })

    it('should clear the cutout when the selection goes away', async () => {
      const { tour } = mountTour()
      await startAndWait(tour)
      await vi.waitFor(() => {
        expect(document.querySelector('[data-part="highlight"] svg')).not.toBeNull()
      })

      tour.steps.unselect('one')
      await nextTick()
      await frame()
      await frame()

      expect(tour.isActive.value).toBe(true)
      expect(tour.selectedId.value).toBeUndefined()
    })

    it('should clear the cutout when the activator is gone or has no element', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Highlight, { blocking: true })
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      const target = document.createElement('div')
      target.style.width = '40px'
      target.style.height = '40px'
      document.body.append(target)

      tour.start()
      tour.activate(target, { scroll: false })

      await vi.waitFor(() => {
        expect(document.querySelector('[data-part="highlight"] svg')).not.toBeNull()
      })

      tour.deactivate()
      await frame()
      await frame()

      expect(document.querySelector('[data-part="highlight"] svg')).toBeNull()

      tour.activate(target, { scroll: false })

      await vi.waitFor(() => {
        expect(document.querySelector('[data-part="highlight"] svg')).not.toBeNull()
      })

      tour.deactivate()
      tour.activators.register({ id: 'one', element: shallowRef<HTMLElement | null>(null) })
      await frame()
      await frame()

      expect(document.querySelector('[data-part="highlight"] svg')).toBeNull()
      expect(tour.isActive.value).toBe(true)
      expect(tour.selectedId.value).toBe('one')
      target.remove()
    })

    it('should draw a square cutout for a zero size target', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Highlight, { blocking: true, blockActivator: true })
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      const target = document.createElement('div')
      target.style.width = '0'
      target.style.height = '0'
      document.body.append(target)

      tour.start()
      tour.activate(target, { scroll: false })

      await vi.waitFor(() => {
        const block = [...document.querySelectorAll('[data-part="highlight"] div')].find(el => {
          return (el as HTMLElement).style.clipPath.includes('path(')
        }) as HTMLElement | undefined
        expect(block).toBeDefined()
        expect(block!.style.clipPath).not.toContain('Q')
      })

      target.remove()
    })

    it('should descend into an ancestor that contains the highlight', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Highlight, { blocking: true })
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      const wrap = document.createElement('div')
      const marker = document.createElement('div')
      marker.dataset.part = 'highlight'
      const sibling = document.createElement('button')
      sibling.textContent = 'Sibling'
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      wrap.append(marker, sibling)
      document.body.append(wrap, svg)

      tour.start()
      await nextTick()

      expect(sibling.inert).toBe(true)
      expect((svg as SVGSVGElement & { inert?: boolean }).inert).toBeUndefined()

      tour.stop()
      wrap.remove()
      svg.remove()
    })

    it('should shield the page on a step with no activator', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([
            { id: 'one', noActivator: true },
            { id: 'two' },
          ])

          return () => h(Tour.Highlight, { blocking: true })
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      tour.start()
      await nextTick()

      expect(document.querySelector('[data-part="shield"]')).not.toBeNull()
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

    it('should cut out the last step when it has an activator', async () => {
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

      await vi.waitFor(() => {
        expect(document.querySelector('[data-part="highlight"] svg mask')).not.toBeNull()
      })
      expect(document.querySelector('[data-part="shield"]')).toBeNull()
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
      press('ArrowLeft', window, { repeat: true })
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

    it('should complete the last step from the keyboard', async () => {
      const { tour } = mountTour()
      await startAndWait(tour, 'two')

      press('ArrowRight')
      await vi.waitFor(() => {
        expect(tour.isComplete.value).toBe(true)
      })
      expect(tour.isActive.value).toBe(false)
    })

    it('should ignore arrows until the step is ready', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([
            {
              id: 'one',
              enter (ctx) {
                void ctx.visit
              },
            },
            { id: 'two' },
          ])

          return () => h('div', [
            h(Tour.Keyboard),
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
      press('ArrowRight')
      press('Enter')
      await nextTick()

      expect(tour.selectedId.value).toBe('one')
      expect(tour.isReady.value).toBe(false)
      expect(tour.isActive.value).toBe(true)
    })
  })

  describe('polyfill host', () => {
    it('should activate prev, next, and skip from click and keys', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }, { id: 'three' }])

          return () => h('div', ['one', 'two'].map(step => h(Tour.Root, { step }, () => [
            h(Tour.Activator, { step }, () => step),
            h(Tour.Content, {}, () => [
              h(Tour.Prev, { as: 'div' }, () => 'Back'),
              h(Tour.Next, { as: 'div' }, () => 'Next'),
              h(Tour.Skip, { as: 'div' }, () => 'Skip'),
            ]),
          ])))
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      await startAndWait(tour)

      const prev = await part('prev')
      const next = await part('next')
      const skip = await part('skip')
      press('x', prev)
      press('x', next)
      press('x', skip)
      press('Enter', prev)
      expect(tour.selectedId.value).toBe('one')

      next.click()
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('two')
      })

      press(' ', await part('prev'))
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('one')
      })

      press(' ', await part('next'))
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('two')
      })

      press(' ', await part('prev'))
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('one')
      })

      press('Enter', await part('next'))
      await vi.waitFor(() => {
        expect(tour.selectedId.value).toBe('two')
      })

      const skipNow = await part('skip')
      press('Enter', skipNow)
      press(' ', skipNow)
      await nextTick()

      expect(tour.isActive.value).toBe(false)
      expect(tour.isComplete.value).toBe(false)
    })

    it('should ignore next when the control is disabled', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Root, { step: 'one' }, () => [
            h(Tour.Activator, { step: 'one' }, () => 'Target'),
            h(Tour.Content, {}, () => h(Tour.Next, { as: 'div', disabled: true }, () => 'Next')),
          ])
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin] },
      })
      wrappers.push(wrapper)

      await startAndWait(tour)

      const next = document.querySelector('[data-part="next"]') as HTMLElement
      expect(next.tabIndex).toBe(-1)
      press('Enter', next)
      next.click()
      await nextTick()

      expect(tour.selectedId.value).toBe('one')
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

    it('should keep the last step on its placement', async () => {
      const { tour } = mountPlaced([
        { id: 'one' },
        { id: 'two', placement: 'bottom' },
      ])
      await startAndWait(tour)
      await tour.next()
      await vi.waitFor(() => {
        expect(placed(content())).toBe('bottom')
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

    it('should fall back to edge offsets when anchor positioning is unavailable', async () => {
      const supports = vi.spyOn(CSS, 'supports').mockReturnValue(false)

      const { tour } = mountPlaced(
        [{ id: 'one', placement: 'left' }, { id: 'two' }],
        { placement: 'bottom' },
      )
      await startAndWait(tour)

      expect(placed(content())).toBe('left')
      supports.mockRestore()
    })

    it('should stay hidden until the activator registers', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one', placement: 'left' }, { id: 'two' }])

          return () => h(Tour.Root, { step: 'one' }, () => h(Tour.Content, { placement: 'left' }, () => 'Card'))
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin, createBreakpointsPlugin()] },
      })
      wrappers.push(wrapper)

      tour.start()
      await nextTick()
      await frame()

      expect(document.querySelector('[data-part="content"]')).toBeNull()

      const el = document.createElement('button')
      el.textContent = 'Later'
      document.body.append(el)
      tour.activate(el, { scroll: false })

      await vi.waitFor(() => {
        expect(placed(content())).toBe('left')
      })

      el.remove()
    })

    it('should not move focus into renderless content', async () => {
      let tour!: TourContext

      const Host = defineComponent({
        setup () {
          const [, provideTour, context] = createTourContext()
          provideTour()
          tour = context
          tour.steps.onboard([{ id: 'one' }, { id: 'two' }])

          return () => h(Tour.Root, { step: 'one' }, () => [
            h(Tour.Activator, { step: 'one' }, () => 'Target'),
            h(Tour.Content, { renderless: true }, () => 'Card'),
          ])
        },
      })

      const wrapper = mount(Host, {
        attachTo: document.body,
        global: { plugins: [stackPlugin, createBreakpointsPlugin()] },
      })
      wrappers.push(wrapper)

      const before = document.activeElement
      tour.start()
      await frame()
      await nextTick()

      expect(tour.isActive.value).toBe(true)
      expect(document.querySelector('[data-part="content"]')).toBeNull()
      expect(document.activeElement).toBe(before)
    })
  })
})

async function part (name: string) {
  let el: HTMLElement | null = null

  await vi.waitFor(() => {
    el = document.querySelector(`[data-part="${CSS.escape(name)}"]`) as HTMLElement | null
    expect(el).not.toBeNull()
  })

  return el!
}

function frame () {
  return new Promise<void>(resolve => {
    requestAnimationFrame(() => resolve())
  })
}

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
  contentProps: { placement?: TourPlacement } = {},
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

  const wrapper = mount(Host, {
    attachTo: document.body,
    global: { plugins: [stackPlugin, createBreakpointsPlugin()] },
  })
  wrappers.push(wrapper)

  return {
    wrapper,
    tour,
    slot: () => undefined,
  }
}
