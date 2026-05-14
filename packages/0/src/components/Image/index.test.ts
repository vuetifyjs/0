import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Image } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'

describe('image', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as div by default', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        expect(wrapper.element.tagName).toBe('DIV')
      })

      it('should render as custom element when as prop is provided', () => {
        const wrapper = mount(Image.Root, {
          props: { as: 'span', src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        expect(wrapper.element.tagName).toBe('SPAN')
      })

      it('should support renderless mode', () => {
        const wrapper = mount(Image.Root, {
          props: { renderless: true, src: '/photo.jpg' },
          slots: {
            default: () => h('section', { class: 'custom-root' }, 'Content'),
          },
        })

        expect(wrapper.find('.custom-root').exists()).toBe(true)
      })

      it('should expose data-state attribute', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: { default: () => h('span') },
        })

        expect(wrapper.attributes('data-state')).toBe('loading')
      })
    })

    describe('slot props', () => {
      it('should expose status and boolean flags when not lazy', () => {
        let captured: any
        mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: (props: any) => {
              captured = props
              return h('span')
            },
          },
        })

        expect(captured.status).toBe('loading')
        expect(captured.isLoading).toBe(true)
        expect(captured.isIdle).toBe(false)
        expect(captured.isLoaded).toBe(false)
        expect(captured.isError).toBe(false)
      })

      it('should expose retry function', () => {
        let captured: any
        mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: (props: any) => {
              captured = props
              return h('span')
            },
          },
        })

        expect(typeof captured.retry).toBe('function')
      })
    })

    describe('lazy loading', () => {
      it('should start in idle when lazy', () => {
        let captured: any
        mount(Image.Root, {
          props: { src: '/photo.jpg', lazy: true },
          slots: {
            default: (props: any) => {
              captured = props
              return h('span')
            },
          },
        })

        // happy-dom does not implement IntersectionObserver naturally,
        // so isIntersecting begins false and status begins idle.
        expect(captured.status).toBe('idle')
        expect(captured.isIdle).toBe(true)
      })

      it('should start in loading when not lazy', () => {
        let captured: any
        mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: (props: any) => {
              captured = props
              return h('span')
            },
          },
        })

        expect(captured.status).toBe('loading')
      })

      it('should accept threshold and root props without throwing', () => {
        expect(() => {
          mount(Image.Root, {
            props: {
              src: '/photo.jpg',
              lazy: true,
              threshold: 0.5,
              rootMargin: '100px',
              root: null,
            },
            slots: { default: () => h('span') },
          })
        }).not.toThrow()
      })

      it('should warn when lazy is combined with renderless', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        mount(Image.Root, {
          props: { src: '/photo.jpg', lazy: true, renderless: true },
          slots: { default: () => h('span') },
        })

        expect(warnSpy).toHaveBeenCalledTimes(1)
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('`lazy` requires a wrapper element'))

        warnSpy.mockRestore()
      })
    })
  })

  describe('img', () => {
    describe('rendering', () => {
      it('should render as img by default', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        const img = wrapper.findComponent(Image.Img as any)
        expect(img.element.tagName).toBe('IMG')
      })

      it('should bind src from context', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        const img = wrapper.find('img')
        expect(img.attributes('src')).toBe('/photo.jpg')
      })

      it('should not bind src when context is idle', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg', lazy: true },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        const img = wrapper.find('img')
        expect(img.attributes('src')).toBeUndefined()
      })

      it('should pass alt, width, and height through', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Photo', width: 800, height: 600 }),
          },
        })

        const img = wrapper.find('img')
        expect(img.attributes('alt')).toBe('Photo')
        expect(img.attributes('width')).toBe('800')
        expect(img.attributes('height')).toBe('600')
      })

      it('should default decoding to async', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        const img = wrapper.find('img')
        expect(img.attributes('decoding')).toBe('async')
      })

      it('should expose role=img', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test' }),
          },
        })

        const img = wrapper.find('img')
        expect(img.attributes('role')).toBe('img')
      })

      it('should render default slot when in renderless mode', () => {
        let captured: any
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test', renderless: true }, {
              default: (props: any) => {
                captured = props
                return h('img', { ...props.attrs, class: 'consumer-img' })
              },
            }),
          },
        })

        expect(captured).toBeDefined()
        expect(captured.attrs.src).toBe('/photo.jpg')
        expect(captured.attrs.role).toBe('img')
        expect(wrapper.find('img.consumer-img').exists()).toBe(true)
      })

      it('should propagate class and style to the img element', () => {
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test', class: 'custom-class', style: 'opacity: 0.5' }),
          },
        })

        const img = wrapper.find('img')
        expect(img.classes()).toContain('custom-class')
        expect(img.attributes('style')).toContain('opacity: 0.5')
      })
    })

    describe('events', () => {
      it('should transition root to loaded on load event', async () => {
        let captured: any
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: (props: any) => {
              captured = props
              return h(Image.Img, { alt: 'Test' })
            },
          },
        })

        const img = wrapper.find('img')
        await img.trigger('load')

        expect(captured.status).toBe('loaded')
      })

      it('should transition root to error on error event', async () => {
        let captured: any
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: (props: any) => {
              captured = props
              return h(Image.Img, { alt: 'Test' })
            },
          },
        })

        const img = wrapper.find('img')
        await img.trigger('error')

        expect(captured.status).toBe('error')
      })

      it('should emit loadstart on initial mount when eager', () => {
        const onLoadstart = vi.fn()
        mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => h(Image.Img, { alt: 'Test', onLoadstart }),
          },
        })

        expect(onLoadstart).toHaveBeenCalledTimes(1)
        expect(onLoadstart).toHaveBeenCalledWith('/photo.jpg')
      })

      it('should not emit loadstart when idle (lazy)', () => {
        const onLoadstart = vi.fn()
        mount(Image.Root, {
          props: { src: '/photo.jpg', lazy: true },
          slots: {
            default: () => h(Image.Img, { alt: 'Test', onLoadstart }),
          },
        })

        expect(onLoadstart).not.toHaveBeenCalled()
      })

      it('should emit loadstart again when retry is called from Fallback', async () => {
        const onLoadstart = vi.fn()
        let fallbackProps: any
        const wrapper = mount(Image.Root, {
          props: { src: '/photo.jpg' },
          slots: {
            default: () => [
              h(Image.Img, { alt: 'Test', onLoadstart }),
              h(Image.Fallback as any, {}, (props: any) => {
                fallbackProps = props
                return 'Failed'
              }),
            ],
          },
        })

        // Initial mount: one loadstart for the first fetch
        expect(onLoadstart).toHaveBeenCalledTimes(1)

        await wrapper.find('img').trigger('error')
        await nextTick()

        fallbackProps.retry()
        // retry cycles through 'idle' briefly to force the browser refetch
        await nextTick()
        await nextTick()

        // retry counts as a new network request — loadstart fires again
        expect(onLoadstart).toHaveBeenCalledTimes(2)
        expect(onLoadstart).toHaveBeenLastCalledWith('/photo.jpg')
      })
    })
  })

  describe('placeholder', () => {
    it('should render while loading', () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Placeholder, {}, () => 'Loading'),
          ],
        },
      })

      expect(wrapper.text()).toContain('Loading')
    })

    it('should hide once loaded', async () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Placeholder, {}, () => 'Loading'),
          ],
        },
      })

      const img = wrapper.find('img')
      await img.trigger('load')
      await nextTick()

      expect(wrapper.text()).not.toContain('Loading')
    })

    it('should hide on error', async () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Placeholder, {}, () => 'Loading'),
          ],
        },
      })

      const img = wrapper.find('img')
      await img.trigger('error')
      await nextTick()

      expect(wrapper.text()).not.toContain('Loading')
    })

    it('should have aria-hidden=true', () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Placeholder, { class: 'placeholder' }, () => 'Loading'),
          ],
        },
      })

      expect(wrapper.find('.placeholder').attributes('aria-hidden')).toBe('true')
    })
  })

  describe('fallback', () => {
    it('should not render when not in error state', () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Fallback, {}, () => 'Failed'),
          ],
        },
      })

      expect(wrapper.text()).not.toContain('Failed')
    })

    it('should render when image errors', async () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Fallback, {}, () => 'Failed'),
          ],
        },
      })

      const img = wrapper.find('img')
      await img.trigger('error')
      await nextTick()

      expect(wrapper.text()).toContain('Failed')
    })

    it('should expose retry in slot props', async () => {
      let captured: any
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: () => [
            h(Image.Img, { alt: 'Test' }),
            h(Image.Fallback as any, {}, (props: any) => {
              captured = props
              return 'Failed'
            }),
          ],
        },
      })

      const img = wrapper.find('img')
      await img.trigger('error')
      await nextTick()

      expect(typeof captured.retry).toBe('function')
    })

    it('should reset to loading when retry is called', async () => {
      let rootProps: any
      let fallbackProps: any
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg' },
        slots: {
          default: (root: any) => {
            rootProps = root
            return [
              h(Image.Img, { alt: 'Test' }),
              h(Image.Fallback as any, {}, (props: any) => {
                fallbackProps = props
                return 'Failed'
              }),
            ]
          },
        },
      })

      const img = wrapper.find('img')
      await img.trigger('error')
      await nextTick()

      fallbackProps.retry()
      // retry cycles through 'idle' briefly to force the browser refetch
      await nextTick()
      await nextTick()

      expect(rootProps.status).toBe('loading')
    })
  })

  describe('namespacing', () => {
    it('should support custom namespace', () => {
      const wrapper = mount(Image.Root, {
        props: { src: '/photo.jpg', namespace: 'custom:image' },
        slots: {
          default: () => h(Image.Img, { alt: 'Test', namespace: 'custom:image' }),
        },
      })

      expect(wrapper.find('img').exists()).toBe(true)
    })
  })

  describe('ssr', () => {
    it('should render to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Image.Root, { src: '/photo.jpg' }, () => [
          h(Image.Img, { alt: 'Test' }),
          h(Image.Placeholder, {}, () => 'Loading'),
        ]),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()
      expect(html).toContain('img')
    })
  })
})
