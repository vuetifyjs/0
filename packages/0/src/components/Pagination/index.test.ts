import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

import { Pagination } from './index'

describe('pagination', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as nav element by default', () => {
        const wrapper = mount(Pagination.Root, {
          props: { size: 100 },
          slots: {
            default: () => h('span', 'Content'),
          },
        })

        expect(wrapper.find('nav').exists()).toBe(true)
      })

      it('should support renderless mode', () => {
        const wrapper = mount(Pagination.Root, {
          props: { size: 100, renderless: true },
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
        expect(wrapper.find('nav').exists()).toBe(false)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Pagination.Root, {
          props: { size: 100 },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.page).toBe('number')
        expect(typeof slotProps.size).toBe('number')
        expect(typeof slotProps.pages).toBe('number')
        expect(typeof slotProps.itemsPerPage).toBe('number')
        expect(Array.isArray(slotProps.items)).toBe(true)
        expect(typeof slotProps.pageStart).toBe('number')
        expect(typeof slotProps.pageStop).toBe('number')
        expect(typeof slotProps.isFirst).toBe('boolean')
        expect(typeof slotProps.isLast).toBe('boolean')
        expect(typeof slotProps.first).toBe('function')
        expect(typeof slotProps.last).toBe('function')
        expect(typeof slotProps.next).toBe('function')
        expect(typeof slotProps.prev).toBe('function')
        expect(typeof slotProps.select).toBe('function')
        expect(slotProps.attrs['aria-label']).toBeDefined()
      })
    })

    describe('page calculation', () => {
      it('should calculate correct number of pages', () => {
        let slotProps: any

        mount(Pagination.Root, {
          props: { size: 100, itemsPerPage: 10 },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.pages).toBe(10)
      })

      it('should calculate correct page start/stop', () => {
        let slotProps: any

        mount(Pagination.Root, {
          props: { size: 100, itemsPerPage: 10, modelValue: 3 },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        // Page 3: items 20-29 (0-indexed)
        expect(slotProps.pageStart).toBe(20)
        expect(slotProps.pageStop).toBe(30)
      })
    })

    describe('navigation', () => {
      it('should go to first page with first()', async () => {
        const page = ref(5)
        let slotProps: any

        mount(Pagination.Root, {
          props: {
            'size': 100,
            'modelValue': page.value,
            'onUpdate:modelValue': (v: number) => {
              page.value = v
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        slotProps.first()
        await nextTick()

        expect(page.value).toBe(1)
      })

      it('should go to last page with last()', async () => {
        const page = ref(1)
        let slotProps: any

        mount(Pagination.Root, {
          props: {
            'size': 100,
            'itemsPerPage': 10,
            'modelValue': page.value,
            'onUpdate:modelValue': (v: number) => {
              page.value = v
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        slotProps.last()
        await nextTick()

        expect(page.value).toBe(10)
      })

      it('should go to next page with next()', async () => {
        const page = ref(1)
        let slotProps: any

        mount(Pagination.Root, {
          props: {
            'size': 100,
            'modelValue': page.value,
            'onUpdate:modelValue': (v: number) => {
              page.value = v
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        slotProps.next()
        await nextTick()

        expect(page.value).toBe(2)
      })

      it('should go to previous page with prev()', async () => {
        const page = ref(3)
        let slotProps: any

        mount(Pagination.Root, {
          props: {
            'size': 100,
            'modelValue': page.value,
            'onUpdate:modelValue': (v: number) => {
              page.value = v
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        slotProps.prev()
        await nextTick()

        expect(page.value).toBe(2)
      })

      it('should go to specific page with select()', async () => {
        const page = ref(1)
        let slotProps: any

        mount(Pagination.Root, {
          props: {
            'size': 100,
            'modelValue': page.value,
            'onUpdate:modelValue': (v: number) => {
              page.value = v
            },
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        slotProps.select(5)
        await nextTick()

        expect(page.value).toBe(5)
      })
    })

    describe('boundary detection', () => {
      it('should detect first page', () => {
        let slotProps: any

        mount(Pagination.Root, {
          props: { size: 100, modelValue: 1 },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.isFirst).toBe(true)
        expect(slotProps.isLast).toBe(false)
      })

      it('should detect last page', () => {
        let slotProps: any

        mount(Pagination.Root, {
          props: { size: 100, itemsPerPage: 10, modelValue: 10 },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.isFirst).toBe(false)
        expect(slotProps.isLast).toBe(true)
      })
    })
  })

  describe('item', () => {
    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let itemProps: any

        mount(Pagination.Root, {
          props: { size: 100, renderless: true },
          slots: {
            default: () =>
              h(Pagination.Item, { value: 1 }, {
                default: (props: any) => {
                  itemProps = props
                  return h('button', 'Page 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps).toBeDefined()
        expect(itemProps.page).toBe(1)
        expect(typeof itemProps.isSelected).toBe('boolean')
        expect(typeof itemProps.isDisabled).toBe('boolean')
        expect(typeof itemProps.select).toBe('function')
      })

      it('should expose correct attrs', async () => {
        let itemProps: any

        mount(Pagination.Root, {
          props: { size: 100, renderless: true },
          slots: {
            default: () =>
              h(Pagination.Item, { value: 1 }, {
                default: (props: any) => {
                  itemProps = props
                  return h('button', 'Page 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.attrs['aria-label']).toBeDefined()
        expect(typeof itemProps.attrs['aria-disabled']).toBe('boolean')
        expect(typeof itemProps.attrs.tabindex).toBe('number')
        expect(itemProps.attrs.type).toBe('button')
        expect(typeof itemProps.attrs.onClick).toBe('function')
      })
    })

    describe('selection', () => {
      it('should show selected state when on current page', async () => {
        let itemProps: any

        mount(Pagination.Root, {
          props: { size: 100, modelValue: 1, renderless: true },
          slots: {
            default: () =>
              h(Pagination.Item, { value: 1 }, {
                default: (props: any) => {
                  itemProps = props
                  return h('button', 'Page 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isSelected).toBe(true)
        expect(itemProps.attrs['aria-current']).toBe('page')
        expect(itemProps.attrs['data-selected']).toBe(true)
      })

      it('should navigate to page when select() called', async () => {
        const page = ref(1)
        let itemProps: any

        mount(Pagination.Root, {
          props: {
            'size': 100,
            'renderless': true,
            'modelValue': page.value,
            'onUpdate:modelValue': (v: number) => {
              page.value = v
            },
          },
          slots: {
            default: () =>
              h(Pagination.Item, { value: 5 }, {
                default: (props: any) => {
                  itemProps = props
                  return h('button', 'Page 5')
                },
              }),
          },
        })

        await nextTick()

        itemProps.select()
        await nextTick()

        expect(page.value).toBe(5)
      })
    })

    describe('disabled state', () => {
      it('should be disabled when disabled=true', async () => {
        let itemProps: any

        mount(Pagination.Root, {
          props: { size: 100, renderless: true },
          slots: {
            default: () =>
              h(Pagination.Item, { value: 1, disabled: true }, {
                default: (props: any) => {
                  itemProps = props
                  return h('button', 'Page 1')
                },
              }),
          },
        })

        await nextTick()

        expect(itemProps.isDisabled).toBe(true)
        expect(itemProps.attrs['aria-disabled']).toBe(true)
        expect(itemProps.attrs['data-disabled']).toBe(true)
        expect(itemProps.attrs.disabled).toBe(true)
        expect(itemProps.attrs.tabindex).toBe(-1)
      })
    })
  })

  describe('first', () => {
    it('should expose slot props', async () => {
      let firstProps: any

      mount(Pagination.Root, {
        props: { size: 100, renderless: true },
        slots: {
          default: () =>
            h(Pagination.First, {}, {
              default: (props: any) => {
                firstProps = props
                return h('button', 'First')
              },
            }),
        },
      })

      await nextTick()

      expect(firstProps).toBeDefined()
      expect(typeof firstProps.isDisabled).toBe('boolean')
      expect(typeof firstProps.first).toBe('function')
      expect(firstProps.attrs['aria-label']).toBeDefined()
    })

    it('should be disabled when on first page', async () => {
      let firstProps: any

      mount(Pagination.Root, {
        props: { size: 100, modelValue: 1, renderless: true },
        slots: {
          default: () =>
            h(Pagination.First, {}, {
              default: (props: any) => {
                firstProps = props
                return h('button', 'First')
              },
            }),
        },
      })

      await nextTick()

      expect(firstProps.isDisabled).toBe(true)
      expect(firstProps.attrs['data-disabled']).toBe(true)
    })

    it('should be enabled when not on first page', async () => {
      let firstProps: any

      mount(Pagination.Root, {
        props: { size: 100, modelValue: 5, renderless: true },
        slots: {
          default: () =>
            h(Pagination.First, {}, {
              default: (props: any) => {
                firstProps = props
                return h('button', 'First')
              },
            }),
        },
      })

      await nextTick()

      expect(firstProps.isDisabled).toBe(false)
    })

    it('should navigate to first page', async () => {
      const page = ref(5)
      let firstProps: any

      mount(Pagination.Root, {
        props: {
          'size': 100,
          'renderless': true,
          'modelValue': page.value,
          'onUpdate:modelValue': (v: number) => {
            page.value = v
          },
        },
        slots: {
          default: () =>
            h(Pagination.First, {}, {
              default: (props: any) => {
                firstProps = props
                return h('button', 'First')
              },
            }),
        },
      })

      await nextTick()

      firstProps.first()
      await nextTick()

      expect(page.value).toBe(1)
    })
  })

  describe('next', () => {
    it('should expose slot props', async () => {
      let nextProps: any

      mount(Pagination.Root, {
        props: { size: 100, renderless: true },
        slots: {
          default: () =>
            h(Pagination.Next, {}, {
              default: (props: any) => {
                nextProps = props
                return h('button', 'Next')
              },
            }),
        },
      })

      await nextTick()

      expect(nextProps).toBeDefined()
      expect(typeof nextProps.isDisabled).toBe('boolean')
      expect(typeof nextProps.next).toBe('function')
    })

    it('should be disabled when on last page', async () => {
      let nextProps: any

      mount(Pagination.Root, {
        props: { size: 100, itemsPerPage: 10, modelValue: 10, renderless: true },
        slots: {
          default: () =>
            h(Pagination.Next, {}, {
              default: (props: any) => {
                nextProps = props
                return h('button', 'Next')
              },
            }),
        },
      })

      await nextTick()

      expect(nextProps.isDisabled).toBe(true)
    })

    it('should navigate to next page', async () => {
      const page = ref(1)
      let nextProps: any

      mount(Pagination.Root, {
        props: {
          'size': 100,
          'renderless': true,
          'modelValue': page.value,
          'onUpdate:modelValue': (v: number) => {
            page.value = v
          },
        },
        slots: {
          default: () =>
            h(Pagination.Next, {}, {
              default: (props: any) => {
                nextProps = props
                return h('button', 'Next')
              },
            }),
        },
      })

      await nextTick()

      nextProps.next()
      await nextTick()

      expect(page.value).toBe(2)
    })
  })

  describe('ellipsis', () => {
    it('should expose slot props', async () => {
      let ellipsisProps: any

      mount(Pagination.Root, {
        props: { size: 100, renderless: true },
        slots: {
          default: () =>
            h(Pagination.Ellipsis, {}, {
              default: (props: any) => {
                ellipsisProps = props
                return h('span', '...')
              },
            }),
        },
      })

      await nextTick()

      expect(ellipsisProps).toBeDefined()
      expect(ellipsisProps.ellipsis).toBeDefined()
      expect(ellipsisProps.attrs['aria-hidden']).toBe('true')
    })

    it('should use default ellipsis from root', async () => {
      let ellipsisProps: any

      mount(Pagination.Root, {
        props: { size: 100, ellipsis: '---', renderless: true },
        slots: {
          default: () =>
            h(Pagination.Ellipsis, {}, {
              default: (props: any) => {
                ellipsisProps = props
                return h('span', props.ellipsis)
              },
            }),
        },
      })

      await nextTick()

      expect(ellipsisProps.ellipsis).toBe('---')
    })

    it('should allow override ellipsis', async () => {
      let ellipsisProps: any

      mount(Pagination.Root, {
        props: { size: 100, ellipsis: '...', renderless: true },
        slots: {
          default: () =>
            h(Pagination.Ellipsis, { ellipsis: '***' }, {
              default: (props: any) => {
                ellipsisProps = props
                return h('span', props.ellipsis)
              },
            }),
        },
      })

      await nextTick()

      expect(ellipsisProps.ellipsis).toBe('***')
    })
  })

  describe('status', () => {
    it('should expose slot props', async () => {
      let statusProps: any

      mount(Pagination.Root, {
        props: { size: 100, itemsPerPage: 10, renderless: true },
        slots: {
          default: () =>
            h(Pagination.Status, {}, {
              default: (props: any) => {
                statusProps = props
                return h('div', 'Status')
              },
            }),
        },
      })

      await nextTick()

      expect(statusProps).toBeDefined()
      expect(typeof statusProps.page).toBe('number')
      expect(typeof statusProps.pages).toBe('number')
      expect(statusProps.attrs['aria-atomic']).toBe(true)
      expect(statusProps.attrs['aria-live']).toBe('polite')
      expect(statusProps.attrs.role).toBe('status')
    })

    it('should update text on page change', async () => {
      vi.useFakeTimers()

      let statusProps: any
      let rootProps: any

      mount(Pagination.Root, {
        props: {
          size: 100,
          itemsPerPage: 10,
          renderless: true,
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Pagination.Status, {}, {
                default: (p: any) => {
                  statusProps = p
                  return h('div', p.text)
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      // Initial text is empty
      expect(statusProps.text).toBe('')

      // Trigger page change via navigation
      rootProps.next()
      await nextTick()

      // Wait for the 100ms delay
      vi.advanceTimersByTime(100)
      await nextTick()

      expect(statusProps.text).toContain('2')

      vi.useRealTimers()
    })
  })

  describe('integration', () => {
    it('should render full pagination with navigation', async () => {
      const page = ref(1)

      const wrapper = mount(Pagination.Root, {
        props: {
          'size': 50,
          'itemsPerPage': 10,
          'totalVisible': 5,
          'renderless': true,
          'modelValue': page.value,
          'onUpdate:modelValue': (v: number) => {
            page.value = v
          },
        },
        slots: {
          default: (props: any) => [
            h(Pagination.First, { renderless: true }, {
              default: (p: any) => h('button', { ...p.attrs, class: 'first' }, 'First'),
            }),
            h(Pagination.Prev, { renderless: true }, {
              default: (p: any) => h('button', { ...p.attrs, class: 'prev' }, 'Prev'),
            }),
            ...props.items.map((item: any) =>
              item.type === 'ellipsis'
                ? h(Pagination.Ellipsis, { key: item.id, renderless: true }, {
                    default: (p: any) => h('span', { ...p.attrs, class: 'ellipsis' }, p.ellipsis),
                  })
                : h(Pagination.Item, { key: item.id, value: item.value, renderless: true }, {
                    default: (p: any) => h('button', { ...p.attrs, class: 'item' }, p.page),
                  }),
            ),
            h(Pagination.Next, { renderless: true }, {
              default: (p: any) => h('button', { ...p.attrs, class: 'next' }, 'Next'),
            }),
            h(Pagination.Last, { renderless: true }, {
              default: (p: any) => h('button', { ...p.attrs, class: 'last' }, 'Last'),
            }),
          ],
        },
      })

      await nextTick()

      expect(wrapper.find('.first').exists()).toBe(true)
      expect(wrapper.find('.prev').exists()).toBe(true)
      expect(wrapper.find('.next').exists()).toBe(true)
      expect(wrapper.find('.last').exists()).toBe(true)
      expect(wrapper.findAll('.item').length).toBeGreaterThan(0)
    })

    it('should work with namespace isolation', async () => {
      let pag1Props: any
      let pag2Props: any

      mount(defineComponent({
        render: () => [
          h(Pagination.Root, { size: 100, namespace: 'pag-1', modelValue: 1, renderless: true }, {
            default: (props: any) => {
              pag1Props = props
              return h('div', 'Pagination 1')
            },
          }),
          h(Pagination.Root, { size: 50, namespace: 'pag-2', modelValue: 3, renderless: true }, {
            default: (props: any) => {
              pag2Props = props
              return h('div', 'Pagination 2')
            },
          }),
        ],
      }))

      await nextTick()

      expect(pag1Props.page).toBe(1)
      expect(pag1Props.size).toBe(100)
      expect(pag2Props.page).toBe(3)
      expect(pag2Props.size).toBe(50)
    })
  })

  describe('sSR/Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Pagination.Root as any, { size: 100 }, {
            default: (props: any) =>
              h('div', [
                h('span', `Page ${props.page} of ${props.pages}`),
              ]),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Page 1 of 10')
    })

    it('should render items on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Pagination.Root as any, { size: 50, itemsPerPage: 10, totalVisible: 5, renderless: true }, {
            default: (props: any) =>
              h('nav', props.items.map((item: any) =>
                item.type === 'page'
                  ? h(Pagination.Item as any, { key: item.id, value: item.value, renderless: true }, {
                      default: (p: any) => h('button', { ...p.attrs }, p.page),
                    })
                  : h(Pagination.Ellipsis as any, { key: item.id, renderless: true }, {
                      default: (p: any) => h('span', { ...p.attrs }, '...'),
                    }),
              )),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('aria-current="page"')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Pagination.Root as any, { size: 100, renderless: true }, {
            default: (props: any) =>
              h('nav', [
                h('span', `Page ${props.page}`),
              ]),
          }),
      })

      const ssrApp = createSSRApp(Component)
      const serverHtml = await renderToString(ssrApp)

      const container = document.createElement('div')
      container.innerHTML = serverHtml

      const wrapper = mount(Component, {
        attachTo: container,
      })

      await nextTick()

      expect(wrapper.text()).toContain('Page 1')

      wrapper.unmount()
    })
  })
})
