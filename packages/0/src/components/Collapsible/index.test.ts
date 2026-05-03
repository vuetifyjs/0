import { describe, expect, it } from 'vitest'

import { Collapsible } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

interface MountResult {
  wrapper: ReturnType<typeof mount>
  rootProps: () => any
  activatorProps: () => any
  contentProps: () => any
  cueProps: () => any
  wait: () => Promise<void>
}

function mountCollapsible (options: {
  props?: Record<string, unknown>
  model?: ReturnType<typeof ref<boolean>>
  withCue?: boolean
} = {}): MountResult {
  let capturedRootProps: any
  let capturedActivatorProps: any
  let capturedContentProps: any
  let capturedCueProps: any

  const wrapper = mount(Collapsible.Root, {
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
        capturedRootProps = rootProps
        const children = [
          h(Collapsible.Activator as any, {}, {
            default: (activatorSlotProps: any) => {
              capturedActivatorProps = activatorSlotProps
              const activatorChildren = [h('span', 'Toggle')]
              if (options.withCue) {
                activatorChildren.push(
                  h(Collapsible.Cue as any, {}, {
                    default: (cueSlotProps: any) => {
                      capturedCueProps = cueSlotProps
                      return h('span', '▼')
                    },
                  }),
                )
              }
              return activatorChildren
            },
          }),
          h(Collapsible.Content as any, {}, {
            default: (contentSlotProps: any) => {
              capturedContentProps = contentSlotProps
              return h('div', 'Content body')
            },
          }),
        ]
        return children
      },
    },
  })

  return {
    wrapper,
    rootProps: () => capturedRootProps,
    activatorProps: () => capturedActivatorProps,
    contentProps: () => capturedContentProps,
    cueProps: () => capturedCueProps,
    wait: () => nextTick(),
  }
}

describe('collapsible', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should render with default closed state', async () => {
        const { rootProps, wait } = mountCollapsible()
        await wait()

        expect(rootProps()).toBeDefined()
        expect(rootProps().isOpen).toBe(false)
        expect(rootProps().isDisabled).toBe(false)
      })

      it('should expose open/close/toggle methods', async () => {
        const { rootProps, wait } = mountCollapsible()
        await wait()

        expect(typeof rootProps().open).toBe('function')
        expect(typeof rootProps().close).toBe('function')
        expect(typeof rootProps().toggle).toBe('function')
      })
    })

    describe('v-model', () => {
      it('should accept initial model value of true', async () => {
        const model = ref(true)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should accept initial model value of false', async () => {
        const model = ref(false)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        expect(rootProps().isOpen).toBe(false)
      })

      it('should update model on toggle', async () => {
        const model = ref(false)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().toggle()
        await wait()

        expect(model.value).toBe(true)
      })

      it('should update model on open', async () => {
        const model = ref(false)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().open()
        await wait()

        expect(model.value).toBe(true)
      })

      it('should update model on close', async () => {
        const model = ref(true)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().close()
        await wait()

        expect(model.value).toBe(false)
      })
    })

    describe('toggle method', () => {
      it('should open when closed', async () => {
        const model = ref(false)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().toggle()
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should close when open', async () => {
        const model = ref(true)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().toggle()
        await wait()

        expect(rootProps().isOpen).toBe(false)
      })
    })

    describe('show/hide methods', () => {
      it('should open with show', async () => {
        const { rootProps, wait } = mountCollapsible()
        await wait()

        rootProps().open()
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should close with hide', async () => {
        const model = ref(true)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().close()
        await wait()

        expect(rootProps().isOpen).toBe(false)
      })

      it('should be idempotent when already open', async () => {
        const model = ref(true)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().open()
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should be idempotent when already closed', async () => {
        const model = ref(false)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        rootProps().close()
        await wait()

        expect(rootProps().isOpen).toBe(false)
      })
    })

    describe('disabled prop', () => {
      it('should set isDisabled to true', async () => {
        const { rootProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(rootProps().isDisabled).toBe(true)
      })

      it('should set data-disabled', async () => {
        const { rootProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(rootProps().attrs['data-disabled']).toBe(true)
      })

      it('should not set data-disabled when not disabled', async () => {
        const { rootProps, wait } = mountCollapsible()
        await wait()

        expect(rootProps().attrs['data-disabled']).toBeUndefined()
      })
    })

    describe('data-state attribute', () => {
      it('should be closed by default', async () => {
        const { rootProps, wait } = mountCollapsible()
        await wait()

        expect(rootProps().attrs['data-state']).toBe('closed')
      })

      it('should be open when opened', async () => {
        const model = ref(true)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        expect(rootProps().attrs['data-state']).toBe('open')
      })

      it('should update on toggle', async () => {
        const model = ref(false)
        const { rootProps, wait } = mountCollapsible({ model })
        await wait()

        expect(rootProps().attrs['data-state']).toBe('closed')

        rootProps().toggle()
        await wait()

        expect(rootProps().attrs['data-state']).toBe('open')
      })
    })
  })

  describe('activator', () => {
    describe('rendering', () => {
      it('should render with default props', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps()).toBeDefined()
      })

      it('should expose toggle method', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(typeof activatorProps().toggle).toBe('function')
      })
    })

    describe('aRIA attributes', () => {
      it('should have aria-expanded false when closed', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs['aria-expanded']).toBe(false)
      })

      it('should have aria-expanded true when open', async () => {
        const model = ref(true)
        const { activatorProps, wait } = mountCollapsible({ model })
        await wait()

        expect(activatorProps().attrs['aria-expanded']).toBe(true)
      })

      it('should have aria-controls pointing to content id', async () => {
        const { activatorProps, contentProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs['aria-controls']).toBe(contentProps().attrs.id)
      })

      it('should have an id', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs.id).toBeDefined()
        expect(activatorProps().attrs.id).not.toBe('')
      })

      it('should have type=button for default button element', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs.type).toBe('button')
      })

      it('should not have role=button for default button element', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs.role).toBeUndefined()
      })
    })

    describe('data attributes', () => {
      it('should have data-state closed when closed', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs['data-state']).toBe('closed')
      })

      it('should have data-state open when open', async () => {
        const model = ref(true)
        const { activatorProps, wait } = mountCollapsible({ model })
        await wait()

        expect(activatorProps().attrs['data-state']).toBe('open')
      })

      it('should have data-disabled when disabled', async () => {
        const { activatorProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(activatorProps().attrs['data-disabled']).toBe(true)
      })

      it('should not have data-disabled when not disabled', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs['data-disabled']).toBeUndefined()
      })
    })

    describe('disabled state', () => {
      it('should set tabindex to -1 when disabled', async () => {
        const { activatorProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(activatorProps().attrs.tabindex).toBe(-1)
      })

      it('should set tabindex to 0 when not disabled', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().attrs.tabindex).toBe(0)
      })

      it('should set disabled attribute for button element', async () => {
        const { activatorProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(activatorProps().attrs.disabled).toBe(true)
      })

      it('should set isDisabled', async () => {
        const { activatorProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(activatorProps().isDisabled).toBe(true)
      })
    })

    describe('click', () => {
      it('should toggle on click', async () => {
        const model = ref(false)
        const { activatorProps, rootProps, wait } = mountCollapsible({ model })
        await wait()

        activatorProps().attrs.onClick()
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should close on second click', async () => {
        const model = ref(true)
        const { activatorProps, rootProps, wait } = mountCollapsible({ model })
        await wait()

        activatorProps().attrs.onClick()
        await wait()

        expect(rootProps().isOpen).toBe(false)
      })
    })

    describe('keyboard', () => {
      it('should toggle on Enter', async () => {
        const model = ref(false)
        const { activatorProps, rootProps, wait } = mountCollapsible({ model })
        await wait()

        const event = new KeyboardEvent('keydown', { key: 'Enter' })
        Object.defineProperty(event, 'defaultPrevented', { get: () => false })
        Object.defineProperty(event, 'preventDefault', {
          value: () => {},
          writable: true,
        })
        activatorProps().attrs.onKeydown(event)
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should toggle on Space', async () => {
        const model = ref(false)
        const { activatorProps, rootProps, wait } = mountCollapsible({ model })
        await wait()

        const event = new KeyboardEvent('keydown', { key: ' ' })
        Object.defineProperty(event, 'preventDefault', {
          value: () => {},
          writable: true,
        })
        activatorProps().attrs.onKeydown(event)
        await wait()

        expect(rootProps().isOpen).toBe(true)
      })

      it('should ignore other keys', async () => {
        const model = ref(false)
        const { activatorProps, rootProps, wait } = mountCollapsible({ model })
        await wait()

        const event = new KeyboardEvent('keydown', { key: 'Tab' })
        activatorProps().attrs.onKeydown(event)
        await wait()

        expect(rootProps().isOpen).toBe(false)
      })

      it('should prevent default on Enter', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        let prevented = false
        const event = {
          key: 'Enter',
          preventDefault: () => {
            prevented = true
          },
        } as unknown as KeyboardEvent
        activatorProps().attrs.onKeydown(event)

        expect(prevented).toBe(true)
      })

      it('should prevent default on Space', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        let prevented = false
        const event = {
          key: ' ',
          preventDefault: () => {
            prevented = true
          },
        } as unknown as KeyboardEvent
        activatorProps().attrs.onKeydown(event)

        expect(prevented).toBe(true)
      })
    })

    describe('isOpen slot prop', () => {
      it('should be false when closed', async () => {
        const { activatorProps, wait } = mountCollapsible()
        await wait()

        expect(activatorProps().isOpen).toBe(false)
      })

      it('should be true when open', async () => {
        const model = ref(true)
        const { activatorProps, wait } = mountCollapsible({ model })
        await wait()

        expect(activatorProps().isOpen).toBe(true)
      })
    })
  })

  describe('content', () => {
    describe('rendering', () => {
      it('should render with default props', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps()).toBeDefined()
      })
    })

    describe('aRIA attributes', () => {
      it('should have role=region', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().attrs.role).toBe('region')
      })

      it('should have aria-labelledby pointing to activator id', async () => {
        const { activatorProps, contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().attrs['aria-labelledby']).toBe(activatorProps().attrs.id)
      })

      it('should have a unique id', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().attrs.id).toBeDefined()
        expect(contentProps().attrs.id).not.toBe('')
      })
    })

    describe('hidden attribute', () => {
      it('should be hidden when closed', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().attrs.hidden).toBe(true)
      })

      it('should not be hidden when open', async () => {
        const model = ref(true)
        const { contentProps, wait } = mountCollapsible({ model })
        await wait()

        expect(contentProps().attrs.hidden).toBe(false)
      })

      it('should toggle hidden on state change', async () => {
        const model = ref(false)
        const { contentProps, rootProps, wait } = mountCollapsible({ model })
        await wait()

        expect(contentProps().attrs.hidden).toBe(true)

        rootProps().toggle()
        await wait()

        expect(contentProps().attrs.hidden).toBe(false)
      })
    })

    describe('data attributes', () => {
      it('should have data-state closed when closed', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().attrs['data-state']).toBe('closed')
      })

      it('should have data-state open when open', async () => {
        const model = ref(true)
        const { contentProps, wait } = mountCollapsible({ model })
        await wait()

        expect(contentProps().attrs['data-state']).toBe('open')
      })

      it('should have data-disabled when disabled', async () => {
        const { contentProps, wait } = mountCollapsible({ props: { disabled: true } })
        await wait()

        expect(contentProps().attrs['data-disabled']).toBe(true)
      })

      it('should not have data-disabled when not disabled', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().attrs['data-disabled']).toBeUndefined()
      })
    })

    describe('isOpen slot prop', () => {
      it('should be false when closed', async () => {
        const { contentProps, wait } = mountCollapsible()
        await wait()

        expect(contentProps().isOpen).toBe(false)
      })

      it('should be true when open', async () => {
        const model = ref(true)
        const { contentProps, wait } = mountCollapsible({ model })
        await wait()

        expect(contentProps().isOpen).toBe(true)
      })
    })
  })

  describe('cue', () => {
    describe('rendering', () => {
      it('should render with default props', async () => {
        const { cueProps, wait } = mountCollapsible({ withCue: true })
        await wait()

        expect(cueProps()).toBeDefined()
      })
    })

    describe('aRIA attributes', () => {
      it('should have aria-hidden true', async () => {
        const { cueProps, wait } = mountCollapsible({ withCue: true })
        await wait()

        expect(cueProps().attrs['aria-hidden']).toBe(true)
      })
    })

    describe('data-state', () => {
      it('should be closed when closed', async () => {
        const { cueProps, wait } = mountCollapsible({ withCue: true })
        await wait()

        expect(cueProps().attrs['data-state']).toBe('closed')
      })

      it('should be open when open', async () => {
        const model = ref(true)
        const { cueProps, wait } = mountCollapsible({ model, withCue: true })
        await wait()

        expect(cueProps().attrs['data-state']).toBe('open')
      })
    })

    describe('isOpen slot prop', () => {
      it('should be false when closed', async () => {
        const { cueProps, wait } = mountCollapsible({ withCue: true })
        await wait()

        expect(cueProps().isOpen).toBe(false)
      })

      it('should be true when open', async () => {
        const model = ref(true)
        const { cueProps, wait } = mountCollapsible({ model, withCue: true })
        await wait()

        expect(cueProps().isOpen).toBe(true)
      })
    })
  })

  describe('integration', () => {
    it('should link activator and content via aria-controls', async () => {
      const { activatorProps, contentProps, wait } = mountCollapsible()
      await wait()

      expect(activatorProps().attrs['aria-controls']).toBe(contentProps().attrs.id)
    })

    it('should link content to activator via aria-labelledby', async () => {
      const { activatorProps, contentProps, wait } = mountCollapsible()
      await wait()

      expect(contentProps().attrs['aria-labelledby']).toBe(activatorProps().attrs.id)
    })

    it('should sync all sub-component states on toggle', async () => {
      const model = ref(false)
      const { rootProps, activatorProps, contentProps, wait } = mountCollapsible({ model })
      await wait()

      expect(rootProps().isOpen).toBe(false)
      expect(activatorProps().isOpen).toBe(false)
      expect(contentProps().isOpen).toBe(false)

      rootProps().toggle()
      await wait()

      expect(rootProps().isOpen).toBe(true)
      expect(activatorProps().isOpen).toBe(true)
      expect(contentProps().isOpen).toBe(true)
    })

    it('should sync all data-state attributes on toggle', async () => {
      const model = ref(false)
      const { rootProps, activatorProps, contentProps, wait } = mountCollapsible({ model })
      await wait()

      expect(rootProps().attrs['data-state']).toBe('closed')
      expect(activatorProps().attrs['data-state']).toBe('closed')
      expect(contentProps().attrs['data-state']).toBe('closed')

      rootProps().toggle()
      await wait()

      expect(rootProps().attrs['data-state']).toBe('open')
      expect(activatorProps().attrs['data-state']).toBe('open')
      expect(contentProps().attrs['data-state']).toBe('open')
    })

    it('should toggle via activator click and reflect in content', async () => {
      const model = ref(false)
      const { activatorProps, contentProps, wait } = mountCollapsible({ model })
      await wait()

      expect(contentProps().attrs.hidden).toBe(true)

      activatorProps().attrs.onClick()
      await wait()

      expect(contentProps().attrs.hidden).toBe(false)
    })

    it('should toggle via activator keyboard and reflect in content', async () => {
      const model = ref(false)
      const { activatorProps, contentProps, wait } = mountCollapsible({ model })
      await wait()

      const event = {
        key: 'Enter',
        preventDefault: () => {},
      } as unknown as KeyboardEvent
      activatorProps().attrs.onKeydown(event)
      await wait()

      expect(contentProps().attrs.hidden).toBe(false)
      expect(contentProps().attrs['data-state']).toBe('open')
    })
  })
})
