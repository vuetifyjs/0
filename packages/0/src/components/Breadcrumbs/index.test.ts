import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Breadcrumbs, useBreadcrumbsRoot } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { BreadcrumbsPageSlotProps, BreadcrumbsRootSlotProps } from './index'

describe('breadcrumbs', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as nav element by default', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        expect(wrapper.find('nav').exists()).toBe(true)
      })

      it('should render with custom element via as prop', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          props: { as: 'div' },
          slots: {
            default: () => h('span', 'Content'),
          },
        })

        expect(wrapper.find('div').exists()).toBe(true)
        expect(wrapper.find('nav').exists()).toBe(false)
      })

      it('should expose slot props', async () => {
        let slotProps: BreadcrumbsRootSlotProps | undefined

        mount(Breadcrumbs.Root, {
          slots: {
            default: (props: BreadcrumbsRootSlotProps) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps).toBeDefined()
        expect(typeof slotProps!.isOverflowing).toBe('boolean')
        expect(typeof slotProps!.capacity).toBe('number')
        expect(typeof slotProps!.total).toBe('number')
        expect(typeof slotProps!.depth).toBe('number')
        expect(typeof slotProps!.isRoot).toBe('boolean')
        expect(typeof slotProps!.first).toBe('function')
        expect(typeof slotProps!.prev).toBe('function')
        expect(typeof slotProps!.select).toBe('function')
      })
    })

    describe('accessibility', () => {
      it('should have aria-label from locale key', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumbs.label')
      })

      it('should not have role="navigation" when as="nav"', () => {
        const wrapper = mount(Breadcrumbs.Root, {
          slots: {
            default: () => h('div', 'Content'),
          },
        })

        // nav element is already a landmark, role would be redundant
        expect(wrapper.find('nav').attributes('role')).toBeUndefined()
      })

      it('should have role="navigation" when as is not nav', async () => {
        let slotProps: BreadcrumbsRootSlotProps | undefined

        mount(Breadcrumbs.Root, {
          props: { as: 'div' },
          slots: {
            default: (props: BreadcrumbsRootSlotProps) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        await nextTick()

        expect(slotProps!.attrs.role).toBe('navigation')
      })
    })

    describe('default props', () => {
      it('should use default divider "/"', async () => {
        let dividerProps: Record<string, unknown> | undefined

        mount(Breadcrumbs.Root, {
          slots: {
            default: () => h(Breadcrumbs.Divider as never, {}, {
              default: (props: Record<string, unknown>) => {
                dividerProps = props
                return h('span', String(props.divider))
              },
            }),
          },
        })

        await nextTick()

        expect(dividerProps).toBeDefined()
        expect(dividerProps!.divider).toBe('/')
      })

      it('should use custom divider prop', async () => {
        let dividerProps: Record<string, unknown> | undefined

        mount(Breadcrumbs.Root, {
          props: { divider: '>' },
          slots: {
            default: () => h(Breadcrumbs.Divider as never, {}, {
              default: (props: Record<string, unknown>) => {
                dividerProps = props
                return h('span', String(props.divider))
              },
            }),
          },
        })

        await nextTick()

        expect(dividerProps).toBeDefined()
        expect(dividerProps!.divider).toBe('>')
      })
    })
  })

  describe('list', () => {
    it('should render as ol by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, {}, () => h('li', 'Item')),
        },
      })

      await nextTick()

      expect(wrapper.find('ol').exists()).toBe(true)
    })

    it('should have role="list"', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, {}, () => h('li', 'Item')),
        },
      })

      await nextTick()

      expect(wrapper.find('ol').attributes('role')).toBe('list')
    })

    it('should render with custom element via as prop', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, { as: 'ul' }, () => h('li', 'Item')),
        },
      })

      await nextTick()

      expect(wrapper.find('ul').exists()).toBe(true)
    })
  })

  describe('item', () => {
    it('should render as li by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Item as never, {}, () => 'Home'),
        },
      })

      await nextTick()

      expect(wrapper.find('li').exists()).toBe(true)
    })

    it('should expose slot props', async () => {
      let itemProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Item as never, {}, {
            default: (props: Record<string, unknown>) => {
              itemProps = props
              return h('span', 'Home')
            },
          }),
        },
      })

      await nextTick()

      expect(itemProps).toBeDefined()
      expect(itemProps!.id).toBeDefined()
      expect(typeof itemProps!.isSelected).toBe('boolean')
      expect(itemProps!.attrs).toBeDefined()
    })
  })

  describe('link', () => {
    it('should render as anchor by default', () => {
      const wrapper = mount(Breadcrumbs.Link, {
        props: { href: '/home' },
        slots: {
          default: () => 'Home',
        },
      })

      expect(wrapper.find('a').exists()).toBe(true)
    })

    it('should set href attribute', () => {
      const wrapper = mount(Breadcrumbs.Link, {
        props: { href: '/products' },
        slots: {
          default: () => 'Products',
        },
      })

      expect(wrapper.find('a').attributes('href')).toBe('/products')
    })

    it('should render with custom element via as prop', () => {
      const wrapper = mount(Breadcrumbs.Link, {
        props: { as: 'button' },
        attrs: { href: '/home' },
        slots: {
          default: () => 'Home',
        },
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.find('a').exists()).toBe(false)
    })
  })

  describe('page', () => {
    it('should render as span by default', () => {
      const wrapper = mount(Breadcrumbs.Page, {
        slots: {
          default: () => 'Current Page',
        },
      })

      expect(wrapper.find('span').exists()).toBe(true)
    })

    it('should have aria-current="page"', () => {
      const wrapper = mount(Breadcrumbs.Page, {
        slots: {
          default: () => 'Current Page',
        },
      })

      expect(wrapper.find('span').attributes('aria-current')).toBe('page')
    })

    it('should expose slot props with attrs', () => {
      let pageProps: BreadcrumbsPageSlotProps | undefined

      mount(Breadcrumbs.Page, {
        slots: {
          default: (props: BreadcrumbsPageSlotProps) => {
            pageProps = props
            return h('span', 'Current')
          },
        },
      })

      expect(pageProps).toBeDefined()
      expect(pageProps!.attrs['aria-current']).toBe('page')
    })

    it('should render with custom element via as prop', () => {
      const wrapper = mount(Breadcrumbs.Page, {
        props: { as: 'strong' },
        slots: {
          default: () => 'Current Page',
        },
      })

      expect(wrapper.find('strong').exists()).toBe(true)
      expect(wrapper.find('strong').attributes('aria-current')).toBe('page')
    })
  })

  describe('divider', () => {
    it('should render as li by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, () => '/'),
        },
      })

      await nextTick()

      expect(wrapper.find('li').exists()).toBe(true)
    })

    it('should have aria-hidden="true"', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never),
        },
      })

      await nextTick()

      const li = wrapper.find('li')
      expect(li.attributes('aria-hidden')).toBe('true')
    })

    it('should expose slot props with divider text', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', String(props.divider))
            },
          }),
        },
      })

      await nextTick()

      expect(dividerProps).toBeDefined()
      expect(dividerProps!.divider).toBe('/')
      expect(typeof dividerProps!.isSelected).toBe('boolean')
      expect(dividerProps!.id).toBeDefined()
    })

    it('should allow override divider character', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, { divider: '>' }, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', String(props.divider))
            },
          }),
        },
      })

      await nextTick()

      expect(dividerProps!.divider).toBe('>')
    })

    it('should expose attrs with aria-hidden', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', '/')
            },
          }),
        },
      })

      await nextTick()

      const attrs = dividerProps!.attrs as Record<string, unknown>
      expect(attrs['aria-hidden']).toBe('true')
    })
  })

  describe('ellipsis', () => {
    it('should render as li by default', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never),
        },
      })

      await nextTick()

      expect(wrapper.find('li').exists()).toBe(true)
    })

    it('should have aria-hidden="true"', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never),
        },
      })

      await nextTick()

      const li = wrapper.find('li')
      expect(li.attributes('aria-hidden')).toBe('true')
    })

    it('should expose slot props', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps).toBeDefined()
      expect(typeof ellipsisProps!.isSelected).toBe('boolean')
      expect(ellipsisProps!.id).toBeDefined()
      expect(ellipsisProps!.ellipsis).toBeDefined()
    })

    it('should use default ellipsis from root', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { ellipsis: '---' },
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps!.ellipsis).toBe('---')
    })

    it('should allow override ellipsis character', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { ellipsis: '...' },
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, { ellipsis: '***' }, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps!.ellipsis).toBe('***')
    })

    it('should expose attrs with aria-hidden', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', '\u2026')
            },
          }),
        },
      })

      await nextTick()

      const attrs = ellipsisProps!.attrs as Record<string, unknown>
      expect(attrs['aria-hidden']).toBe('true')
    })
  })

  describe('integration', () => {
    it('should render a complete breadcrumbs trail', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.List as never, {}, () => [
            h(Breadcrumbs.Item as never, {}, () =>
              h(Breadcrumbs.Link as never, { href: '/' }, () => 'Home'),
            ),
            h(Breadcrumbs.Divider as never),
            h(Breadcrumbs.Item as never, {}, () =>
              h(Breadcrumbs.Link as never, { href: '/products' }, () => 'Products'),
            ),
            h(Breadcrumbs.Divider as never),
            h(Breadcrumbs.Item as never, {}, () =>
              h(Breadcrumbs.Page as never, {}, () => 'Electronics'),
            ),
          ]),
        },
      })

      await nextTick()

      // Verify structure
      expect(wrapper.find('nav').exists()).toBe(true)
      expect(wrapper.find('ol').exists()).toBe(true)
      expect(wrapper.findAll('li').length).toBeGreaterThan(0)
      expect(wrapper.find('[aria-label="Breadcrumbs.label"]').exists()).toBe(true)
      expect(wrapper.find('[role="list"]').exists()).toBe(true)
    })

    it('should track depth across multiple items', async () => {
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: (props: BreadcrumbsRootSlotProps) => {
            slotProps = props
            return [
              h(Breadcrumbs.Item as never, {}, () => 'Home'),
              h(Breadcrumbs.Item as never, {}, () => 'Products'),
              h(Breadcrumbs.Item as never, {}, () => 'Electronics'),
            ]
          },
        },
      })

      await nextTick()

      expect(slotProps!.depth).toBe(3)
      expect(slotProps!.isRoot).toBe(false)
    })

    it('should register items with both breadcrumbs and group contexts', async () => {
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: (props: BreadcrumbsRootSlotProps) => {
            slotProps = props
            return [
              h(Breadcrumbs.Item as never, {}, () => 'Home'),
              h(Breadcrumbs.Divider as never),
              h(Breadcrumbs.Item as never, {}, () => 'Products'),
              h(Breadcrumbs.Divider as never),
              h(Breadcrumbs.Ellipsis as never),
            ]
          },
        },
      })

      await nextTick()

      // total = group size: 2 items + 2 dividers + 1 ellipsis = 5
      expect(slotProps!.total).toBe(5)
      // depth = breadcrumbs size: only items register with breadcrumbs
      expect(slotProps!.depth).toBe(2)
    })

    it('should unregister items on unmount', async () => {
      const showThird = ref(true)
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(defineComponent({
        setup () {
          return () => h(Breadcrumbs.Root as never, {}, {
            default: (props: BreadcrumbsRootSlotProps) => {
              slotProps = props
              const children = [
                h(Breadcrumbs.Item as never, { key: 'a' }, () => 'Home'),
                h(Breadcrumbs.Item as never, { key: 'b' }, () => 'Products'),
              ]
              if (showThird.value) {
                children.push(h(Breadcrumbs.Item as never, { key: 'c' }, () => 'Electronics'))
              }
              return children
            },
          })
        },
      }))

      await nextTick()
      expect(slotProps!.depth).toBe(3)
      expect(slotProps!.total).toBe(3)

      showThird.value = false
      await nextTick()

      expect(slotProps!.depth).toBe(2)
      expect(slotProps!.total).toBe(2)
    })

    it('should handle dynamic item addition', async () => {
      const items = ref(['Home', 'Products'])
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(defineComponent({
        setup () {
          return () => h(Breadcrumbs.Root as never, {}, {
            default: (props: BreadcrumbsRootSlotProps) => {
              slotProps = props
              return items.value.map(text =>
                h(Breadcrumbs.Item as never, { key: text }, () => text),
              )
            },
          })
        },
      }))

      await nextTick()
      expect(slotProps!.depth).toBe(2)

      items.value = ['Home', 'Products', 'Electronics']
      await nextTick()

      expect(slotProps!.depth).toBe(3)
    })

    it('should work with namespace isolation', async () => {
      let rootProps1: Record<string, unknown> | undefined
      let rootProps2: Record<string, unknown> | undefined

      mount(defineComponent({
        render: () => [
          h(Breadcrumbs.Root as never, { namespace: 'nav-1' }, {
            default: (props: Record<string, unknown>) => {
              rootProps1 = props
              return h(Breadcrumbs.Item as never, { namespace: 'nav-1' }, () => 'Item 1')
            },
          }),
          h(Breadcrumbs.Root as never, { namespace: 'nav-2' }, {
            default: (props: Record<string, unknown>) => {
              rootProps2 = props
              return h(Breadcrumbs.Item as never, { namespace: 'nav-2' }, () => 'Item 2')
            },
          }),
        ],
      }))

      await nextTick()

      // Both roots should be independent
      expect(rootProps1).toBeDefined()
      expect(rootProps2).toBeDefined()
      expect(rootProps1!.depth).toBe(1)
      expect(rootProps2!.depth).toBe(1)
    })

    it('should register ellipsis with group alongside items', async () => {
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: (props: BreadcrumbsRootSlotProps) => {
            slotProps = props
            return [
              h(Breadcrumbs.Item as never, {}, () => 'Home'),
              h(Breadcrumbs.Ellipsis as never),
              h(Breadcrumbs.Item as never, {}, () => 'Products'),
              h(Breadcrumbs.Item as never, {}, () => 'Electronics'),
            ]
          },
        },
      })

      await nextTick()

      // 3 items + 1 ellipsis = 4 group tickets
      expect(slotProps!.total).toBe(4)
      // Only items register with breadcrumbs composable
      expect(slotProps!.depth).toBe(3)
    })

    it('should expose data-selected on items', async () => {
      let itemProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Item as never, {}, {
            default: (props: Record<string, unknown>) => {
              itemProps = props
              return h('span', 'Home')
            },
          }),
        },
      })

      await nextTick()

      const attrs = itemProps!.attrs as Record<string, unknown>
      // Enrolled items start selected
      expect(attrs['data-selected']).toBe(true)
    })

    it('should expose data-selected on dividers', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', '/')
            },
          }),
        },
      })

      await nextTick()

      const attrs = dividerProps!.attrs as Record<string, unknown>
      expect(attrs['data-selected']).toBe(true)
    })

    it('should propagate root divider prop to divider children', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { divider: ' → ' },
        slots: {
          default: () => h(Breadcrumbs.Divider as never, {}, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', String(props.divider))
            },
          }),
        },
      })

      await nextTick()

      expect(dividerProps!.divider).toBe(' → ')
    })

    it('should allow divider child to override root divider', async () => {
      let dividerProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { divider: ' → ' },
        slots: {
          default: () => h(Breadcrumbs.Divider as never, { divider: '|' }, {
            default: (props: Record<string, unknown>) => {
              dividerProps = props
              return h('span', String(props.divider))
            },
          }),
        },
      })

      await nextTick()

      expect(dividerProps!.divider).toBe('|')
    })

    it('should clean up ellipsis and dividers on unmount', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        slots: {
          default: () => [
            h(Breadcrumbs.Item as never, {}, () => 'Home'),
            h(Breadcrumbs.Divider as never),
            h(Breadcrumbs.Ellipsis as never),
            h(Breadcrumbs.Item as never, {}, () => 'Products'),
            h(Breadcrumbs.Divider as never),
          ],
        },
      })

      await nextTick()

      // Verify components registered
      expect(wrapper.findAll('li').length).toBe(5)

      // Unmount triggers onBeforeUnmount for all children
      wrapper.unmount()
    })

    it('should navigate via slot prop first()', async () => {
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: (props: BreadcrumbsRootSlotProps) => {
            slotProps = props
            return [
              h(Breadcrumbs.Item as never, {}, () => 'Home'),
              h(Breadcrumbs.Item as never, {}, () => 'Products'),
              h(Breadcrumbs.Item as never, {}, () => 'Electronics'),
            ]
          },
        },
      })

      await nextTick()
      expect(slotProps!.depth).toBe(3)

      slotProps!.first()
      await nextTick()

      expect(slotProps!.depth).toBe(1)
      expect(slotProps!.isRoot).toBe(true)
    })

    it('should navigate via slot prop prev()', async () => {
      let slotProps: BreadcrumbsRootSlotProps | undefined

      mount(Breadcrumbs.Root, {
        slots: {
          default: (props: BreadcrumbsRootSlotProps) => {
            slotProps = props
            return [
              h(Breadcrumbs.Item as never, {}, () => 'Home'),
              h(Breadcrumbs.Item as never, {}, () => 'Products'),
              h(Breadcrumbs.Item as never, {}, () => 'Electronics'),
            ]
          },
        },
      })

      await nextTick()
      expect(slotProps!.depth).toBe(3)

      slotProps!.prev()
      await nextTick()

      expect(slotProps!.depth).toBe(2)
    })

    it('should use custom label prop for aria-label', async () => {
      const wrapper = mount(Breadcrumbs.Root, {
        props: { label: 'File path' },
        slots: {
          default: () => h('div', 'Content'),
        },
      })

      await nextTick()

      expect(wrapper.find('nav').attributes('aria-label')).toBe('File path')
    })

    it('should propagate root ellipsis prop to ellipsis children', async () => {
      let ellipsisProps: Record<string, unknown> | undefined

      mount(Breadcrumbs.Root, {
        props: { ellipsis: '---' },
        slots: {
          default: () => h(Breadcrumbs.Ellipsis as never, {}, {
            default: (props: Record<string, unknown>) => {
              ellipsisProps = props
              return h('span', String(props.ellipsis))
            },
          }),
        },
      })

      await nextTick()

      expect(ellipsisProps!.ellipsis).toBe('---')
    })
  })

  describe('sSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Breadcrumbs.Root as never, {}, {
            default: () =>
              h(Breadcrumbs.List as never, {}, () => [
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Link as never, { href: '/' }, () => 'Home'),
                ),
                h(Breadcrumbs.Divider as never),
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Page as never, {}, () => 'Current'),
                ),
              ]),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Home')
      expect(html).toContain('Current')
      expect(html).toContain('aria-label="Breadcrumbs.label"')
      expect(html).toContain('role="list"')
      expect(html).toContain('aria-current="page"')
    })

    it('should render accessibility attributes on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Breadcrumbs.Root as never, {}, {
            default: () => [
              h(Breadcrumbs.Divider as never),
              h(Breadcrumbs.Ellipsis as never),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-hidden="true"')
    })

    it('should hydrate without mismatches', async () => {
      const Component = defineComponent({
        render: () =>
          h(Breadcrumbs.Root as never, {}, {
            default: () =>
              h(Breadcrumbs.List as never, {}, () => [
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Link as never, { href: '/' }, () => 'Home'),
                ),
                h(Breadcrumbs.Divider as never),
                h(Breadcrumbs.Item as never, {}, () =>
                  h(Breadcrumbs.Page as never, {}, () => 'Current'),
                ),
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

      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Current')

      wrapper.unmount()
    })
  })
})

// Additional coverage: overflow behavior
describe('overflow behavior', () => {
  let resizeObserverCallback: ResizeObserverCallback | null = null
  let resizeObserverTarget: Element | null = null

  class TestResizeObserver {
    constructor (cb: ResizeObserverCallback) {
      resizeObserverCallback = cb
    }

    observe (el: Element) {
      resizeObserverTarget = el
    }

    unobserve () {}
    disconnect () {}
  }

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver)
    resizeObserverCallback = null
    resizeObserverTarget = null
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function triggerResize (width: number, height = 0): void {
    if (!resizeObserverCallback || !resizeObserverTarget) return
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
    resizeObserverCallback(
      [{
        contentRect: rect,
        target: resizeObserverTarget,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      }],
      {} as ResizeObserver,
    )
  }

  function mountOverflowTree (options: {
    itemCount?: number
    withEllipsis?: boolean
  } = {}) {
    const { itemCount = 4, withEllipsis = true } = options

    let ctx: any

    const Spy = defineComponent({
      setup () {
        ctx = useBreadcrumbsRoot('v0:breadcrumbs')
        return () => null
      },
    })

    const wrapper = mount(Breadcrumbs.Root, {
      slots: {
        default: () => {
          const children: ReturnType<typeof h>[] = []
          for (let i = 0; i < itemCount; i++) {
            children.push(h(Breadcrumbs.Item as never, { key: `item-${i}` }, () => `Item ${i}`))
            if (i < itemCount - 1) {
              children.push(h(Breadcrumbs.Divider as never, { key: `div-${i}` }))
            }
          }
          if (withEllipsis) {
            children.push(h(Breadcrumbs.Ellipsis as never, { key: 'ellipsis' }))
          }
          children.push(h(Spy, { key: 'spy' }))
          return children
        },
      },
    })

    return { wrapper, context: () => ctx }
  }

  it('should hide ellipsis and show content when capacity is sufficient', async () => {
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()
    // Trigger overflow then restore
    triggerResize(5)
    await nextTick()
    triggerResize(0)
    await nextTick()
    for (const t of ctx.group.values()) {
      if (t.type === 'ellipsis') {
        expect(t.isSelected.value).toBe(false)
      } else {
        expect(t.isSelected.value).toBe(true)
      }
    }
  })

  it('should keep first pair visible during overflow', async () => {
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()
    // With 7 content + gap=8 + zero-width, capacity=1 at width=5
    triggerResize(5)
    await nextTick()
    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')
    expect(content[0]!.isSelected.value).toBe(true)
    expect(content[1]!.isSelected.value).toBe(true)
  })

  it('should show last content item when capacity is 0', async () => {
    const { context } = mountOverflowTree({ itemCount: 3, withEllipsis: true })
    await nextTick()
    const ctx = context()
    // Force capacity=0: set reserved > width via ellipsisWidth
    ctx.ellipsisWidth.value = 50
    triggerResize(50)
    await nextTick()
    expect(ctx.overflow.capacity.value).toBe(0)
    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')
    expect(content.at(-1)!.isSelected.value).toBe(true)
  })

  it('should manage visibility via group select/unselect in capacity=0 branch', async () => {
    const { context } = mountOverflowTree({ itemCount: 3, withEllipsis: true })
    await nextTick()
    const ctx = context()
    // Force capacity=0 by making reserved > width
    ctx.ellipsisWidth.value = 100
    triggerResize(50)
    await nextTick()
    expect(ctx.overflow.capacity.value).toBe(0)
    // In capacity=0 branch, specific visibility logic runs
    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')
    // Last content item should always be shown
    expect(content.at(-1)!.isSelected.value).toBe(true)
  })

  it('should hide ellipsis when width < fI + gap + eW + gap', async () => {
    const { context } = mountOverflowTree({ itemCount: 3, withEllipsis: true })
    await nextTick()
    const ctx = context()
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 10 })
    document.body.append(el)
    ctx.measureElement(0, 'item', el)
    ctx.ellipsisWidth.value = 10
    await nextTick()
    triggerResize(20)
    await nextTick()
    for (const t of ctx.group.values()) {
      if (t.type === 'ellipsis') {
        expect(t.isSelected.value).toBe(false)
      }
    }
    el.remove()
  })

  it('should handle measureElement with non-first indices routing to overflow pool', async () => {
    const { context } = mountOverflowTree({ itemCount: 2, withEllipsis: false })
    await nextTick()
    const ctx = context()
    // Calling measureElement with a higher index routes to overflow.measure
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 15 })
    document.body.append(el)
    expect(() => ctx.measureElement(10, 'item', el)).not.toThrow()
    expect(() => ctx.measureElement(10, 'divider', el)).not.toThrow()
    // Unmeasure
    ctx.measureElement(10, 'item', undefined)
    ctx.measureElement(10, 'divider', undefined)
    el.remove()
  })

  it('should exercise measureElement routing', async () => {
    const { context } = mountOverflowTree({ itemCount: 2, withEllipsis: false })
    await nextTick()
    const ctx = context()
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 15 })
    document.body.append(el)
    expect(() => ctx.measureElement(0, 'item', el)).not.toThrow()
    expect(() => ctx.measureElement(0, 'divider', el)).not.toThrow()
    expect(() => ctx.measureElement(5, 'item', el)).not.toThrow()
    ctx.measureElement(0, 'item', undefined)
    ctx.measureElement(0, 'divider', undefined)
    el.remove()
  })

  it('should handle overflow width transitions', async () => {
    const { context } = mountOverflowTree({ itemCount: 5, withEllipsis: true })
    await nextTick()
    const ctx = context()
    expect(ctx.overflow.capacity.value).toBe(Infinity)
    // Force non-Infinity capacity
    triggerResize(5)
    await nextTick()
    expect(ctx.overflow.capacity.value).toBeLessThan(Infinity)
    // Restore to Infinity
    triggerResize(0)
    await nextTick()
    expect(ctx.overflow.capacity.value).toBe(Infinity)
  })

  it('should exercise reserved width with non-zero values', async () => {
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()
    const el = document.createElement('div')
    Object.defineProperty(el, 'offsetWidth', { value: 20 })
    document.body.append(el)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 15
    await nextTick()
    expect(ctx.ellipsisWidth.value).toBe(15)
    el.remove()
  })

  /**
   * Helper to create an element that works with measureToRef in happy-dom.
   * Sets inline margin styles so getComputedStyle returns parseable values.
   */
  function createMeasurableElement (width: number): HTMLElement {
    const el = document.createElement('div')
    el.style.marginLeft = '0px'
    el.style.marginRight = '0px'
    Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true })
    document.body.append(el)
    return el
  }

  it('should trigger reserved() with all three widths non-zero', async () => {
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(30)

    // measureElement(0, 'item') goes through measureToRef -> firstItemWidth
    ctx.measureElement(0, 'item', el)
    // measureElement(0, 'divider') goes through measureToRef -> firstDividerWidth
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 25
    await nextTick()

    // reserved = fI(30)+gap(8) + fD(30)+gap(8) + eW(25)+gap(8) = 109
    // Set width so available < 0 => capacity = 0
    triggerResize(50)
    await nextTick()

    expect(ctx.overflow.capacity.value).toBe(0)
    el.remove()
  })

  it('should exercise overflow branch with capacity=0 and proper reserved', async () => {
    // 4 items + 3 dividers = 7 content + 1 ellipsis
    // measuredCount = max(0, 7-2) = 5; capacity=0 < 5 triggers overflow
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(20)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 20
    await nextTick()

    // reserved = 20+8+20+8+20+8 = 84; width=80 => available=-4 => capacity=0
    triggerResize(80)
    await nextTick()

    expect(ctx.overflow.capacity.value).toBe(0)

    // Ellipsis should be shown (line 192)
    for (const t of ctx.group.values()) {
      if (t.type === 'ellipsis') {
        expect(t.isSelected.value).toBe(true)
      }
    }

    // First pair (contentTickets[0], contentTickets[1]) should be shown (lines 194-196)
    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')
    expect(content[0]!.isSelected.value).toBe(true)

    // Last content item should be shown (line 219)
    expect(content.at(-1)!.isSelected.value).toBe(true)

    el.remove()
  })

  it('should hide middle items in overflow (capacity=0)', async () => {
    // 5 items + 4 dividers = 9 content
    const { context } = mountOverflowTree({ itemCount: 5, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(15)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 15
    await nextTick()

    // reserved = 15+8+15+8+15+8 = 69; width=60 => capacity=0
    triggerResize(60)
    await nextTick()

    expect(ctx.overflow.capacity.value).toBe(0)

    // Pool items (indices 2..7) should be hidden except last
    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')
    let hiddenCount = 0
    for (let i = 2; i < content.length - 1; i++) {
      if (!content[i]!.isSelected.value) hiddenCount++
    }
    expect(hiddenCount).toBeGreaterThan(0)

    el.remove()
  })

  it('should hide first divider when w < reserved + fD in capacity=0', async () => {
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(20)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 20
    await nextTick()

    // fI=20, fD=20, eW=20, gap=8
    // reserved = 20+8+20+8+20+8 = 84; fD=20
    // w < reserved + fD = 84+20 = 104 => need w < 104 AND w > 0 for non-Infinity
    // And available = w - 84 < 0 => w < 84 for capacity=0
    triggerResize(60)
    await nextTick()

    expect(ctx.overflow.capacity.value).toBe(0)

    // w=60 < reserved(84) + fD(20) = 104 => hide contentTickets[1]
    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')
    expect(content[1]!.isSelected.value).toBe(false)

    el.remove()
  })

  it('should hide ellipsis when w < fI + gap + eW + gap in capacity=0', async () => {
    const { context } = mountOverflowTree({ itemCount: 3, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(20)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 20
    await nextTick()

    // fI=20, eW=20, gap=8
    // w < fI+gap+eW+gap = 20+8+20+8 = 56
    triggerResize(40)
    await nextTick()

    expect(ctx.overflow.capacity.value).toBe(0)

    // Ellipsis should be hidden
    for (const t of ctx.group.values()) {
      if (t.type === 'ellipsis') {
        expect(t.isSelected.value).toBe(false)
      }
    }

    el.remove()
  })

  it('should hide first item when w < fI + gap in capacity=0', async () => {
    const { context } = mountOverflowTree({ itemCount: 3, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(20)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 20
    await nextTick()

    // fI=20, gap=8 => w < 28
    triggerResize(10)
    await nextTick()

    expect(ctx.overflow.capacity.value).toBe(0)

    // First content item should be hidden
    const content = ctx.group.values().find((t: { type: string }) => t.type !== 'ellipsis')
    expect(content!.isSelected.value).toBe(false)

    el.remove()
  })

  it('should transition from overflow back to sufficient capacity', async () => {
    const { context } = mountOverflowTree({ itemCount: 4, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(15)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 15
    await nextTick()

    // First trigger overflow (capacity=0)
    triggerResize(30)
    await nextTick()
    expect(ctx.overflow.capacity.value).toBe(0)

    // Then restore: width=0 => capacity=Infinity
    triggerResize(0)
    await nextTick()
    expect(ctx.overflow.capacity.value).toBe(Infinity)

    // All content should be shown, ellipsis hidden (lines 185-189)
    for (const t of ctx.group.values()) {
      if (t.type === 'ellipsis') {
        expect(t.isSelected.value).toBe(false)
      } else {
        expect(t.isSelected.value).toBe(true)
      }
    }

    el.remove()
  })

  it('should exercise overflow with pool items and non-zero capacity', async () => {
    // 5 items + 4 dividers = 9 content; measuredCount = max(0, 9-2) = 7
    const { context } = mountOverflowTree({ itemCount: 5, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(10)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 10

    // Also measure pool items so variable mode capacity is non-zero but < measuredCount
    for (let i = 2; i <= 8; i++) {
      ctx.overflow.measure(i, el)
    }
    await nextTick()

    // reserved = 10+8+10+8+10+8 = 54
    // Pool: 7 items at width=10, gap=8, reversed
    // For capacity=2: item8(10) + item7(10+8=18) = 28 <= available
    // item6(10+8=18) would be 46
    // Need available ~ 28..45 for capacity=2; width = 54+28..54+45 = 82..99
    triggerResize(82)
    await nextTick()

    const capacity = ctx.overflow.capacity.value
    // capacity should be small (overflow mode: capacity < measuredCount=7)
    expect(capacity).toBeGreaterThanOrEqual(1)
    expect(capacity).toBeLessThan(7)

    // Ellipsis should be selected
    for (const t of ctx.group.values()) {
      if (t.type === 'ellipsis') {
        expect(t.isSelected.value).toBe(true)
      }
    }

    el.remove()
  })

  it('should select separator divider before shown item in overflow', async () => {
    // Content: item0(0), div0(1), item1(2), div1(3), item2(4), div2(5), item3(6), div3(7), item4(8)
    // poolStart=2, measuredCount = max(0, 9-2) = 7
    const { context } = mountOverflowTree({ itemCount: 5, withEllipsis: true })
    await nextTick()
    const ctx = context()

    const el = createMeasurableElement(10)
    ctx.measureElement(0, 'item', el)
    ctx.measureElement(0, 'divider', el)
    ctx.ellipsisWidth.value = 10

    // Measure pool items so capacity is finite
    for (let i = 2; i <= 8; i++) {
      ctx.overflow.measure(i, el)
    }
    await nextTick()

    // For capacity=1: available=10, width=54+10=64 to 54+27=81
    // showStart = 8-1+1 = 8 (item4), sep = 7 (div3)
    triggerResize(64)
    await nextTick()

    const capacity = ctx.overflow.capacity.value
    expect(capacity).toBe(1)

    const content = ctx.group.values().filter((t: { type: string }) => t.type !== 'ellipsis')

    // contentTickets[8] = item4 should be selected (it's the shown item)
    expect(content[8]!.isSelected.value).toBe(true)

    // contentTickets[7] = div3 should be selected as separator (lines 213-215)
    expect(content[7]!.isSelected.value).toBe(true)

    // contentTickets[6] = item3 should be hidden (unselected)
    expect(content[6]!.isSelected.value).toBe(false)

    el.remove()
  })
})
