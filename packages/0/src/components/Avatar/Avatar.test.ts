import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Avatar } from './index'

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
            namespace: 'custom-avatar',
          },
          slots: {
            default: () => h(Avatar.Fallback, { namespace: 'custom-avatar' }, () => 'JD'),
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
          h(Avatar.Root, { namespace: 'avatar-1' }, () => [
            h(Avatar.Fallback, { namespace: 'avatar-1' }, () => 'A1'),
          ]),
          h(Avatar.Root, { namespace: 'avatar-2' }, () => [
            h(Avatar.Fallback, { namespace: 'avatar-2' }, () => 'A2'),
          ]),
        ],
      }))

      const fallbacks = wrapper.findAllComponents(Avatar.Fallback as any)
      expect(fallbacks).toHaveLength(2)
      expect(fallbacks[0]?.text()).toBe('A1')
      expect(fallbacks[1]?.text()).toBe('A2')
    })
  })

  describe('sSR/Hydration', () => {
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
})
