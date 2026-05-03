import { describe, expect, it, vi } from 'vitest'

import { Splitter, SplitterHandle, SplitterPanel, SplitterRoot } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

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

    it('should ignore distribute when size count mismatches panel count', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()
      onLayout.mockClear()

      wrapper.vm.distribute([30, 40, 30])
      expect(onLayout).not.toHaveBeenCalled()
    })

    it('should handle distribute with negative remainder correction', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 50, minSize: 0, maxSize: 60 },
          { defaultSize: 50, minSize: 0, maxSize: 60 },
        ],
      })
      await nextTick()
      onLayout.mockClear()

      // Both clamped to 60 = 120 total, need to subtract 20 via remainder
      wrapper.vm.distribute([80, 80])

      const sizes = onLayout.mock.calls[0]![0] as number[]
      expect(sizes[0]! + sizes[1]!).toBe(100)
    })

    it('should update collapsed state during distribute', async () => {
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

      // Distribute with first panel at collapsed size
      wrapper.vm.distribute([0, 100])

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      expect(panels[0]!.vm.isCollapsed).toBe(true)
    })

    it('should re-expand from collapsed state via distribute', async () => {
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

      wrapper.vm.distribute([60, 40])
      await nextTick()
      expect(panels[0]!.vm.isCollapsed).toBe(false)
    })
  })

  describe('collapse edge cases', () => {
    it('should cascade remaining size to other panels when neighbor is full', async () => {
      const onLayout = vi.fn()

      const wrapper = mount(SplitterRoot, {
        props: { onLayout },
        slots: {
          default: () => [
            h(SplitterPanel as any, {
              defaultSize: 40,
              collapsible: true,
              collapsedSize: 0,
              minSize: 20,
            }),
            h(SplitterHandle as any),
            h(SplitterPanel as any, {
              defaultSize: 30,
              minSize: 10,
              maxSize: 35,
            }),
            h(SplitterHandle as any),
            h(SplitterPanel as any, {
              defaultSize: 30,
              minSize: 10,
            }),
          ],
        },
      })
      await nextTick()
      onLayout.mockClear()

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0]!.vm.collapse()
      await nextTick()

      // First panel should be collapsed
      expect(panels[0]!.vm.isCollapsed).toBe(true)
      // Total should still be 100
      const total = panels.reduce((sum: number, p: any) => sum + p.vm.size, 0)
      expect(total).toBe(100)
    })

    it('should not collapse a non-collapsible panel', async () => {
      const wrapper = twoPanel({
        panels: [
          { defaultSize: 50, collapsible: false },
          { defaultSize: 50 },
        ],
      })
      await nextTick()

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      // collapse() is a no-op because collapsible=false
      panels[0]!.vm.collapse()
      await nextTick()
      expect(panels[0]!.vm.isCollapsed).toBe(false)
      expect(panels[0]!.vm.size).toBe(50)
    })

    it('should not expand an already expanded panel', async () => {
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

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      // Panel is not collapsed, expand should be no-op
      panels[0]!.vm.expand()
      await nextTick()
      expect(onLayout).not.toHaveBeenCalled()
    })

    it('should not expand if available space is less than minSize', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 60, collapsible: true, collapsedSize: 0, minSize: 50 },
          { defaultSize: 40, minSize: 38 },
        ],
      })
      await nextTick()

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0]!.vm.collapse()
      await nextTick()
      expect(panels[0]!.vm.isCollapsed).toBe(true)
      onLayout.mockClear()

      // Neighbor has size ~100, minSize=38, available=62
      // target = min(defaultSize=60, maxSize=100) = 60, diff = 60, take = min(60, 62) = 60
      // collapsedSize + take = 60 >= minSize=50, so it expands
      panels[0]!.vm.expand()
      await nextTick()

      expect(panels[0]!.vm.isCollapsed).toBe(false)
      expect(panels[0]!.vm.size).toBe(60)
    })

    it('should resize first panel to max via End key on handle', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 40, maxSize: 80 },
          { defaultSize: 60 },
        ],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      await handle.trigger('keydown', { key: 'End' })
      await nextTick()

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      expect(panels[0]!.vm.size).toBe(80)
    })

    it('should handle collapse when remaining space cannot be fully absorbed', async () => {
      const onLayout = vi.fn()

      const wrapper = mount(SplitterRoot, {
        props: { onLayout },
        slots: {
          default: () => [
            h(SplitterPanel as any, {
              defaultSize: 50,
              collapsible: true,
              collapsedSize: 0,
              minSize: 20,
            }),
            h(SplitterHandle as any),
            h(SplitterPanel as any, {
              defaultSize: 50,
              minSize: 0,
              maxSize: 55,
            }),
          ],
        },
      })
      await nextTick()
      onLayout.mockClear()

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0]!.vm.collapse()
      await nextTick()

      // Neighbor maxes out at 55, remaining 50-55=? goes back to collapsed panel
      // or to other panels. With only one neighbor, remainder goes back
      const total = panels.reduce((sum: number, p: any) => sum + p.vm.size, 0)
      expect(total).toBe(100)
    })
  })

  describe('handle drag interaction', () => {
    it('should set data-state to drag on pointerdown', async () => {
      const wrapper = twoPanel({
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement

      // Mock setPointerCapture
      handleEl.setPointerCapture = vi.fn()

      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 100,
        clientY: 50,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      expect(handle.attributes('data-state')).toBe('drag')
    })

    it('should not start drag when disabled', async () => {
      const wrapper = twoPanel({
        disabled: true,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement
      handleEl.setPointerCapture = vi.fn()

      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 100,
        clientY: 50,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      expect(handle.attributes('data-state')).toBe('inactive')
    })

    it('should resize on pointermove and emit layout on pointerup', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement
      handleEl.setPointerCapture = vi.fn()

      // Mock root element dimensions
      const rootEl = wrapper.element as HTMLElement
      Object.defineProperty(rootEl, 'offsetWidth', { value: 1000, configurable: true })

      // Start drag
      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 500,
        clientY: 50,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      // Move pointer by 100px = 10% of 1000px root
      document.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 600,
        clientY: 50,
        bubbles: true,
      }))

      // requestAnimationFrame tick
      await new Promise(resolve => requestAnimationFrame(resolve))
      await nextTick()

      // End drag
      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      await nextTick()

      // Should have emitted layout on pointerup
      expect(onLayout).toHaveBeenCalled()
      expect(handle.attributes('data-state')).not.toBe('drag')
    })

    it('should handle vertical drag', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        orientation: 'vertical',
        onLayout,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement
      handleEl.setPointerCapture = vi.fn()

      const rootEl = wrapper.element as HTMLElement
      Object.defineProperty(rootEl, 'offsetHeight', { value: 1000, configurable: true })

      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 50,
        clientY: 500,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      document.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 50,
        clientY: 600,
        bubbles: true,
      }))

      await new Promise(resolve => requestAnimationFrame(resolve))
      await nextTick()

      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      await nextTick()

      expect(onLayout).toHaveBeenCalled()
    })
  })

  describe('handle keyboard edge cases', () => {
    it('should not respond to Enter on non-collapsible panel', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 50, collapsible: false },
          { defaultSize: 50 },
        ],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      await handle.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(onLayout).not.toHaveBeenCalled()
    })

    it('should handle unrecognized keys without error', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      await handle.trigger('keydown', { key: 'Tab' })
      await nextTick()

      expect(onLayout).not.toHaveBeenCalled()
    })
  })

  describe('panel v-model:collapsed driven externally', () => {
    it('should collapse when v-model:collapsed changes to true', async () => {
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
      expect(panels[0]!.vm.isCollapsed).toBe(false)

      // Drive collapse externally
      collapsed.value = true
      await nextTick()
      await nextTick()

      expect(panels[0]!.vm.isCollapsed).toBe(true)
    })

    it('should expand when v-model:collapsed changes to false', async () => {
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

      // Collapse first
      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0]!.vm.collapse()
      await nextTick()
      expect(collapsed.value).toBe(true)

      // Drive expand externally
      collapsed.value = false
      await nextTick()
      await nextTick()

      expect(panels[0]!.vm.isCollapsed).toBe(false)
    })
  })

  describe('resize with collapsible effectiveMin', () => {
    it('should use collapsedSize as effectiveMin when panel is collapsed', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 60, collapsible: true, collapsedSize: 5, minSize: 20 },
          { defaultSize: 40 },
        ],
      })
      await nextTick()

      // Collapse
      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0]!.vm.collapse()
      await nextTick()
      onLayout.mockClear()

      // Now resize with the panel collapsed — effectiveMin should be collapsedSize (5)
      const handle = wrapper.findComponent(SplitterHandle as any)
      await handle.trigger('keydown', { key: 'ArrowLeft' })
      await nextTick()

      expect(onLayout).toHaveBeenCalled()
      const sizes = onLayout.mock.calls[0]![0] as number[]
      expect(sizes[0]).toBeGreaterThanOrEqual(4) // can go as low as collapsedSize
    })

    it('should auto-select panel when resize pushes it above collapsedSize', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 60, collapsible: true, collapsedSize: 5, minSize: 20 },
          { defaultSize: 40 },
        ],
      })
      await nextTick()

      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0]!.vm.collapse()
      await nextTick()
      onLayout.mockClear()

      // Resize to push panel above collapsedSize
      const handle = wrapper.findComponent(SplitterHandle as any)
      for (let i = 0; i < 10; i++) {
        await handle.trigger('keydown', { key: 'ArrowRight' })
      }
      await nextTick()

      expect(panels[0]!.vm.size).toBeGreaterThan(5)
      expect(panels[0]!.vm.isCollapsed).toBe(false)
    })
  })

  describe('drag expand from collapsed', () => {
    it('should expand a collapsed panel when dragged past threshold', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [
          { defaultSize: 50, collapsible: true, collapsedSize: 0, minSize: 15 },
          { defaultSize: 50 },
        ],
      })
      await nextTick()

      // Collapse the first panel
      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0].vm.collapse()
      await nextTick()
      expect(panels[0].vm.isCollapsed).toBe(true)
      expect(panels[0].vm.size).toBe(0)
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement
      handleEl.setPointerCapture = vi.fn()

      const rootEl = wrapper.element as HTMLElement
      Object.defineProperty(rootEl, 'offsetWidth', { value: 1000, configurable: true })

      // Start drag
      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 0,
        clientY: 50,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      // Drag past EXPAND_THRESHOLD (10%) — move 120px = 12%
      document.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 120,
        clientY: 50,
        bubbles: true,
      }))
      await new Promise(resolve => requestAnimationFrame(resolve))
      await nextTick()

      // Panel should be expanded and track cursor (12%), not snap to minSize (15%)
      expect(panels[0].vm.isCollapsed).toBe(false)
      expect(panels[0].vm.size).toBe(12)
    })

    it('should allow panel to stay below minSize during drag', async () => {
      const wrapper = twoPanel({
        panels: [
          { defaultSize: 50, collapsible: true, collapsedSize: 0, minSize: 15 },
          { defaultSize: 50 },
        ],
      })
      await nextTick()

      // Collapse, then expand via drag just past threshold
      const panels = wrapper.findAllComponents(SplitterPanel as any)
      panels[0].vm.collapse()
      await nextTick()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement
      handleEl.setPointerCapture = vi.fn()

      const rootEl = wrapper.element as HTMLElement
      Object.defineProperty(rootEl, 'offsetWidth', { value: 1000, configurable: true })

      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 0,
        clientY: 50,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      // Drag to 11% — just past threshold, below minSize (15%)
      document.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 110,
        clientY: 50,
        bubbles: true,
      }))
      await new Promise(resolve => requestAnimationFrame(resolve))
      await nextTick()

      expect(panels[0].vm.isCollapsed).toBe(false)
      expect(panels[0].vm.size).toBe(11)

      // Continue drag to 13% — still below minSize, should track cursor
      document.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 130,
        clientY: 50,
        bubbles: true,
      }))
      await new Promise(resolve => requestAnimationFrame(resolve))
      await nextTick()

      expect(panels[0].vm.size).toBe(13)
    })
  })

  describe('onEndDrag emits layout', () => {
    it('should emit layout when drag ends', async () => {
      const onLayout = vi.fn()
      const wrapper = twoPanel({
        onLayout,
        panels: [{ defaultSize: 50 }, { defaultSize: 50 }],
      })
      await nextTick()
      onLayout.mockClear()

      const handle = wrapper.findComponent(SplitterHandle as any)
      const handleEl = handle.element as HTMLElement
      handleEl.setPointerCapture = vi.fn()

      handleEl.dispatchEvent(new PointerEvent('pointerdown', {
        button: 0,
        clientX: 100,
        clientY: 50,
        bubbles: true,
        pointerId: 1,
      }))
      await nextTick()

      document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
      await nextTick()

      expect(onLayout).toHaveBeenCalled()
    })
  })
})
