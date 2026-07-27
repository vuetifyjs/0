import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Collapsible } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

interface MountResult {
  wrapper: ReturnType<typeof mount>
  rootProps: () => any
  activatorProps: () => any
  contentProps: () => any
  cueProps: () => any
  activator: () => HTMLElement
  content: () => HTMLElement
  wait: () => Promise<void>
}

function mountCollapsible (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<boolean>>
  activatorAs?: string
  withCue?: boolean
} = {}): MountResult {
  let rootSlot: any
  let activatorSlot: any
  let contentSlot: any
  let cueSlot: any

  const wrapper = mount(Collapsible.Root, {
    attachTo: document.body,
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
      default: (rootProps: any) => {
        rootSlot = rootProps
        return [
          h(Collapsible.Activator as any, { as: options.activatorAs ?? 'button' }, {
            default: (activatorProps: any) => {
              activatorSlot = activatorProps
              const children: any[] = [h('span', 'Toggle')]
              if (options.withCue) {
                children.push(h(Collapsible.Cue as any, {}, {
                  default: (cueProps: any) => {
                    cueSlot = cueProps
                    return h('span', '▼')
                  },
                }))
              }
              return children
            },
          }),
          h(Collapsible.Content as any, {}, {
            default: (contentProps: any) => {
              contentSlot = contentProps
              return h('div', 'Content body')
            },
          }),
        ]
      },
    },
  })

  return {
    wrapper,
    rootProps: () => rootSlot,
    activatorProps: () => activatorSlot,
    contentProps: () => contentSlot,
    cueProps: () => cueSlot,
    activator: () => wrapper.get('[aria-expanded]').element as HTMLElement,
    content: () => wrapper.get('[role="region"]').element as HTMLElement,
    wait: () => nextTick(),
  }
}

describe('collapsible', () => {
  describe('rendering', () => {
    it('should render a native button activator by default', async () => {
      const { activator, wait } = mountCollapsible()
      await wait()

      const el = activator()
      expect(el.tagName).toBe('BUTTON')
      expect(el.getAttribute('type')).toBe('button')
      expect(el.hasAttribute('role')).toBe(false)
    })

    it('should render the content region', async () => {
      const { content, activator, wait } = mountCollapsible()
      await wait()

      const region = content()
      expect(region.getAttribute('role')).toBe('region')
      expect(region.getAttribute('aria-labelledby')).toBe(activator().getAttribute('id'))
    })

    it('should link activator and content via aria-controls', async () => {
      const { activator, content, wait } = mountCollapsible()
      await wait()

      expect(activator().getAttribute('aria-controls')).toBe(content().getAttribute('id'))
    })
  })

  describe('closed state', () => {
    it('should start closed with content hidden', async () => {
      const { activator, content, rootProps, wait } = mountCollapsible()
      await wait()

      expect(rootProps().isOpen).toBe(false)
      expect(activator().getAttribute('aria-expanded')).toBe('false')
      expect(content().hasAttribute('hidden')).toBe(true)
      expect(content().dataset.state).toBe('closed')
    })
  })

  describe('open via click', () => {
    it('should open when the activator is clicked', async () => {
      const { wrapper, activator, content, wait } = mountCollapsible()
      await wait()

      await wrapper.get('button').trigger('click')
      await wait()

      expect(activator().getAttribute('aria-expanded')).toBe('true')
      expect(content().hasAttribute('hidden')).toBe(false)
      expect(content().dataset.state).toBe('open')
    })

    it('should close again on a second click', async () => {
      const { wrapper, content, wait } = mountCollapsible()
      await wait()

      await wrapper.get('button').trigger('click')
      await wait()
      expect(content().hasAttribute('hidden')).toBe(false)

      await wrapper.get('button').trigger('click')
      await wait()
      expect(content().hasAttribute('hidden')).toBe(true)
    })

    it('should sync the v-model on click', async () => {
      const model = ref(false)
      const { wrapper, wait } = mountCollapsible({ model })
      await wait()

      await wrapper.get('button').trigger('click')
      await wait()

      expect(model.value).toBe(true)
    })
  })

  describe('open via keyboard', () => {
    it('should toggle on Enter', async () => {
      const { wrapper, content, wait } = mountCollapsible()
      await wait()

      await wrapper.get('button').trigger('keydown', { key: 'Enter' })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(false)
    })

    it('should toggle on Space', async () => {
      const { wrapper, content, wait } = mountCollapsible()
      await wait()

      await wrapper.get('button').trigger('keydown', { key: ' ' })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(false)
    })

    it('should ignore unrelated keys', async () => {
      const { wrapper, content, wait } = mountCollapsible()
      await wait()

      await wrapper.get('button').trigger('keydown', { key: 'Tab' })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(true)
    })
  })

  describe('focus', () => {
    it('should keep the activator focusable when enabled', async () => {
      const { activator, wait } = mountCollapsible()
      await wait()

      ;(activator() as HTMLElement).focus()
      expect(document.activeElement).toBe(activator())
      expect(activator().getAttribute('tabindex')).toBe('0')
    })
  })

  describe('disabled', () => {
    it('should mark a native button disabled and non-focusable', async () => {
      const { activator, wait } = mountCollapsible({ props: { disabled: true } })
      await wait()

      expect((activator() as HTMLButtonElement).disabled).toBe(true)
      expect(activator().getAttribute('tabindex')).toBe('-1')
    })

    it('should not open when a disabled activator is clicked', async () => {
      const { wrapper, content, rootProps, wait } = mountCollapsible({ props: { disabled: true } })
      await wait()

      await wrapper.get('button').trigger('click')
      await wait()

      expect(rootProps().isOpen).toBe(false)
      expect(content().hasAttribute('hidden')).toBe(true)
    })

    it('should not open a disabled non-button activator on click', async () => {
      const { wrapper, activator, rootProps, wait } = mountCollapsible({
        props: { disabled: true },
        activatorAs: 'div',
      })
      await wait()

      // Non-button uses role/aria-disabled instead of the native disabled attr,
      // so the click handler still fires — the createSingle disabled guard must
      // make the toggle inert.
      expect(activator().getAttribute('role')).toBe('button')
      expect(activator().getAttribute('aria-disabled')).toBe('true')

      await wrapper.get('[role="button"]').trigger('click')
      await wait()

      expect(rootProps().isOpen).toBe(false)
    })
  })

  describe('non-button activator', () => {
    it('should expose role=button and no native type when rendered as a div', async () => {
      const { activator, wait } = mountCollapsible({ activatorAs: 'div' })
      await wait()

      expect(activator().tagName).toBe('DIV')
      expect(activator().getAttribute('role')).toBe('button')
      expect(activator().hasAttribute('type')).toBe(false)
    })

    it('should still toggle a non-button activator when enabled', async () => {
      const { wrapper, content, wait } = mountCollapsible({ activatorAs: 'div' })
      await wait()

      await wrapper.get('[role="button"]').trigger('click')
      await wait()

      expect(content().hasAttribute('hidden')).toBe(false)
    })

    it('should toggle on Enter when rendered as a div', async () => {
      const { wrapper, content, wait } = mountCollapsible({ activatorAs: 'div' })
      await wait()

      await wrapper.get('[role="button"]').trigger('keydown', { key: 'Enter' })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(false)
    })

    it('should toggle on Space when rendered as a div', async () => {
      const { wrapper, content, wait } = mountCollapsible({ activatorAs: 'div' })
      await wait()

      await wrapper.get('[role="button"]').trigger('keydown', { key: ' ' })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(false)
    })
  })

  describe('cue', () => {
    it('should be aria-hidden and reflect the open state', async () => {
      const model = ref(false)
      const { wrapper, cueProps, wait } = mountCollapsible({ model, withCue: true })
      await wait()

      const cue = wrapper.get('[aria-hidden="true"]').element as HTMLElement
      expect(cue.dataset.state).toBe('closed')
      expect(cueProps().isOpen).toBe(false)

      await wrapper.get('button').trigger('click')
      await wait()

      expect(cue.dataset.state).toBe('open')
      expect(cueProps().isOpen).toBe(true)
    })
  })

  describe('renderless', () => {
    it('should bind attrs onto a custom cue element', async () => {
      const wrapper = mount(Collapsible.Root, {
        attachTo: document.body,
        slots: {
          default: () => h(Collapsible.Cue as any, { renderless: true }, {
            default: (props: any) => h('i', { 'data-testid': 'cue', ...props.attrs }, '▼'),
          }),
        },
      })

      await nextTick()

      const cue = wrapper.get('[data-testid="cue"]')
      expect(cue.attributes('aria-hidden')).toBe('true')
      expect(cue.attributes('data-state')).toBe('closed')
      expect(wrapper.findAll('[aria-hidden]')).toHaveLength(1)

      wrapper.unmount()
    })
  })

  describe('v-model', () => {
    it('should open from an initial model value of true', async () => {
      const model = ref(true)
      const { activator, content, wait } = mountCollapsible({ model })
      await wait()

      expect(activator().getAttribute('aria-expanded')).toBe('true')
      expect(content().hasAttribute('hidden')).toBe(false)
    })

    it('should react to external model changes', async () => {
      const model = ref(false)
      const { wrapper, content, wait } = mountCollapsible({ model })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(true)

      model.value = true
      await wrapper.setProps({ modelValue: true })
      await wait()

      expect(content().hasAttribute('hidden')).toBe(false)
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR', () => {
    it('should render to string without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () => h(Collapsible.Root as any, null, {
          default: () => [
            h(Collapsible.Activator as any, null, () => 'Toggle'),
            h(Collapsible.Content as any, null, () => 'Body'),
          ],
        }),
      }))

      const html = await renderToString(app)
      expect(html).toBeTruthy()
      expect(html).toContain('aria-expanded')
      expect(html).toContain('role="region"')
    })
  })
})
