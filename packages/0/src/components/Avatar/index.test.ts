import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Composables
import { createLocalePlugin } from '#v0/composables'

import { Avatar } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

describe('avatar', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as div by default', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'JD'),
          },
        })

        expect(wrapper.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Avatar.Root, {
          props: {
            as: 'span',
          },
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'JD'),
          },
        })

        expect(wrapper.element.tagName).toBe('SPAN')
      })

      it('should render children in default slot', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h('span', { class: 'test-child' }, 'Child content'),
          },
        })

        expect(wrapper.find('.test-child').exists()).toBe(true)
        expect(wrapper.find('.test-child').text()).toBe('Child content')
      })

      it('should support renderless mode', () => {
        const wrapper = mount(Avatar.Root, {
          props: {
            renderless: true,
          },
          slots: {
            default: () => h('div', { class: 'custom-root' }, 'Content'),
          },
        })

        expect(wrapper.find('.custom-root').exists()).toBe(true)
      })
    })

    describe('context provision', () => {
      it('should provide context with default namespace', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'JD'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })

      it('should provide context with custom namespace', () => {
        const wrapper = mount(Avatar.Root, {
          props: {
            namespace: 'v0:custom-avatar',
          },
          slots: {
            default: () => h(Avatar.Fallback, { namespace: 'v0:custom-avatar' }, () => 'JD'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })
    })
  })

  describe('image', () => {
    describe('rendering', () => {
      it('should render as img by default', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        expect(image.element.tagName).toBe('IMG')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg', as: 'div' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        expect(image.element.tagName).toBe('DIV')
      })

      it('should set role=img attribute', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        expect(image.attributes('role')).toBe('img')
      })

      it('should pass src attribute', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        expect(image.attributes('src')).toBe('/avatar.jpg')
      })
    })

    describe('registration lifecycle', () => {
      it('should register with parent context on mount', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/avatar.jpg' }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        // Image registers as disabled initially, so fallback should be visible
        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })

      it('should unregister from parent context on unmount', async () => {
        const showImage = ref(true)

        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              showImage.value ? h(Avatar.Image, { src: '/avatar.jpg' }) : null,
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        expect(wrapper.findComponent(Avatar.Image as any).exists()).toBe(true)

        showImage.value = false
        await nextTick()

        expect(wrapper.findComponent(Avatar.Image as any).exists()).toBe(false)
        // Fallback should still exist
        expect(wrapper.findComponent(Avatar.Fallback as any).exists()).toBe(true)
      })
    })

    describe('load handling', () => {
      it('should emit load event when image loads', async () => {
        const onLoad = vi.fn()

        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg', onLoad }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        await image.trigger('load')

        expect(onLoad).toHaveBeenCalledTimes(1)
        expect(onLoad).toHaveBeenCalledWith(expect.any(Event))
      })

      it('should show image when loaded', async () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/avatar.jpg' }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        await image.trigger('load')
        await nextTick()

        // Image should be visible (v-show)
        expect(image.isVisible()).toBe(true)
      })

      it('should be visible after loading', async () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/avatar.jpg' }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)

        // Trigger load event - image becomes selected and enabled
        await image.trigger('load')
        await nextTick()

        // Image should be visible after loading
        expect(image.isVisible()).toBe(true)
      })
    })

    describe('error handling', () => {
      it('should emit error event when image fails to load', async () => {
        const onError = vi.fn()

        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/invalid.jpg', onError }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        await image.trigger('error')

        expect(onError).toHaveBeenCalledTimes(1)
        expect(onError).toHaveBeenCalledWith(expect.any(Event))
      })

      it('should keep fallback visible when image fails to load', async () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/invalid.jpg' }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        await image.trigger('error')
        await nextTick()

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })
    })

    describe('priority', () => {
      it('should use default priority of 0', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        expect(image.exists()).toBe(true)
      })

      it('should allow setting custom priority', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg', priority: 10 }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)
        expect(image.exists()).toBe(true)
      })

      it('should render multiple images', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/low-priority.jpg', priority: 1 }),
              h(Avatar.Image, { src: '/high-priority.jpg', priority: 10 }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        const images = wrapper.findAllComponents(Avatar.Image as any)
        expect(images).toHaveLength(2)
      })

      it('should select higher priority image when both load', async () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/low-priority.jpg', priority: 1 }),
              h(Avatar.Image, { src: '/high-priority.jpg', priority: 10 }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        const images = wrapper.findAllComponents(Avatar.Image as any)
        const lowPriorityImage = images[0]
        const highPriorityImage = images[1]

        // Both images load - higher priority should win
        await lowPriorityImage?.trigger('load')
        await highPriorityImage?.trigger('load')
        await nextTick()

        // Higher priority image should be visible, lower should be hidden
        // After both load, the one with higher priority should be selected
        expect(highPriorityImage?.isVisible()).toBe(true)
      })
    })

    describe('slot props', () => {
      it('should expose correct attrs on element', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)

        expect(image.attributes('role')).toBe('img')
        expect(image.attributes('src')).toBe('/avatar.jpg')
      })

      it('should be visible when only image is present (mandatory force)', () => {
        // With mandatory: 'force', even a disabled image gets selected if it's the only item
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)

        // With only an image (no fallback), mandatory:'force' selects it
        expect(image.isVisible()).toBe(true)
      })
    })

    describe('renderless mode', () => {
      it('should support renderless mode with slot props', () => {
        // Suppress Vue warning about runtime directive on non-element root
        // This is expected when using v-show with renderless components
        using warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        let slotProps: any

        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () =>
              h(Avatar.Image, { src: '/avatar.jpg', renderless: true }, {
                default: (props: any) => {
                  slotProps = props
                  return h('img', { class: 'custom-img', ...props.attrs })
                },
              }),
          },
        })

        expect(slotProps).toBeDefined()
        expect(wrapper.find('.custom-img').exists()).toBe(true)
        expect(warnSpy).toHaveBeenCalled()
      })
    })
  })

  describe('fallback', () => {
    describe('rendering', () => {
      it('should render as span by default', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'JD'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.element.tagName).toBe('SPAN')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, { as: 'div' }, () => 'JD'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.element.tagName).toBe('DIV')
      })

      it('should render slot content', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'John Doe'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.text()).toBe('John Doe')
      })
    })

    describe('visibility', () => {
      it('should be visible when no images are present', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'JD'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })

      it('should be visible when images have not loaded', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/avatar.jpg' }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        // Image starts disabled, fallback should be visible via mandatory: 'force'
        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })

      it('should coexist with loaded image', async () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => [
              h(Avatar.Image, { src: '/avatar.jpg' }),
              h(Avatar.Fallback, {}, () => 'JD'),
            ],
          },
        })

        const image = wrapper.findComponent(Avatar.Image as any)

        // Trigger image load - image should become visible
        await image.trigger('load')
        await nextTick()

        // Image should be visible
        expect(image.isVisible()).toBe(true)
        // Both components exist in DOM
        expect(wrapper.findComponent(Avatar.Fallback as any).exists()).toBe(true)
      })
    })

    describe('registration lifecycle', () => {
      it('should register with parent context on mount', () => {
        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () => h(Avatar.Fallback, {}, () => 'JD'),
          },
        })

        const fallback = wrapper.findComponent(Avatar.Fallback as any)
        expect(fallback.exists()).toBe(true)
      })

      it('should unregister from parent context on unmount', async () => {
        const showFallback = ref(true)

        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () =>
              showFallback.value ? h(Avatar.Fallback, {}, () => 'JD') : null,
          },
        })

        expect(wrapper.findComponent(Avatar.Fallback as any).exists()).toBe(true)

        showFallback.value = false
        await nextTick()

        expect(wrapper.findComponent(Avatar.Fallback as any).exists()).toBe(false)
      })
    })

    describe('slot props', () => {
      it('should expose correct slot props', () => {
        let slotProps: any

        mount(Avatar.Root, {
          slots: {
            default: () =>
              h(Avatar.Fallback, {}, {
                default: (props: any) => {
                  slotProps = props
                  return h('span', 'JD')
                },
              }),
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isSelected).toBe('boolean')
        expect(slotProps.isSelected).toBe(true) // Should be selected since no images
      })
    })

    describe('renderless mode', () => {
      it('should support renderless mode with slot props', () => {
        let slotProps: any

        const wrapper = mount(Avatar.Root, {
          slots: {
            default: () =>
              h(Avatar.Fallback, { renderless: true }, {
                default: (props: any) => {
                  slotProps = props
                  return h('div', { class: 'custom-fallback' }, 'JD')
                },
              }),
          },
        })

        expect(slotProps).toBeDefined()
        expect(wrapper.find('.custom-fallback').exists()).toBe(true)
      })
    })
  })

  describe('integration', () => {
    it('should work as complete avatar with image and fallback', async () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Image, { src: '/avatar.jpg' }),
            h(Avatar.Fallback, {}, () => 'JD'),
          ],
        },
      })

      const image = wrapper.findComponent(Avatar.Image as any)

      // Image loads successfully - should become visible
      await image.trigger('load')
      await nextTick()

      expect(image.isVisible()).toBe(true)

      // Image errors - selection should change
      await image.trigger('error')
      await nextTick()

      // After error, selection state changes
      // Fallback should still exist
      expect(wrapper.findComponent(Avatar.Fallback as any).exists()).toBe(true)
    })

    it('should handle multiple images with priority', async () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Image, { src: '/primary.jpg', priority: 10 }),
            h(Avatar.Image, { src: '/secondary.jpg', priority: 5 }),
            h(Avatar.Fallback, {}, () => 'JD'),
          ],
        },
      })

      const images = wrapper.findAllComponents(Avatar.Image as any)
      const primaryImage = images[0]
      const secondaryImage = images[1]

      // Both images load - higher priority should win
      await secondaryImage?.trigger('load')
      await primaryImage?.trigger('load')
      await nextTick()

      // Primary (higher priority) should be visible
      expect(primaryImage?.isVisible()).toBe(true)
    })

    it('should use custom namespace for isolation', () => {
      const wrapper = mount(defineComponent({
        render: () => [
          h(Avatar.Root, { namespace: 'v0:avatar-1' }, () => [
            h(Avatar.Fallback, { namespace: 'v0:avatar-1' }, () => 'A1'),
          ]),
          h(Avatar.Root, { namespace: 'v0:avatar-2' }, () => [
            h(Avatar.Fallback, { namespace: 'v0:avatar-2' }, () => 'A2'),
          ]),
        ],
      }))

      const fallbacks = wrapper.findAllComponents(Avatar.Fallback as any)
      expect(fallbacks).toHaveLength(2)
      expect(fallbacks[0]?.text()).toBe('A1')
      expect(fallbacks[1]?.text()).toBe('A2')
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Avatar.Root as any, {}, () => [
            h(Avatar.Image as any, { src: '/avatar.jpg' }),
            h(Avatar.Fallback as any, {}, () => 'JD'),
          ]),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('JD')
      expect(html).toContain('role="img"')
    })

    it('should render fallback by default on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Avatar.Root as any, {}, () => [
            h(Avatar.Image as any, { src: '/avatar.jpg' }),
            h(Avatar.Fallback as any, {}, () => 'JD'),
          ]),
      }))

      const html = await renderToString(app)

      // Fallback should be in the HTML since images can't load on server
      expect(html).toContain('JD')
    })

    it('should render multiple images on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Avatar.Root as any, {}, () => [
            h(Avatar.Image as any, { src: '/primary.jpg', priority: 10 }),
            h(Avatar.Image as any, { src: '/secondary.jpg', priority: 5 }),
            h(Avatar.Fallback as any, {}, () => 'JD'),
          ]),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      // Images are initially hidden (v-show), should still be in DOM
      expect(html).toContain('/primary.jpg')
      expect(html).toContain('/secondary.jpg')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Avatar.Root as any, {}, () => [
            h(Avatar.Image as any, { src: '/avatar.jpg' }),
            h(Avatar.Fallback as any, {}, () => 'JD'),
          ]),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      const fallback = wrapper.findComponent(Avatar.Fallback as any)
      expect(fallback.exists()).toBe(true)
      expect(fallback.text()).toBe('JD')

      wrapper.unmount()
    })

    it('should handle custom as props on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Avatar.Root as any, { as: 'figure' }, () => [
            h(Avatar.Image as any, { src: '/avatar.jpg' }),
            h(Avatar.Fallback as any, { as: 'figcaption' }, () => 'JD'),
          ]),
      }))

      const html = await renderToString(app)

      expect(html).toContain('<figure')
      expect(html).toContain('<figcaption')
    })
  })

  describe('edge cases', () => {
    it('should handle empty src', () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Image, { src: '' }),
            h(Avatar.Fallback, {}, () => 'JD'),
          ],
        },
      })

      const image = wrapper.findComponent(Avatar.Image as any)
      expect(image.attributes('src')).toBe('')
    })

    it('should handle missing fallback', async () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => h(Avatar.Image, { src: '/avatar.jpg' }),
        },
      })

      const image = wrapper.findComponent(Avatar.Image as any)

      // Should not throw when image loads without fallback
      await image.trigger('load')
      await nextTick()

      expect(image.isVisible()).toBe(true)
    })

    it('should handle image without src', () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Image),
            h(Avatar.Fallback, {}, () => 'JD'),
          ],
        },
      })

      const image = wrapper.findComponent(Avatar.Image as any)
      expect(image.attributes('src')).toBeUndefined()
    })

    it('should handle rapid load/error cycles', async () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Image, { src: '/avatar.jpg' }),
            h(Avatar.Fallback, {}, () => 'JD'),
          ],
        },
      })

      const image = wrapper.findComponent(Avatar.Image as any)

      // Rapid cycles ending in error
      await image.trigger('load')
      await image.trigger('error')
      await image.trigger('load')
      await image.trigger('error')
      await nextTick()

      // After final error, fallback should be visible
      expect(wrapper.findComponent(Avatar.Fallback as any).exists()).toBe(true)
    })

    it('should handle multiple fallbacks - both register', () => {
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Fallback, {}, () => 'FB1'),
            h(Avatar.Fallback, {}, () => 'FB2'),
          ],
        },
      })

      // Both register with the selection context
      // Only one should be selected due to mandatory: 'force' and single selection
      const fallbacks = wrapper.findAllComponents(Avatar.Fallback as any)
      expect(fallbacks).toHaveLength(2)
    })

    it('should handle dynamic image src changes', async () => {
      const src = ref('/avatar1.jpg')

      const wrapper = mount(Avatar.Root, {
        slots: {
          default: () => [
            h(Avatar.Image, { src: src.value }),
            h(Avatar.Fallback, {}, () => 'JD'),
          ],
        },
      })

      const image = wrapper.findComponent(Avatar.Image as any)
      expect(image.attributes('src')).toBe('/avatar1.jpg')

      src.value = '/avatar2.jpg'
      await nextTick()

      expect(wrapper.findComponent(Avatar.Image as any).attributes('src')).toBe('/avatar2.jpg')
    })
  })

  describe('group', () => {
    it('should register children and expose total/visible/hidden + role=group', async () => {
      let captured: any
      const wrapper = mount(Avatar.Group, {
        props: { max: undefined },
        slots: {
          default: (props: any) => {
            captured = props
            return Array.from({ length: 4 }, (_, i) =>
              h(Avatar.Root, { key: i, value: `u${i}` }, {
                default: () => h(Avatar.Fallback, {}, () => `U${i}`),
              }),
            )
          },
        },
      })

      await nextTick()

      expect(captured).toBeDefined()
      expect(captured.total).toBe(4)
      expect(captured.visible).toBe(4)
      expect(captured.hidden).toEqual([])
      expect(captured.isOverflowing).toBe(false)
      expect(captured.attrs.role).toBe('group')
      expect(captured.attrs['data-overflow']).toBeUndefined()
      expect(wrapper.attributes('role')).toBe('group')

      wrapper.unmount()
    })

    it('should decrement total when a child unmounts', async () => {
      let captured: any
      const count = ref(4)

      const Wrapper = defineComponent({
        setup () {
          return () => h(Avatar.Group, {}, {
            default: (props: any) => {
              captured = props
              return Array.from({ length: count.value }, (_, i) =>
                h(Avatar.Root, { key: i, value: `u${i}` }, {
                  default: () => h(Avatar.Fallback, {}, () => `U${i}`),
                }),
              )
            },
          })
        },
      })

      const wrapper = mount(Wrapper)

      await nextTick()
      expect(captured.total).toBe(4)

      count.value = 3
      await nextTick()
      expect(captured.total).toBe(3)

      wrapper.unmount()
    })

    it('should truncate from end when priority="start"', async () => {
      const wrapper = mount(Avatar.Group, {
        props: { max: 3, priority: 'start' },
        slots: {
          default: () => Array.from({ length: 5 }, (_, i) =>
            h(Avatar.Root, { key: i, value: `u${i}` }, {
              default: () => h(Avatar.Fallback, {}, () => `U${i}`),
            }),
          ),
        },
      })

      await nextTick()

      const roots = wrapper.findAllComponents(Avatar.Root as any)
      expect(roots).toHaveLength(5)

      expect(roots[0]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[1]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[2]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[3]!.attributes('data-hidden')).toBe('true')
      expect(roots[3]!.attributes('aria-hidden')).toBe('true')
      expect(roots[4]!.attributes('data-hidden')).toBe('true')
      expect(roots[4]!.attributes('aria-hidden')).toBe('true')

      // data-index emitted only inside a Group
      expect(roots[0]!.attributes('data-index')).toBe('0')
      expect(roots[4]!.attributes('data-index')).toBe('4')

      wrapper.unmount()
    })

    it('should truncate from start when priority="end"', async () => {
      const wrapper = mount(Avatar.Group, {
        props: { max: 3, priority: 'end' },
        slots: {
          default: () => Array.from({ length: 5 }, (_, i) =>
            h(Avatar.Root, { key: i, value: `u${i}` }, {
              default: () => h(Avatar.Fallback, {}, () => `U${i}`),
            }),
          ),
        },
      })

      await nextTick()

      const roots = wrapper.findAllComponents(Avatar.Root as any)
      expect(roots[0]!.attributes('data-hidden')).toBe('true')
      expect(roots[1]!.attributes('data-hidden')).toBe('true')
      expect(roots[2]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[3]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[4]!.attributes('data-hidden')).toBeUndefined()

      wrapper.unmount()
    })

    it('should keep disabled avatars visible and exclude them from capacity rank', async () => {
      // 6 avatars, the middle one disabled. max=3, priority=start.
      // Expected: disabled item is always visible; the 3 non-disabled visible slots
      // fill from the start; trailing non-disabled items are hidden.
      const wrapper = mount(Avatar.Group, {
        props: { max: 3, priority: 'start' },
        slots: {
          default: () => [
            h(Avatar.Root, { key: 0, value: 'u0' }, { default: () => h(Avatar.Fallback, {}, () => 'U0') }),
            h(Avatar.Root, { key: 1, value: 'u1' }, { default: () => h(Avatar.Fallback, {}, () => 'U1') }),
            h(Avatar.Root, { key: 2, value: 'u2', disabled: true }, { default: () => h(Avatar.Fallback, {}, () => 'U2') }),
            h(Avatar.Root, { key: 3, value: 'u3' }, { default: () => h(Avatar.Fallback, {}, () => 'U3') }),
            h(Avatar.Root, { key: 4, value: 'u4' }, { default: () => h(Avatar.Fallback, {}, () => 'U4') }),
            h(Avatar.Root, { key: 5, value: 'u5' }, { default: () => h(Avatar.Fallback, {}, () => 'U5') }),
          ],
        },
      })

      await nextTick()

      const roots = wrapper.findAllComponents(Avatar.Root as any)
      expect(roots[0]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[1]!.attributes('data-hidden')).toBeUndefined()
      // Disabled avatar always visible regardless of max
      expect(roots[2]!.attributes('data-hidden')).toBeUndefined()
      // Third non-disabled slot
      expect(roots[3]!.attributes('data-hidden')).toBeUndefined()
      // The two remaining non-disabled avatars are hidden
      expect(roots[4]!.attributes('data-hidden')).toBe('true')
      expect(roots[5]!.attributes('data-hidden')).toBe('true')

      wrapper.unmount()
    })

    it('should leave standalone Avatar.Root unhidden and without data-index/data-hidden', async () => {
      let captured: any
      const wrapper = mount(Avatar.Root, {
        slots: {
          default: (props: any) => {
            captured = props
            return h(Avatar.Fallback, {}, () => 'JD')
          },
        },
      })

      await nextTick()

      expect(captured).toBeDefined()
      expect(captured.isHidden).toBe(false)
      expect(wrapper.attributes('data-hidden')).toBeUndefined()
      expect(wrapper.attributes('data-index')).toBeUndefined()
      expect(wrapper.attributes('aria-hidden')).toBeUndefined()

      wrapper.unmount()
    })
  })

  describe('indicator', () => {
    it('should render only when the group is overflowing and expose count + hidden', async () => {
      let captured: any
      const wrapper = mount(Avatar.Group, {
        props: { max: 2 },
        slots: {
          default: () => [
            ...Array.from({ length: 5 }, (_, i) =>
              h(Avatar.Root, { key: i, value: `u${i}` }, {
                default: () => h(Avatar.Fallback, {}, () => `U${i}`),
              }),
            ),
            h(Avatar.Indicator, {}, {
              default: (props: any) => {
                captured = props
                return h('span', { class: 'indicator' }, `+${props.count}`)
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(wrapper.find('.indicator').exists()).toBe(true)
      expect(captured).toBeDefined()
      expect(captured.count).toBe(3)
      expect(captured.hidden).toHaveLength(3)
      expect(captured.hidden[0].value).toBe('u2')
      expect(captured.hidden[1].value).toBe('u3')
      expect(captured.hidden[2].value).toBe('u4')
      expect(captured.attrs['aria-live']).toBe('polite')
      expect(captured.attrs['data-overflow-indicator']).toBe('true')

      wrapper.unmount()
    })

    it('should render nothing when group is not overflowing', async () => {
      const wrapper = mount(Avatar.Group, {
        props: { max: 10 },
        slots: {
          default: () => [
            ...Array.from({ length: 3 }, (_, i) =>
              h(Avatar.Root, { key: i, value: `u${i}` }, {
                default: () => h(Avatar.Fallback, {}, () => `U${i}`),
              }),
            ),
            h(Avatar.Indicator, {}, {
              default: (props: any) => h('span', { class: 'indicator' }, `+${props.count}`),
            }),
          ],
        },
      })

      await nextTick()

      expect(wrapper.find('.indicator').exists()).toBe(false)

      wrapper.unmount()
    })

    it('should render nothing when used standalone without an Avatar.Group ancestor', async () => {
      const wrapper = mount(Avatar.Indicator, {
        slots: {
          default: (props: any) => h('span', { class: 'indicator' }, `+${props.count}`),
        },
      })

      await nextTick()

      expect(wrapper.find('.indicator').exists()).toBe(false)

      wrapper.unmount()
    })

    it('should fall back to "+N" aria-label when locale has no entry for the key', async () => {
      let captured: any
      const wrapper = mount(Avatar.Group, {
        props: { max: 2 },
        slots: {
          default: () => [
            ...Array.from({ length: 5 }, (_, i) =>
              h(Avatar.Root, { key: i, value: `u${i}` }, {
                default: () => h(Avatar.Fallback, {}, () => `U${i}`),
              }),
            ),
            h(Avatar.Indicator, {}, {
              default: (props: any) => {
                captured = props
                return h('span', { class: 'indicator' }, `+${props.count}`)
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(captured).toBeDefined()
      expect(captured.attrs['aria-label']).toBe('+3')

      wrapper.unmount()
    })

    it('should use the translated locale string for aria-label when one is registered', async () => {
      const plugin = createLocalePlugin({
        default: 'en',
        messages: {
          en: {
            Avatar: {
              indicatorLabel: '{count} more',
            },
          },
        },
      })

      let captured: any
      const wrapper = mount(Avatar.Group, {
        props: { max: 2 },
        global: { plugins: [plugin] },
        slots: {
          default: () => [
            ...Array.from({ length: 5 }, (_, i) =>
              h(Avatar.Root, { key: i, value: `u${i}` }, {
                default: () => h(Avatar.Fallback, {}, () => `U${i}`),
              }),
            ),
            h(Avatar.Indicator, {}, {
              default: (props: any) => {
                captured = props
                return h('span', { class: 'indicator' }, `+${props.count}`)
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(captured).toBeDefined()
      expect(captured.attrs['aria-label']).toBeDefined()
      expect(captured.attrs['aria-label']).not.toBe('+3')
      expect(captured.attrs['aria-label']).toBe('3 more')

      wrapper.unmount()
    })
  })

  describe('group responsive', () => {
    let resizeObserverCallbacks: ResizeObserverCallback[] = []
    let resizeObserverTargets: Element[] = []

    class TestResizeObserver {
      cb: ResizeObserverCallback

      constructor (cb: ResizeObserverCallback) {
        this.cb = cb
        resizeObserverCallbacks.push(cb)
      }

      observe (el: Element) {
        resizeObserverTargets.push(el)
      }

      unobserve () {}
      disconnect () {}
    }

    function triggerResize (target: Element, width: number, height = 100): void {
      const rect = {
        width,
        height,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRectReadOnly

      for (const cb of resizeObserverCallbacks) {
        cb(
          [{
            contentRect: rect,
            target,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          }],
          {} as ResizeObserver,
        )
      }
    }

    beforeEach(() => {
      resizeObserverCallbacks = []
      resizeObserverTargets = []
      vi.stubGlobal('ResizeObserver', TestResizeObserver)
      vi.stubGlobal('getComputedStyle', () => ({ marginLeft: '0px', marginRight: '0px' } as CSSStyleDeclaration))
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get () {
          return 100
        },
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
      // Restore offsetWidth to default (delete the override on the prototype)
      delete (HTMLElement.prototype as any).offsetWidth
    })

    it('should mark group as overflowing when count exceeds responsive capacity', async () => {
      let captured: any
      const wrapper = mount(Avatar.Group, {
        props: { responsive: true, gap: 0 },
        attachTo: document.body,
        slots: {
          default: (props: any) => {
            captured = props
            return [
              ...Array.from({ length: 6 }, (_, i) =>
                h(Avatar.Root, { key: i, value: `u${i}` }, {
                  default: () => h(Avatar.Fallback, {}, () => `U${i}`),
                }),
              ),
              h(Avatar.Indicator, {}, {
                default: (props: any) => h('span', { class: 'indicator' }, `+${props.count}`),
              }),
            ]
          },
        },
      })

      await nextTick()

      // itemWidth=100, indicatorWidth=100 (reserved), gap=0
      // available = 400 - 100 = 300; capacity = floor((300 - 100) / 100) + 1 = 3
      const container = wrapper.element as Element
      triggerResize(container, 400)
      await nextTick()
      await nextTick()

      expect(captured.isOverflowing).toBe(true)
      expect(wrapper.attributes('data-overflow')).toBe('true')

      // Indicator renders with count=3
      const indicator = wrapper.findComponent(Avatar.Indicator as any)
      expect(indicator.exists()).toBe(true)
      const indicatorSpan = wrapper.find('.indicator')
      expect(indicatorSpan.exists()).toBe(true)
      expect(indicatorSpan.text()).toBe('+3')

      // Three roots visible, three hidden
      const roots = wrapper.findAllComponents(Avatar.Root as any)
      let hiddenCount = 0
      let visibleCount = 0
      for (const root of roots) {
        if (root.attributes('data-hidden') === 'true') hiddenCount++
        else visibleCount++
      }
      expect(visibleCount).toBe(3)
      expect(hiddenCount).toBe(3)

      wrapper.unmount()
    })

    it('should truncate the head when priority="end" and still sample itemWidth from visible tail', async () => {
      let captured: any
      const wrapper = mount(Avatar.Group, {
        props: { responsive: true, priority: 'end', gap: 0 },
        attachTo: document.body,
        slots: {
          default: (props: any) => {
            captured = props
            return [
              ...Array.from({ length: 6 }, (_, i) =>
                h(Avatar.Root, { key: i, value: `u${i}` }, {
                  default: () => h(Avatar.Fallback, {}, () => `U${i}`),
                }),
              ),
              h(Avatar.Indicator, {}, {
                default: (props: any) => h('span', { class: 'indicator' }, `+${props.count}`),
              }),
            ]
          },
        },
      })

      await nextTick()

      const container = wrapper.element as Element
      triggerResize(container, 400)
      await nextTick()
      await nextTick()

      // Truncation actually happened — proves itemWidth got sampled despite
      // a99397f5: pre-fix, index-0 being hidden would zero itemWidth →
      // capacity Infinity → no truncation.
      expect(captured.isOverflowing).toBe(true)
      expect(wrapper.attributes('data-overflow')).toBe('true')
      expect(wrapper.find('.indicator').text()).toBe('+3')

      // First three hidden, last three visible
      const roots = wrapper.findAllComponents(Avatar.Root as any)
      expect(roots[0]!.attributes('data-hidden')).toBe('true')
      expect(roots[1]!.attributes('data-hidden')).toBe('true')
      expect(roots[2]!.attributes('data-hidden')).toBe('true')
      expect(roots[3]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[4]!.attributes('data-hidden')).toBeUndefined()
      expect(roots[5]!.attributes('data-hidden')).toBeUndefined()

      wrapper.unmount()
    })

    it('should preserve truncation after the first avatar is removed (no itemWidth zeroing on unmount)', async () => {
      let captured: any
      const members = ref(['m0', 'm1', 'm2', 'm3', 'm4', 'm5'])

      const Wrapper = defineComponent({
        setup () {
          return () => h(Avatar.Group, { responsive: true, gap: 0 }, {
            default: (props: any) => {
              captured = props
              return [
                ...members.value.map(m =>
                  h(Avatar.Root, { key: m, value: m }, {
                    default: () => h(Avatar.Fallback, {}, () => m.toUpperCase()),
                  }),
                ),
                h(Avatar.Indicator, {}, {
                  default: (props: any) => h('span', { class: 'indicator' }, `+${props.count}`),
                }),
              ]
            },
          })
        },
      })

      const wrapper = mount(Wrapper, { attachTo: document.body })

      await nextTick()

      const container = wrapper.element as Element
      triggerResize(container, 400)
      await nextTick()
      await nextTick()

      // Baseline: capacity=3, 6 avatars → overflowing
      expect(captured.isOverflowing).toBe(true)
      expect(captured.total).toBe(6)
      expect(wrapper.find('.indicator').text()).toBe('+3')

      // Remove first avatar — exercises onBeforeUnmount + reindex path
      members.value = members.value.slice(1)
      await nextTick()
      await nextTick()

      // 5 avatars left; capacity is still 3; should still be overflowing.
      // The bogus d7b37136 assumption was that itemWidth needed to be reset
      // on unmount — that reset would zero the shared sample and break
      // truncation for survivors. This test guards against re-introducing it.
      expect(captured.total).toBe(5)
      expect(captured.isOverflowing).toBe(true)
      expect(captured.hidden.length).toBe(2)
      expect(wrapper.find('.indicator').exists()).toBe(true)
      expect(wrapper.find('.indicator').text()).toBe('+2')

      wrapper.unmount()
    })
  })
})
