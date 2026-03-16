import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Mock hydration as already hydrated
const mockIsHydrated = ref(true)
vi.mock('#v0/composables/useHydration', () => ({
  useHydration: () => ({
    isHydrated: mockIsHydrated,
    hydrate: vi.fn(),
  }),
}))

vi.mock('#v0/constants/globals', () => ({
  SUPPORTS_INTERSECTION_OBSERVER: true,
}))

import { Lazy } from './index'

// Mock IntersectionObserver for happy-dom
let intersectionCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null
let mockObserver: {
  observe: ReturnType<typeof vi.fn>
  unobserve: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  intersectionCallback = null
  mockIsHydrated.value = true

  // Create mock observer
  mockObserver = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }

  // Mock IntersectionObserver globally - must use function syntax for constructor
  globalThis.IntersectionObserver = vi.fn(function (this: any, callback: IntersectionObserverCallback) {
    intersectionCallback = callback as (entries: IntersectionObserverEntry[]) => void
    return mockObserver
  }) as unknown as typeof IntersectionObserver
  window.IntersectionObserver = globalThis.IntersectionObserver

  vi.clearAllMocks()
})

// Helper to simulate intersection
function simulateIntersection (isIntersecting = true) {
  intersectionCallback?.([{
    isIntersecting,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    target: document.createElement('div'),
    time: performance.now(),
  }])
}

describe('lazy', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as div by default', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => h('span', 'Content'),
          },
        })

        await nextTick()
        expect(wrapper.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', async () => {
        const wrapper = mount(Lazy.Root, {
          props: { as: 'section' },
          slots: {
            default: () => h('span', 'Content'),
          },
        })

        await nextTick()
        expect(wrapper.element.tagName).toBe('SECTION')
      })

      it('should render children in default slot', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => h('span', { class: 'test-child' }, 'Child content'),
          },
        })

        await nextTick()
        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.find('.test-child').text()).toBe('Child content')
      })
    })

    describe('slot props', () => {
      it('should expose isBooted, hasContent, reset, and onAfterLeave in slot props', async () => {
        let slotProps: any

        mount(Lazy.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isBooted).toBe('boolean')
        expect(typeof slotProps.hasContent).toBe('boolean')
        expect(typeof slotProps.reset).toBe('function')
        expect(typeof slotProps.onAfterLeave).toBe('function')
      })

      it('should have isBooted=false and hasContent=false initially', async () => {
        let slotProps: any

        mount(Lazy.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps.isBooted).toBe(false)
        expect(slotProps.hasContent).toBe(false)
      })

      it('should update slot props after intersection', async () => {
        let slotProps: any

        mount(Lazy.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        simulateIntersection(true)
        await nextTick()

        expect(slotProps.isBooted).toBe(true)
        expect(slotProps.hasContent).toBe(true)
      })
    })

    describe('context provision', () => {
      it('should provide context with default namespace', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => [
              h(Lazy.Placeholder, {}, () => 'Skeleton'),
              h(Lazy.Content, {}, () => 'Content'),
            ],
          },
        })

        await nextTick()

        const placeholder = wrapper.findComponent(Lazy.Placeholder as any)
        expect(placeholder.exists()).toBe(true)
      })

      it('should provide context with custom namespace', async () => {
        const wrapper = mount(Lazy.Root, {
          props: { namespace: 'custom-lazy' },
          slots: {
            default: () => [
              h(Lazy.Placeholder, { namespace: 'custom-lazy' }, () => 'Skeleton'),
              h(Lazy.Content, { namespace: 'custom-lazy' }, () => 'Content'),
            ],
          },
        })

        await nextTick()

        const placeholder = wrapper.findComponent(Lazy.Placeholder as any)
        expect(placeholder.exists()).toBe(true)
      })
    })

    describe('eager mode', () => {
      it('should have hasContent=true immediately when eager=true', async () => {
        let slotProps: any

        mount(Lazy.Root, {
          props: { eager: true },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps.hasContent).toBe(true)
      })

      it('should show content immediately when eager=true', async () => {
        const wrapper = mount(Lazy.Root, {
          props: { eager: true },
          slots: {
            default: () => [
              h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Skeleton')),
              h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Content')),
            ],
          },
        })

        await nextTick()

        expect(wrapper.find('.content').exists()).toBe(true)
        expect(wrapper.find('.skeleton').exists()).toBe(false)
      })
    })

    describe('intersection observer options', () => {
      it('should pass rootMargin to IntersectionObserver', async () => {
        mount(Lazy.Root, {
          props: { rootMargin: '50px' },
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        await nextTick()

        expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ rootMargin: '50px' }),
        )
      })

      it('should pass threshold to IntersectionObserver', async () => {
        mount(Lazy.Root, {
          props: { threshold: 0.5 },
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        await nextTick()

        expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ threshold: 0.5 }),
        )
      })

      it('should pass threshold array to IntersectionObserver', async () => {
        mount(Lazy.Root, {
          props: { threshold: [0.25, 0.5, 0.75] },
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        await nextTick()

        expect(globalThis.IntersectionObserver).toHaveBeenCalledWith(
          expect.any(Function),
          expect.objectContaining({ threshold: [0.25, 0.5, 0.75] }),
        )
      })
    })
  })

  describe('placeholder', () => {
    describe('rendering', () => {
      it('should render as div by default', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => h(Lazy.Placeholder, {}, () => 'Skeleton'),
          },
        })

        await nextTick()

        const placeholder = wrapper.findComponent(Lazy.Placeholder as any)
        expect(placeholder.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => h(Lazy.Placeholder, { as: 'section' }, () => 'Skeleton'),
          },
        })

        await nextTick()

        const placeholder = wrapper.findComponent(Lazy.Placeholder as any)
        expect(placeholder.element.tagName).toBe('SECTION')
      })

      it('should render when hasContent is false', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => [
              h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Skeleton')),
              h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Content')),
            ],
          },
        })

        await nextTick()

        expect(wrapper.find('.skeleton').exists()).toBe(true)
        expect(wrapper.find('.content').exists()).toBe(false)
      })

      it('should not render after intersection', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => [
              h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Skeleton')),
              h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Content')),
            ],
          },
        })

        await nextTick()
        expect(wrapper.find('.skeleton').exists()).toBe(true)

        simulateIntersection(true)
        await nextTick()

        expect(wrapper.find('.skeleton').exists()).toBe(false)
      })
    })

    describe('slot props', () => {
      it('should expose hasContent in slot props', async () => {
        let slotProps: any

        mount(Lazy.Root, {
          slots: {
            default: () => h(Lazy.Placeholder, null, {
              default: (props: any) => {
                slotProps = props
                return h('div', 'Skeleton')
              },
            }),
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.hasContent).toBe('boolean')
        expect(slotProps.hasContent).toBe(false)
      })
    })
  })

  describe('content', () => {
    describe('rendering', () => {
      it('should render as div by default when visible', async () => {
        const wrapper = mount(Lazy.Root, {
          props: { eager: true },
          slots: {
            default: () => h(Lazy.Content, {}, () => 'Content'),
          },
        })

        await nextTick()

        const content = wrapper.findComponent(Lazy.Content as any)
        expect(content.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', async () => {
        const wrapper = mount(Lazy.Root, {
          props: { eager: true },
          slots: {
            default: () => h(Lazy.Content, { as: 'article' }, () => 'Content'),
          },
        })

        await nextTick()

        const content = wrapper.findComponent(Lazy.Content as any)
        expect(content.element.tagName).toBe('ARTICLE')
      })

      it('should not render when hasContent is false', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => [
              h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Skeleton')),
              h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Content')),
            ],
          },
        })

        await nextTick()

        expect(wrapper.find('.content').exists()).toBe(false)
        expect(wrapper.find('.skeleton').exists()).toBe(true)
      })

      it('should render after intersection', async () => {
        const wrapper = mount(Lazy.Root, {
          slots: {
            default: () => [
              h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Skeleton')),
              h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Content')),
            ],
          },
        })

        await nextTick()
        expect(wrapper.find('.content').exists()).toBe(false)

        simulateIntersection(true)
        await nextTick()

        expect(wrapper.find('.content').exists()).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose hasContent in slot props', async () => {
        let slotProps: any

        mount(Lazy.Root, {
          props: { eager: true },
          slots: {
            default: () => h(Lazy.Content, null, {
              default: (props: any) => {
                slotProps = props
                return h('div', 'Content')
              },
            }),
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.hasContent).toBe('boolean')
        expect(slotProps.hasContent).toBe(true)
      })
    })
  })

  describe('integration', () => {
    it('should work with complete lazy loading flow', async () => {
      const wrapper = mount(Lazy.Root, {
        slots: {
          default: () => [
            h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Loading...')),
            h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Loaded!')),
          ],
        },
      })

      await nextTick()

      // Initially shows placeholder
      expect(wrapper.find('.skeleton').exists()).toBe(true)
      expect(wrapper.find('.content').exists()).toBe(false)

      // Simulate viewport intersection
      simulateIntersection(true)
      await nextTick()

      // Now shows content
      expect(wrapper.find('.skeleton').exists()).toBe(false)
      expect(wrapper.find('.content').exists()).toBe(true)
    })

    it('should use custom namespace for isolation', async () => {
      const wrapper = mount(defineComponent({
        render: () => [
          h(Lazy.Root, { namespace: 'lazy-1' }, () => [
            h(Lazy.Placeholder, { namespace: 'lazy-1' }, () => 'Skeleton 1'),
            h(Lazy.Content, { namespace: 'lazy-1' }, () => 'Content 1'),
          ]),
          h(Lazy.Root, { namespace: 'lazy-2' }, () => [
            h(Lazy.Placeholder, { namespace: 'lazy-2' }, () => 'Skeleton 2'),
            h(Lazy.Content, { namespace: 'lazy-2' }, () => 'Content 2'),
          ]),
        ],
      }))

      await nextTick()

      const placeholders = wrapper.findAllComponents(Lazy.Placeholder as any)
      expect(placeholders).toHaveLength(2)
      expect(placeholders[0]?.text()).toBe('Skeleton 1')
      expect(placeholders[1]?.text()).toBe('Skeleton 2')
    })

    it('should support using slot props directly on root', async () => {
      const wrapper = mount(Lazy.Root, {
        slots: {
          default: ({ hasContent }: { hasContent: boolean }) => hasContent
            ? h('div', { class: 'content' }, 'Loaded!')
            : h('div', { class: 'skeleton' }, 'Loading...'),
        },
      })

      await nextTick()

      // Initially shows placeholder
      expect(wrapper.find('.skeleton').exists()).toBe(true)
      expect(wrapper.find('.content').exists()).toBe(false)

      // Simulate viewport intersection
      simulateIntersection(true)
      await nextTick()

      // Now shows content
      expect(wrapper.find('.skeleton').exists()).toBe(false)
      expect(wrapper.find('.content').exists()).toBe(true)
    })
  })

  describe('reset functionality', () => {
    it('should reset booted state when reset is called', async () => {
      let slotProps: any

      mount(Lazy.Root, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()

      // Simulate intersection to boot
      simulateIntersection(true)
      await nextTick()

      expect(slotProps.isBooted).toBe(true)

      // Reset
      slotProps.reset()
      await nextTick()

      expect(slotProps.isBooted).toBe(false)
    })

    it('onAfterLeave should reset when not eager', async () => {
      let slotProps: any

      mount(Lazy.Root, {
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()

      // Simulate intersection to boot
      simulateIntersection(true)
      await nextTick()

      expect(slotProps.isBooted).toBe(true)

      // Call onAfterLeave (simulating transition end)
      slotProps.onAfterLeave()
      await nextTick()

      expect(slotProps.isBooted).toBe(false)
    })

    it('onAfterLeave should not reset when eager', async () => {
      let slotProps: any

      mount(Lazy.Root, {
        props: { eager: true },
        slots: {
          default: (props: any) => {
            slotProps = props
            return h('div', 'Content')
          },
        },
      })

      await nextTick()

      // Call onAfterLeave
      slotProps.onAfterLeave()
      await nextTick()

      // Should still have content because eager=true
      expect(slotProps.hasContent).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle non-intersecting callback', async () => {
      const wrapper = mount(Lazy.Root, {
        slots: {
          default: () => [
            h(Lazy.Placeholder, {}, () => h('div', { class: 'skeleton' }, 'Skeleton')),
            h(Lazy.Content, {}, () => h('div', { class: 'content' }, 'Content')),
          ],
        },
      })

      await nextTick()

      // Simulate non-intersection
      simulateIntersection(false)
      await nextTick()

      // Should still show placeholder
      expect(wrapper.find('.skeleton').exists()).toBe(true)
      expect(wrapper.find('.content').exists()).toBe(false)
    })

    it('should observe the root element', async () => {
      mount(Lazy.Root, {
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      await nextTick()

      expect(mockObserver.observe).toHaveBeenCalled()
    })
  })
})
