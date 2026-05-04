import { describe, expect, it } from 'vitest'

import { Toggle } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'

// Types
import type { VueWrapper } from '@vue/test-utils'

// ============================================================================
// Test Helpers
// ============================================================================

interface MountResult<T = any> {
  wrapper: VueWrapper
  props: () => T
  wait: () => Promise<void>
}

/**
 * Mount a standalone Toggle.Root with slot prop capture
 */
function mountToggle (options: {
  props?: Record<string, unknown>
  model?: Ref<boolean>
} = {}): MountResult {
  let capturedProps: any

  const wrapper = mount(Toggle.Root, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v as boolean
        },
      }),
      ...options.props,
    },
    slots: {
      default: (props: any) => {
        capturedProps = props
        return h('span', 'Toggle')
      },
    },
  })

  return {
    wrapper,
    props: () => capturedProps,
    wait: () => nextTick(),
  }
}

/**
 * Mount a Toggle.Group with items and slot prop capture
 */
function mountGroup (options: {
  props?: Record<string, unknown>
  model?: Ref
  items?: Array<{ value: string, disabled?: boolean }>
} = {}) {
  const items = options.items ?? [{ value: 'a' }, { value: 'b' }, { value: 'c' }]
  let groupProps: any
  const itemProps: Record<string, any> = {}

  const wrapper = mount(Toggle.Group, {
    props: {
      ...(options.model && {
        'modelValue': options.model.value,
        'onUpdate:modelValue': (v: unknown) => {
          options.model!.value = v
        },
      }),
      ...options.props,
    },
    slots: {
      default: (props: any) => {
        groupProps = props
        return items.map(item =>
          h(Toggle.Root as any, {
            value: item.value,
            disabled: item.disabled,
          }, {
            default: (p: any) => {
              itemProps[item.value] = p
              return h('span', item.value)
            },
          }),
        )
      },
    },
  })

  return {
    wrapper,
    groupProps: () => groupProps,
    itemProps: (key: string) => itemProps[key],
    wait: () => nextTick(),
  }
}

// ============================================================================
// Standalone Mode
// ============================================================================

describe('toggle.Root (standalone)', () => {
  it('should render as a button by default', () => {
    const { wrapper } = mountToggle()

    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('should have type="button"', () => {
    const { wrapper } = mountToggle()

    expect(wrapper.attributes('type')).toBe('button')
  })

  it('should start unpressed without v-model', () => {
    const { props } = mountToggle()

    expect(props().isPressed).toBe(false)
    expect(props().attrs['aria-pressed']).toBe(false)
    expect(props().attrs['data-state']).toBe('off')
  })

  it('should reflect v-model as pressed state', () => {
    const model = ref(true)
    const { props } = mountToggle({ model })

    expect(props().isPressed).toBe(true)
    expect(props().attrs['aria-pressed']).toBe(true)
    expect(props().attrs['data-state']).toBe('on')
  })

  it('should toggle v-model on click', async () => {
    const model = ref(false)
    const { wrapper, props, wait } = mountToggle({ model })

    await wrapper.trigger('click')
    await wait()

    expect(model.value).toBe(true)
    expect(props().isPressed).toBe(true)

    await wrapper.trigger('click')
    await wait()

    expect(model.value).toBe(false)
    expect(props().isPressed).toBe(false)
  })

  it('should toggle on Space key', async () => {
    const model = ref(false)
    const { wrapper, wait } = mountToggle({ model })

    await wrapper.trigger('keydown', { key: ' ' })
    await wait()

    expect(model.value).toBe(true)
  })

  it('should toggle on Enter key via native button behavior', async () => {
    const model = ref(false)
    const { wrapper, wait } = mountToggle({ model })

    // Native buttons fire click on Enter, so trigger click directly
    await wrapper.trigger('click')
    await wait()

    expect(model.value).toBe(true)
  })

  it('should not toggle when disabled', async () => {
    const model = ref(false)
    const { wrapper, props, wait } = mountToggle({
      model,
      props: { disabled: true },
    })

    await wrapper.trigger('click')
    await wait()

    expect(model.value).toBe(false)
    expect(props().isDisabled).toBe(true)
    expect(props().attrs['aria-disabled']).toBe(true)
    expect(props().attrs['data-disabled']).toBe(true)
  })

  it('should expose toggle function in slot props', () => {
    const { props } = mountToggle()

    expect(typeof props().toggle).toBe('function')
  })
})

// ============================================================================
// Group Mode (single select)
// ============================================================================

describe('toggle.Group (single select)', () => {
  it('should render as a div with role="group"', () => {
    const { wrapper } = mountGroup()

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('should set aria-orientation', () => {
    const { wrapper } = mountGroup({
      props: { orientation: 'vertical' },
    })

    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
  })

  it('should default to horizontal orientation', () => {
    const { wrapper } = mountGroup()

    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
  })

  it('should select item on click', async () => {
    const model = ref<string | undefined>(undefined)
    const { wrapper, itemProps, wait } = mountGroup({ model })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await wait()

    expect(model.value).toBe('a')
    expect(itemProps('a').isPressed).toBe(true)
    expect(itemProps('b').isPressed).toBe(false)
  })

  it('should enforce single selection', async () => {
    const model = ref<string | undefined>(undefined)
    const { wrapper, itemProps, wait } = mountGroup({ model })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await wait()

    expect(itemProps('a').isPressed).toBe(true)

    await buttons[1].trigger('click')
    await wait()

    expect(model.value).toBe('b')
    expect(itemProps('a').isPressed).toBe(false)
    expect(itemProps('b').isPressed).toBe(true)
  })

  it('should allow deselecting when not mandatory', async () => {
    const model = ref<string | undefined>('a')
    const { wrapper, itemProps, wait } = mountGroup({ model })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await wait()

    expect(itemProps('a').isPressed).toBe(false)
  })

  it('should prevent deselecting when mandatory', async () => {
    const model = ref<string | undefined>('a')
    const { wrapper, itemProps, wait } = mountGroup({
      model,
      props: { mandatory: true },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await wait()

    expect(itemProps('a').isPressed).toBe(true)
  })

  it('should disable all children when group is disabled', async () => {
    const model = ref<string | undefined>(undefined)
    const { wrapper, itemProps, wait } = mountGroup({
      model,
      props: { disabled: true },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    await wait()

    expect(model.value).toBeUndefined()
    expect(itemProps('a').isDisabled).toBe(true)
  })

  it('should reflect group disabled in group slot props', () => {
    const { groupProps } = mountGroup({
      props: { disabled: true },
    })

    expect(groupProps().isDisabled).toBe(true)
  })
})

// ============================================================================
// Group Mode (multi select)
// ============================================================================

describe('toggle.Group (multiple)', () => {
  it('should allow multiple selections', async () => {
    const model = ref<string[]>([])
    const { wrapper, itemProps, wait } = mountGroup({
      model,
      props: { multiple: true },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await wait()
    await buttons[1].trigger('click')
    await wait()

    expect(model.value).toEqual(expect.arrayContaining(['a', 'b']))
    expect(itemProps('a').isPressed).toBe(true)
    expect(itemProps('b').isPressed).toBe(true)
    expect(itemProps('c').isPressed).toBe(false)
  })

  it('should toggle individual items in multi mode', async () => {
    const model = ref<string[]>(['a', 'b'])
    const { wrapper, itemProps, wait } = mountGroup({
      model,
      props: { multiple: true },
    })

    const buttons = wrapper.findAll('button')

    await buttons[0].trigger('click')
    await wait()

    expect(model.value).toEqual(['b'])
    expect(itemProps('a').isPressed).toBe(false)
    expect(itemProps('b').isPressed).toBe(true)
  })
})

// ============================================================================
// Toggle.Indicator
// ============================================================================

describe('toggle.Indicator', () => {
  it('should render as span by default', () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Toggle.Root as any, {}, {
          default: () => h(Toggle.Indicator as any, {}, {
            default: () => h('span', '✓'),
          }),
        })
      },
    }))

    const span = wrapper.find('span')
    expect(span.exists()).toBe(true)
  })

  it('should expose isPressed in slot props', async () => {
    let indicatorProps: any

    const model = ref(true)

    mount(defineComponent({
      setup () {
        return () => h(Toggle.Root as any, {
          'modelValue': model.value,
          'onUpdate:modelValue': (v: unknown) => {
            model.value = v as boolean
          },
        }, {
          default: () => h(Toggle.Indicator as any, {}, {
            default: (props: any) => {
              indicatorProps = props
              return h('span', props.isPressed ? '✓' : '')
            },
          }),
        })
      },
    }))

    expect(indicatorProps.isPressed).toBe(true)
  })
})

// ============================================================================
// SSR
// ============================================================================

describe('toggle SSR', () => {
  it('should render without errors on the server', async () => {
    const { renderToString } = await import('vue/server-renderer')
    const { createSSRApp, h } = await import('vue')

    const app = createSSRApp({
      render () {
        return h(Toggle.Root as any, { modelValue: false }, {
          default: () => 'Toggle',
        })
      },
    })

    const html = await renderToString(app)

    expect(html).toContain('Toggle')
    expect(html).toContain('aria-pressed="false"')
    expect(html).toContain('data-state="off"')
  })
})
