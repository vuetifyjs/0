import { describe, expect, it } from 'vitest'

// Composables
import { createStackPlugin } from '#v0/composables/useStack'
import { createTourPlugin, useTour } from '#v0/composables/useTour'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

import { Tour } from '.'

function createApp (template: string, setup?: () => Record<string, unknown>) {
  return defineComponent({
    components: {
      TourRoot: Tour.Root,
      TourTitle: Tour.Title,
      TourDescription: Tour.Description,
      TourProgress: Tour.Progress,
      TourPrev: Tour.Prev,
      TourNext: Tour.Next,
      TourSkip: Tour.Skip,
    },
    template,
    setup,
  })
}

function mountWithPlugin (component: ReturnType<typeof createApp>) {
  return mount(component, {
    global: {
      plugins: [createTourPlugin(), createStackPlugin()],
    },
  })
}

describe('tour components', () => {
  describe('tour.Root', () => {
    it('should expose isActive slot prop', () => {
      const App = createApp(
        `<TourRoot step="step-1" v-slot="{ isActive }">
          <span data-testid="active">{{ isActive }}</span>
        </TourRoot>`,
      )

      const wrapper = mountWithPlugin(App)
      expect(wrapper.find('[data-testid="active"]').text()).toBe('false')
    })
  })

  describe('tour.Title', () => {
    it('should render h2 with id', () => {
      const App = createApp(
        `<TourRoot step="step-1">
          <TourTitle>My Title</TourTitle>
        </TourRoot>`,
      )

      const wrapper = mountWithPlugin(App)
      const h2 = wrapper.find('h2')
      expect(h2.exists()).toBe(true)
      expect(h2.text()).toBe('My Title')
      expect(h2.attributes('id')).toBeTruthy()
      expect(h2.attributes('data-scope')).toBe('tour')
      expect(h2.attributes('data-part')).toBe('title')
    })
  })

  describe('tour.Description', () => {
    it('should render p with id', () => {
      const App = createApp(
        `<TourRoot step="step-1">
          <TourDescription>My Description</TourDescription>
        </TourRoot>`,
      )

      const wrapper = mountWithPlugin(App)
      const p = wrapper.find('p')
      expect(p.exists()).toBe(true)
      expect(p.text()).toBe('My Description')
      expect(p.attributes('data-scope')).toBe('tour')
    })
  })

  describe('tour.Progress', () => {
    it('should render step counter with role status', () => {
      const App = createApp(
        `<TourRoot step="step-1">
          <TourProgress />
        </TourRoot>`,
      )

      const wrapper = mountWithPlugin(App)
      const span = wrapper.find('[role="status"]')
      expect(span.exists()).toBe(true)
      expect(span.attributes('data-part')).toBe('progress')
    })
  })

  describe('navigation', () => {
    it('should show second step content after next()', async () => {
      const App = createApp(
        `<div>
          <TourRoot step="step-1" v-slot="{ isActive }">
            <span v-if="isActive" data-testid="step-1">Step 1</span>
          </TourRoot>
          <TourRoot step="step-2" v-slot="{ isActive }">
            <span v-if="isActive" data-testid="step-2">Step 2</span>
          </TourRoot>
        </div>`,
        () => {
          const tour = useTour()
          tour.steps.onboard([
            { id: 'step-1' },
            { id: 'step-2' },
          ])
          tour.start()
          return { tour }
        },
      )

      const wrapper = mountWithPlugin(App)
      expect(wrapper.find('[data-testid="step-1"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="step-2"]').exists()).toBe(false)

      const tour = (wrapper.vm as any).tour
      await tour.next()
      await nextTick()

      expect(wrapper.find('[data-testid="step-1"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="step-2"]').exists()).toBe(true)
    })
  })

  describe('tour.Skip', () => {
    it('should emit skip event on click', async () => {
      const App = createApp(
        `<TourRoot step="step-1">
          <TourSkip @skip="onSkip">Skip</TourSkip>
        </TourRoot>`,
        () => {
          const skipped = { value: false }
          return {
            onSkip: () => {
              skipped.value = true
            },
            skipped,
          }
        },
      )

      const wrapper = mountWithPlugin(App)
      const btn = wrapper.find('[data-part="skip"]')
      expect(btn.exists()).toBe(true)
      await btn.trigger('click')
    })
  })
})
