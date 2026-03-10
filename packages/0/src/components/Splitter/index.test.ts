import { describe, expect, it, vi } from 'vitest'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

import { Splitter, SplitterHandle, SplitterPanel, SplitterRoot } from './index'

function twoPanel (options: {
  orientation?: 'horizontal' | 'vertical'
  disabled?: boolean
  panels?: [Partial<{ defaultSize: number, minSize: number, maxSize: number, collapsible: boolean, collapsedSize: number }>, Partial<{ defaultSize: number, minSize: number, maxSize: number, collapsible: boolean, collapsedSize: number }>]
  onLayout?: (sizes: number[]) => void
} = {}) {
  const {
    orientation = 'horizontal',
    disabled = false,
    panels: [left = {}, right = {}] = [{}, {}],
    onLayout,
  } = options

  return mount(SplitterRoot, {
    props: {
      orientation,
      disabled,
      ...(onLayout ? { onLayout } : {}),
    },
    slots: {
      default: () => [
        h(SplitterPanel as any, {
          defaultSize: left.defaultSize ?? 50,
          minSize: left.minSize ?? 0,
          maxSize: left.maxSize ?? 100,
          collapsible: left.collapsible ?? false,
          collapsedSize: left.collapsedSize ?? 0,
        }),
        h(SplitterHandle as any),
        h(SplitterPanel as any, {
          defaultSize: right.defaultSize ?? 50,
          minSize: right.minSize ?? 0,
          maxSize: right.maxSize ?? 100,
          collapsible: right.collapsible ?? false,
          collapsedSize: right.collapsedSize ?? 0,
        }),
      ],
    },
  })
}

function threePanel (options: {
  sizes?: [number, number, number]
  onLayout?: (sizes: number[]) => void
} = {}) {
  const { sizes = [33, 34, 33], onLayout } = options

  return mount(SplitterRoot, {
    props: {
      orientation: 'horizontal',
      ...(onLayout ? { onLayout } : {}),
    },
    slots: {
      default: () => [
        h(SplitterPanel as any, { defaultSize: sizes[0], minSize: 10 }),
        h(SplitterHandle as any),
        h(SplitterPanel as any, { defaultSize: sizes[1], minSize: 10 }),
        h(SplitterHandle as any),
        h(SplitterPanel as any, { defaultSize: sizes[2], minSize: 10 }),
      ],
    },
  })
}

describe('splitter', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render as a div by default', () => {
        const wrapper = twoPanel()
        expect(wrapper.element.tagName).toBe('DIV')
      })

      it('should apply flex-direction row for horizontal orientation', () => {
        const wrapper = twoPanel({ orientation: 'horizontal' })
        expect(wrapper.element.style.flexDirection).toBe('row')
      })

      it('should apply flex-direction column for vertical orientation', () => {
        const wrapper = twoPanel({ orientation: 'vertical' })
        expect(wrapper.element.style.flexDirection).toBe('column')
      })

      it('should set data-orientation attribute', () => {
        const wrapper = twoPanel({ orientation: 'vertical' })
        expect(wrapper.attributes('data-orientation')).toBe('vertical')
      })

      it('should set display flex', () => {
        const wrapper = twoPanel()
        expect(wrapper.element.style.display).toBe('flex')
      })
    })

    describe('props', () => {
      it('should default to horizontal orientation', () => {
        const wrapper = twoPanel()
        expect(wrapper.attributes('data-orientation')).toBe('horizontal')
        expect(wrapper.element.style.flexDirection).toBe('row')
      })
    })

    describe('slot props', () => {
      it('should expose orientation and isDisabled', () => {
        let captured: any

        mount(SplitterRoot, {
          props: { orientation: 'vertical', disabled: true },
          slots: {
            default: (props: any) => {
              captured = props
              return ''
            },
          },
        })

        expect(captured.orientation).toBe('vertical')
        expect(captured.isDisabled).toBe(true)
      })

      it('should expose distribute function', () => {
        let captured: any

        mount(SplitterRoot, {
          slots: {
            default: (props: any) => {
              captured = props
              return ''
            },
          },
        })

        expect(typeof captured.distribute).toBe('function')
      })

      it('should expose attrs with data-orientation', () => {
        let captured: any

        mount(SplitterRoot, {
          props: { orientation: 'horizontal' },
          slots: {
            default: (props: any) => {
              captured = props
              return ''
            },
          },
        })

        expect(captured.attrs['data-orientation']).toBe('horizontal')
      })
    })

    describe('events', () => {
      it('should emit layout on distribute', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({ onLayout })

        await nextTick()
        onLayout.mockClear()

        wrapper.vm.distribute([60, 40])
        expect(onLayout).toHaveBeenCalledWith([60, 40])
      })
    })

    describe('expose', () => {
      it('should expose distribute method', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({ onLayout })

        await nextTick()
        onLayout.mockClear()

        wrapper.vm.distribute([70, 30])
        expect(onLayout).toHaveBeenCalledWith([70, 30])
      })
    })

    describe('auto-redistribute', () => {
      it('should distribute evenly when panels total does not equal 100', async () => {
        const onLayout = vi.fn()

        mount(SplitterRoot, {
          props: { onLayout },
          slots: {
            default: () => [
              h(SplitterPanel as any, { defaultSize: 30 }),
              h(SplitterPanel as any, { defaultSize: 30 }),
            ],
          },
        })

        await nextTick()

        // distribute is called, sizes should sum to 100
        expect(onLayout).toHaveBeenCalled()
        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes.reduce((a: number, b: number) => a + b, 0)).toBe(100)
      })

      it('should not redistribute when panels already total 100', async () => {
        const onLayout = vi.fn()

        twoPanel({ onLayout })

        await nextTick()

        // Should not emit layout since 50+50=100
        expect(onLayout).not.toHaveBeenCalled()
      })

      it('should redistribute when a panel is removed', async () => {
        const show = ref(true)
        const onLayout = vi.fn()

        mount(SplitterRoot, {
          props: { onLayout },
          slots: {
            default: () => {
              const children = [
                h(SplitterPanel as any, { defaultSize: 33 }),
                h(SplitterHandle as any),
                h(SplitterPanel as any, { defaultSize: 34 }),
              ]
              if (show.value) {
                children.push(
                  h(SplitterHandle as any),
                  h(SplitterPanel as any, { defaultSize: 33 }),
                )
              }
              return children
            },
          },
        })

        await nextTick()
        onLayout.mockClear()

        show.value = false
        await nextTick()
        await nextTick()

        expect(onLayout).toHaveBeenCalled()
        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes.reduce((a: number, b: number) => a + b, 0)).toBe(100)
      })
    })
  })

  describe('panel', () => {
    describe('rendering', () => {
      it('should render as a div by default', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(panels[0]!.element.tagName).toBe('DIV')
      })

      it('should set flex-basis based on size', async () => {
        const wrapper = twoPanel({
          panels: [{ defaultSize: 60 }, { defaultSize: 40 }],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(panels[0]!.element.style.flexBasis).toBe('60%')
        expect(panels[1]!.element.style.flexBasis).toBe('40%')
      })

      it('should set flex-grow to 0 and flex-shrink to 0', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const panel = wrapper.findComponent(SplitterPanel as any)
        expect(panel.element.style.flexGrow).toBe('0')
        expect(panel.element.style.flexShrink).toBe('0')
      })

      it('should set overflow hidden', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const panel = wrapper.findComponent(SplitterPanel as any)
        expect(panel.element.style.overflow).toBe('hidden')
      })

      it('should set data-orientation attribute', async () => {
        const wrapper = twoPanel({ orientation: 'vertical' })
        await nextTick()

        const panel = wrapper.findComponent(SplitterPanel as any)
        expect(panel.attributes('data-orientation')).toBe('vertical')
      })

      it('should set data-panel-index attribute', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(panels[0]!.attributes('data-panel-index')).toBe('0')
        expect(panels[1]!.attributes('data-panel-index')).toBe('1')
      })
    })

    describe('expose', () => {
      it('should expose size ref', async () => {
        const wrapper = twoPanel({
          panels: [{ defaultSize: 60 }, { defaultSize: 40 }],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(panels[0]!.vm.size).toBe(60)
        expect(panels[1]!.vm.size).toBe(40)
      })

      it('should expose collapse and expand methods', async () => {
        const wrapper = twoPanel({
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40, minSize: 10 },
          ],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(typeof panels[0]!.vm.collapse).toBe('function')
        expect(typeof panels[0]!.vm.expand).toBe('function')
      })

      it('should expose isCollapsed ref', async () => {
        const wrapper = twoPanel({
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(panels[0]!.vm.isCollapsed).toBe(false)
      })
    })

    describe('collapse and expand', () => {
      it('should collapse a panel', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        panels[0]!.vm.collapse()
        await nextTick()

        expect(panels[0]!.vm.isCollapsed).toBe(true)
        expect(panels[0]!.vm.size).toBe(0)
      })

      it('should expand a collapsed panel', async () => {
        const wrapper = twoPanel({
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        panels[0]!.vm.collapse()
        await nextTick()

        expect(panels[0]!.vm.isCollapsed).toBe(true)

        panels[0]!.vm.expand()
        await nextTick()

        expect(panels[0]!.vm.isCollapsed).toBe(false)
        expect(panels[0]!.vm.size).toBeGreaterThan(0)
      })

      it('should set data-collapsed attribute when collapsed', async () => {
        const wrapper = twoPanel({
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        panels[0]!.vm.collapse()
        await nextTick()

        expect(panels[0]!.attributes('data-collapsed')).toBe('true')
      })
    })

    describe('events', () => {
      it('should emit resize when size changes', async () => {
        const wrapper = twoPanel({
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        panels[0]!.vm.collapse()
        await nextTick()

        const events = panels[0]!.emitted('resize') ?? []
        expect(events.length).toBeGreaterThan(0)
      })
    })

    describe('v-model:collapsed', () => {
      it('should sync v-model:collapsed with internal state', async () => {
        const collapsed = ref(false)

        const wrapper = mount(SplitterRoot, {
          slots: {
            default: () => [
              h(SplitterPanel as any, {
                'defaultSize': 60,
                'collapsible': true,
                'collapsedSize': 0,
                'minSize': 20,
                'collapsed': collapsed.value,
                'onUpdate:collapsed': (val: boolean) => {
                  collapsed.value = val
                },
              }),
              h(SplitterHandle as any),
              h(SplitterPanel as any, { defaultSize: 40 }),
            ],
          },
        })
        await nextTick()

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        panels[0]!.vm.collapse()
        await nextTick()

        expect(collapsed.value).toBe(true)
      })
    })
  })

  describe('handle', () => {
    describe('rendering', () => {
      it('should render as a div by default', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.element.tagName).toBe('DIV')
      })

      it('should set role=separator', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('role')).toBe('separator')
      })

      it('should set tabindex=0 when not disabled', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('tabindex')).toBe('0')
      })

      it('should set tabindex=-1 when disabled', async () => {
        const wrapper = twoPanel({ disabled: true })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('tabindex')).toBe('-1')
      })

      it('should set data-state to inactive by default', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('data-state')).toBe('inactive')
      })

      it('should set data-orientation matching parent', async () => {
        const wrapper = twoPanel({ orientation: 'vertical' })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('data-orientation')).toBe('vertical')
      })
    })

    describe('accessibility', () => {
      it('should set aria-orientation perpendicular to splitter orientation', async () => {
        const horizontal = twoPanel({ orientation: 'horizontal' })
        await nextTick()

        const hHandle = horizontal.findComponent(SplitterHandle as any)
        expect(hHandle.attributes('aria-orientation')).toBe('vertical')

        const vertical = twoPanel({ orientation: 'vertical' })
        await nextTick()

        const vHandle = vertical.findComponent(SplitterHandle as any)
        expect(vHandle.attributes('aria-orientation')).toBe('horizontal')
      })

      it('should set aria-valuenow to panel size', async () => {
        const wrapper = twoPanel({
          panels: [{ defaultSize: 60 }, { defaultSize: 40 }],
        })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('aria-valuenow')).toBe('60')
      })

      it('should set aria-valuemin based on panel constraints', async () => {
        const wrapper = twoPanel({
          panels: [{ defaultSize: 60, minSize: 20 }, { defaultSize: 40 }],
        })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('aria-valuemin')).toBe('20')
      })

      it('should set aria-controls to the panel id', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        const panel = wrapper.findComponent(SplitterPanel as any)
        const panelId = panel.attributes('id')
        expect(handle.attributes('aria-controls')).toBe(panelId)
      })

      it('should set aria-label when label prop is provided', async () => {
        const wrapper = mount(SplitterRoot, {
          slots: {
            default: () => [
              h(SplitterPanel as any, { defaultSize: 50 }),
              h(SplitterHandle as any, { label: 'Resize panels' }),
              h(SplitterPanel as any, { defaultSize: 50 }),
            ],
          },
        })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('aria-label')).toBe('Resize panels')
      })

      it('should set aria-disabled when disabled', async () => {
        const wrapper = twoPanel({ disabled: true })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        expect(handle.attributes('aria-disabled')).toBe('true')
      })
    })

    describe('keyboard', () => {
      it('should resize on ArrowRight for horizontal splitter', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          orientation: 'horizontal',
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'ArrowRight' })

        expect(onLayout).toHaveBeenCalled()
        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(51)
        expect(sizes[1]).toBe(49)
      })

      it('should resize on ArrowLeft for horizontal splitter', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          orientation: 'horizontal',
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'ArrowLeft' })

        expect(onLayout).toHaveBeenCalled()
        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(49)
        expect(sizes[1]).toBe(51)
      })

      it('should resize on ArrowDown for vertical splitter', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          orientation: 'vertical',
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'ArrowDown' })

        expect(onLayout).toHaveBeenCalled()
        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(51)
        expect(sizes[1]).toBe(49)
      })

      it('should resize on ArrowUp for vertical splitter', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          orientation: 'vertical',
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'ArrowUp' })

        expect(onLayout).toHaveBeenCalled()
        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(49)
        expect(sizes[1]).toBe(51)
      })

      it('should resize by page step on PageDown/PageUp', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'PageDown' })

        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(60)
        expect(sizes[1]).toBe(40)
      })

      it('should resize by negative page step on PageUp', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'PageUp' })

        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(40)
        expect(sizes[1]).toBe(60)
      })

      it('should go to min on Home key', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [{ defaultSize: 50, minSize: 20 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'Home' })

        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(20)
        expect(sizes[1]).toBe(80)
      })

      it('should go to max on End key', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [{ defaultSize: 50, maxSize: 80 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'End' })

        const sizes = onLayout.mock.calls[0]![0] as number[]
        expect(sizes[0]).toBe(80)
        expect(sizes[1]).toBe(20)
      })

      it('should collapse on Home key when collapsible', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'Home' })

        const panels = wrapper.findAllComponents(SplitterPanel as any)
        expect(panels[0]!.vm.isCollapsed).toBe(true)
      })

      it('should expand on End key when collapsed', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          onLayout,
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        // Collapse first
        const panels = wrapper.findAllComponents(SplitterPanel as any)
        panels[0]!.vm.collapse()
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'End' })

        expect(panels[0]!.vm.isCollapsed).toBe(false)
      })

      it('should toggle collapse on Enter key when collapsible', async () => {
        const wrapper = twoPanel({
          panels: [
            { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 20 },
            { defaultSize: 40 },
          ],
        })
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        const panels = wrapper.findAllComponents(SplitterPanel as any)

        // Collapse
        await handle.trigger('keydown', { key: 'Enter' })
        await nextTick()
        expect(panels[0]!.vm.isCollapsed).toBe(true)

        // Expand
        await handle.trigger('keydown', { key: 'Enter' })
        await nextTick()
        expect(panels[0]!.vm.isCollapsed).toBe(false)
      })

      it('should not resize when disabled', async () => {
        const onLayout = vi.fn()
        const wrapper = twoPanel({
          disabled: true,
          onLayout,
          panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
        })
        await nextTick()
        onLayout.mockClear()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('keydown', { key: 'ArrowRight' })

        expect(onLayout).not.toHaveBeenCalled()
      })
    })

    describe('pointer events', () => {
      it('should set data-state to hover on pointerenter', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('pointerenter')

        expect(handle.attributes('data-state')).toBe('hover')
      })

      it('should reset data-state to inactive on pointerleave', async () => {
        const wrapper = twoPanel()
        await nextTick()

        const handle = wrapper.findComponent(SplitterHandle as any)
        await handle.trigger('pointerenter')
        await handle.trigger('pointerleave')

        expect(handle.attributes('data-state')).toBe('inactive')
      })
    })

    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let captured: any

        mount(SplitterRoot, {
          slots: {
            default: () => [
              h(SplitterPanel as any, { defaultSize: 50 }),
              h(SplitterHandle as any, {}, {
                default: (props: any) => {
                  captured = props
                  return h('div')
                },
              }),
              h(SplitterPanel as any, { defaultSize: 50 }),
            ],
          },
        })
        await nextTick()

        expect(captured).toBeDefined()
        expect(captured.isDragging).toBe(false)
        expect(captured.isDisabled).toBe(false)
        expect(captured.state).toBe('inactive')
        expect(captured.attrs.role).toBe('separator')
        expect(captured.attrs.tabindex).toBe(0)
        expect(typeof captured.attrs.onPointerdown).toBe('function')
        expect(typeof captured.attrs.onKeydown).toBe('function')
      })
    })
  })

  describe('integration', () => {
    it('should respect min/max constraints during resize', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 50, minSize: 20, maxSize: 80 },
          { defaultSize: 50, minSize: 20, maxSize: 80 },
        ],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)

      // Try to go past max with many arrow presses
      for (let i = 0; i < 50; i++) {
        await handle.trigger('keydown', { key: 'ArrowRight' })
      }

      const sizes = onLayout.mock.lastCall![0] as number[]
      expect(sizes[0]).toBeLessThanOrEqual(80)
      expect(sizes[1]).toBeGreaterThanOrEqual(20)
    })

    it('should work with three panels', async () => {
      const onLayout = vi.fn()
      const wrapper = threePanel({ sizes: [33, 34, 33], onLayout })
      await nextTick()
      onLayout.mockClear()

      const handles = wrapper.findAllComponents(SplitterHandle as any)
      await handles[0]!.trigger('keydown', { key: 'ArrowRight' })

      expect(onLayout).toHaveBeenCalled()
      const sizes = onLayout.mock.calls[0]![0] as number[]
      expect(sizes[0]).toBe(34)
      expect(sizes[1]).toBe(33)
      // Third panel unchanged
      expect(sizes[2]).toBe(33)
    })

    it('should use compound component namespace', () => {
      expect(Splitter.Root).toBeDefined()
      expect(Splitter.Panel).toBeDefined()
      expect(Splitter.Handle).toBeDefined()
    })

    it('should support renderless mode', () => {
      let captured: any

      mount(SplitterRoot, {
        props: { renderless: true },
        slots: {
          default: (props: any) => {
            captured = props
            return h('div')
          },
        },
      })

      expect(captured).toBeDefined()
      expect(captured.attrs).toBeDefined()
    })

    it('should distribute sizes programmatically', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()
      onLayout.mockClear()

      wrapper.vm.distribute([30, 70])
      expect(onLayout).toHaveBeenCalledWith([30, 70])
    })

    it('should clamp distributed sizes to constraints', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 50, minSize: 20, maxSize: 80 },
          { defaultSize: 50, minSize: 20, maxSize: 80 },
        ],
      })
      await nextTick()
      onLayout.mockClear()

      // Try to distribute beyond constraints
      wrapper.vm.distribute([10, 90])

      const sizes = onLayout.mock.calls[0]![0] as number[]
      expect(sizes[0]).toBeGreaterThanOrEqual(20)
      expect(sizes[1]).toBeLessThanOrEqual(80)
      expect(sizes[0]! + sizes[1]!).toBe(100)
    })
  })
})
