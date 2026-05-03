import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Adapters
import { ClientAdapter } from '#v0/composables/createCombobox/adapters/client'

import { Combobox } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Mock showPopover/hidePopover — not supported in happy-dom
beforeEach(() => {
  HTMLElement.prototype.showPopover = vi.fn()
  HTMLElement.prototype.hidePopover = vi.fn()
})

// Clean up DOM between tests — cursor uses document.querySelector (global),
// so stale elements from prior tests cause false matches if not cleared
afterEach(() => {
  while (document.body.firstChild) {
    document.body.firstChild.remove()
  }
})

/**
 * Helper to mount a complete Combobox compound and open it so items
 * register with the selection context (useLazy defers rendering
 * until isOpen becomes true).
 *
 * Attaches to document.body so cursor can resolve item elements
 * via document.querySelector (needed for aria-activedescendant).
 */
async function createCombobox (options: {
  'modelValue'?: unknown
  'onUpdate:modelValue'?: (v: unknown) => void
  'multiple'?: boolean
  'mandatory'?: boolean
  'disabled'?: boolean
  'strict'?: boolean
  'name'?: string
  'form'?: string
  'id'?: string
  'adapter'?: InstanceType<typeof ClientAdapter>
  'items'?: Array<{ id?: string, value: string, disabled?: boolean }>
  'openOn'?: 'focus' | 'input'
} = {}) {
  const {
    items = [
      { value: 'Apple' },
      { value: 'Banana' },
      { value: 'Cherry' },
    ],
    openOn = 'focus',
    ...props
  } = options

  const itemSlotProps = ref<Record<string, unknown>>({})
  let context: {
    open: () => void
    close: () => void
    toggle: () => void
    clear: () => void
  }

  const wrapper = mount(
    defineComponent({
      setup () {
        return { itemSlotProps }
      },
      render () {
        return h(Combobox.Root as any, props, {
          default: (sp: typeof context) => {
            context = sp
            return [
              h(Combobox.Activator as any, {}, {
                default: () => [
                  h(Combobox.Control as any, { openOn }),
                  h(Combobox.Cue as any),
                ],
              }),
              h(Combobox.Content as any, {}, {
                default: () => [
                  ...items.map(item =>
                    h(Combobox.Item as any, {
                      key: item.value,
                      id: item.id,
                      value: item.value,
                      disabled: item.disabled,
                    }, {
                      default: (slotProps: Record<string, unknown>) => {
                        ;(this.itemSlotProps as Record<string, unknown>)[item.value] = slotProps
                        return h('div', (slotProps.attrs as Record<string, unknown>), item.value)
                      },
                    }),
                  ),
                  h(Combobox.Empty as any, {}, {
                    default: () => 'No results',
                  }),
                ],
              }),
            ]
          },
        })
      },
    }),
    { attachTo: document.body },
  )

  // Open dropdown to boot lazy content and register items
  await nextTick()
  if (!props.disabled) {
    context!.open()
    await nextTick()
    // Close again for a clean starting state
    context!.close()
    await nextTick()
  }

  /** Whether the dropdown is currently open, read from the live DOM */
  function isOpen () {
    return wrapper.find('input').attributes('aria-expanded') === 'true'
  }

  /** Current query value from the live DOM */
  function query () {
    return (wrapper.find('input').element as HTMLInputElement).value
  }

  return {
    wrapper,
    itemSlotProps,
    isOpen,
    query,
    open: () => context!.open(),
    close: () => context!.close(),
    toggle: () => context!.toggle(),
    clear: () => context!.clear(),
  }
}

describe('combobox', () => {
  describe('selection behavior', () => {
    it('selects item on click', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const items = wrapper.findAllComponents(Combobox.Item as any)
      await items[0]!.trigger('click')
      await nextTick()

      expect(selected.value).toBe('Apple')
    })

    it('selects highlighted item via Enter key', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(selected.value).toBe('Apple')
    })

    it('toggles selection in multi-select mode', async () => {
      const selected = ref<string[]>([])
      const { itemSlotProps, open } = await createCombobox({
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()
      expect(selected.value).toContain('Apple')

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()
      expect(selected.value).not.toContain('Apple')
    })

    it('prevents deselecting last item when mandatory=true', async () => {
      const selected = ref<string>('Apple')
      const { itemSlotProps, open } = await createCombobox({
        'mandatory': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()

      expect((itemSlotProps.value.Apple as { isSelected: boolean }).isSelected).toBe(true)
    })

    it('updates query to selected value on single select', async () => {
      const selected = ref<string>()
      const { itemSlotProps, open, query } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      ;(itemSlotProps.value.Banana as { select: () => void }).select()
      await nextTick()

      expect(query()).toBe('Banana')
    })

    it('clears query on multi-select item selection', async () => {
      const selected = ref<string[]>([])
      const { wrapper, itemSlotProps, open, query } = await createCombobox({
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('App')
      await input.trigger('input')
      await nextTick()

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()

      expect(query()).toBe('')
    })

    it('replaces selection in single-select mode', async () => {
      const selected = ref<string>()
      const { itemSlotProps, open } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()
      expect(selected.value).toBe('Apple')

      open()
      await nextTick()

      ;(itemSlotProps.value.Banana as { select: () => void }).select()
      await nextTick()
      expect(selected.value).toBe('Banana')
      expect((itemSlotProps.value.Apple as { isSelected: boolean }).isSelected).toBe(false)
    })

    it('allows multiple selections when multiple=true', async () => {
      const selected = ref<string[]>([])
      const { itemSlotProps, open } = await createCombobox({
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()
      ;(itemSlotProps.value.Banana as { select: () => void }).select()
      await nextTick()

      expect(selected.value).toContain('Apple')
      expect(selected.value).toContain('Banana')
    })
  })

  describe('pristine flag', () => {
    it('after selection all items remain visible (pristine=true)', async () => {
      const selected = ref<string>()
      const { itemSlotProps, open } = await createCombobox({
        'adapter': new ClientAdapter(),
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      // Select an item — sets pristine=true
      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()

      // Re-open (single mode closes on select)
      open()
      await nextTick()

      // All items should pass filter (pristine search = empty string)
      expect((itemSlotProps.value.Apple as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Banana as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Cherry as { isFiltered: boolean }).isFiltered).toBe(true)
    })

    it('after typing only matching items are visible (pristine=false)', async () => {
      const { wrapper, itemSlotProps, open } = await createCombobox({
        adapter: new ClientAdapter(),
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Ban')
      await input.trigger('input')
      await nextTick()

      // Only Banana passes the filter
      expect((itemSlotProps.value.Banana as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Apple as { isFiltered: boolean }).isFiltered).toBe(false)
      expect((itemSlotProps.value.Cherry as { isFiltered: boolean }).isFiltered).toBe(false)
    })

    it('after selecting then typing, filter activates', async () => {
      const selected = ref<string>()
      const { wrapper, itemSlotProps, open } = await createCombobox({
        'adapter': new ClientAdapter(),
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      // Select Apple — pristine becomes true
      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()

      // Re-open
      open()
      await nextTick()

      // All items visible while pristine
      expect((itemSlotProps.value.Apple as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Banana as { isFiltered: boolean }).isFiltered).toBe(true)

      // Type to activate filter — sets pristine=false
      const input = wrapper.find('input')
      await input.setValue('Ban')
      await input.trigger('input')
      await nextTick()

      expect((itemSlotProps.value.Banana as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Apple as { isFiltered: boolean }).isFiltered).toBe(false)
    })
  })

  describe('multi-select focus and highlight', () => {
    it('after multi-select click input gets focus', async () => {
      const selected = ref<string[]>([])
      const { wrapper, open } = await createCombobox({
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      const items = wrapper.findAllComponents(Combobox.Item as any)
      const apple = items.find(i => i.text() === 'Apple')!
      await apple.trigger('click')
      await nextTick()

      const input = wrapper.find('input')
      expect(document.activeElement).toBe(input.element)
    })

    it('after multi-select click ArrowDown highlights next item not first', async () => {
      const selected = ref<string[]>([])
      const { wrapper, open } = await createCombobox({
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      // Click Python → currently item 1 (Apple) gets highlighted; let's click Banana (index 1)
      const items = wrapper.findAllComponents(Combobox.Item as any)
      const banana = items.find(i => i.text() === 'Banana')!
      await banana.trigger('click')
      await nextTick()

      // Banana is now highlighted; ArrowDown should move to Cherry
      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const highlighted = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')
      expect(highlighted?.text()).toBe('Cherry')
    })
  })

  describe('filtering', () => {
    it('client adapter filters items by query', async () => {
      const { wrapper, itemSlotProps, open } = await createCombobox({
        adapter: new ClientAdapter(),
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('App')
      await input.trigger('input')
      await nextTick()

      expect((itemSlotProps.value.Apple as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Banana as { isFiltered: boolean }).isFiltered).toBe(false)
      expect((itemSlotProps.value.Cherry as { isFiltered: boolean }).isFiltered).toBe(false)
    })

    it('empty query shows all items', async () => {
      const { wrapper, itemSlotProps, open } = await createCombobox({
        adapter: new ClientAdapter(),
      })

      open()
      await nextTick()

      // First filter to narrow, then clear
      const input = wrapper.find('input')
      await input.setValue('App')
      await input.trigger('input')
      await nextTick()

      await input.setValue('')
      await input.trigger('input')
      await nextTick()

      expect((itemSlotProps.value.Apple as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Banana as { isFiltered: boolean }).isFiltered).toBe(true)
      expect((itemSlotProps.value.Cherry as { isFiltered: boolean }).isFiltered).toBe(true)
    })

    it('shows empty state when no items match query', async () => {
      const { wrapper, open } = await createCombobox({
        adapter: new ClientAdapter(),
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('zzz')
      await input.trigger('input')
      await nextTick()

      const empty = wrapper.findComponent(Combobox.Empty as any)
      expect(empty.exists()).toBe(true)
    })

    it('hides filtered-out items via v-show', async () => {
      const { wrapper, open } = await createCombobox({
        adapter: new ClientAdapter(),
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('App')
      await input.trigger('input')
      await nextTick()

      const items = wrapper.findAllComponents(Combobox.Item as any)
      const banana = items.find(i => i.text() === 'Banana')
      expect(banana?.element).toBeTruthy()
      // v-show sets display: none
      expect((banana?.element as HTMLElement).style.display).toBe('none')
    })

    it('filtered items skipped by virtual focus', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'adapter': new ClientAdapter(),
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('App')
      await input.trigger('input')
      await nextTick()

      // ArrowDown should navigate to Apple (only unfiltered item)
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Virtual focus should have highlighted Apple (not Banana which is filtered)
      const highlightedItems = wrapper.findAllComponents(Combobox.Item as any)
        .filter(item => (item.element as HTMLElement).dataset.highlighted === '')
      expect(highlightedItems.length).toBe(1)
      expect(highlightedItems[0]!.text()).toBe('Apple')
    })
  })

  describe('keyboard navigation', () => {
    it('opens on ArrowDown when closed', async () => {
      const { wrapper, isOpen } = await createCombobox()

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('opens on ArrowUp when closed', async () => {
      const { wrapper, isOpen } = await createCombobox()

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('navigates items with ArrowDown when open', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      // Virtual focus highlights an item
      const highlighted = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')
      expect(highlighted).toBeTruthy()
    })

    it('navigates items with ArrowUp when open', async () => {
      const { wrapper, open } = await createCombobox()

      open()
      await nextTick()

      const input = wrapper.find('input')

      // ArrowDown to Apple, then ArrowDown to Banana
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const atSecond = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')
      expect(atSecond?.text()).toBe('Banana')

      // ArrowUp back to Apple
      await input.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()
      const afterUp = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')

      expect(afterUp?.text()).toBe('Apple')
    })

    it('selects highlighted item on Enter', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'Home' })
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(selected.value).toBe('Apple')
    })

    it('closes on Escape', async () => {
      const { wrapper, open, isOpen } = await createCombobox()

      open()
      await nextTick()
      expect(isOpen()).toBe(true)

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'Escape' })
      await nextTick()

      expect(isOpen()).toBe(false)
    })

    it('closes on Tab without preventDefault', async () => {
      const { wrapper, open, isOpen } = await createCombobox()

      open()
      await nextTick()

      const input = wrapper.find('input')
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      input.element.dispatchEvent(event)
      await nextTick()

      expect(isOpen()).toBe(false)
      // Tab should not be prevented
      expect(event.defaultPrevented).toBe(false)
    })

    it('navigates to first item on Home', async () => {
      const { wrapper, open } = await createCombobox()

      open()
      await nextTick()

      const input = wrapper.find('input')

      // Navigate to Banana via two ArrowDowns
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      const atBanana = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')
      expect(atBanana?.text()).toBe('Banana')

      // Home back to first
      await input.trigger('keydown', { key: 'Home' })
      await nextTick()
      const atStart = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')

      expect(atStart?.text()).toBe('Apple')
    })

    it('navigates to last item on End', async () => {
      const { wrapper, open } = await createCombobox()

      open()
      await nextTick()

      const input = wrapper.find('input')

      // End goes directly to last item
      await input.trigger('keydown', { key: 'End' })
      await nextTick()
      const atEnd = wrapper.findAllComponents(Combobox.Item as any)
        .find(item => (item.element as HTMLElement).dataset.highlighted === '')

      expect(atEnd?.text()).toBe('Cherry')
    })
  })

  describe('input behavior', () => {
    it('typing updates query', async () => {
      const { wrapper, open, query } = await createCombobox()

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Ban')
      await input.trigger('input')
      await nextTick()

      expect(query()).toBe('Ban')
    })

    it('openOn=focus opens on focus', async () => {
      const { wrapper, isOpen } = await createCombobox({ openOn: 'focus' })

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('openOn=input opens on first keystroke', async () => {
      const { wrapper, isOpen } = await createCombobox({ openOn: 'input' })

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      // focus should NOT open when openOn=input
      await input.trigger('focus')
      await nextTick()
      expect(isOpen()).toBe(false)

      await input.setValue('A')
      await input.trigger('input')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('disabled input prevents interaction', async () => {
      const { wrapper, isOpen } = await createCombobox({ disabled: true })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
      expect(isOpen()).toBe(false)
    })
  })

  describe('strict mode', () => {
    it('reverts query to selected value on close', async () => {
      const selected = ref<string>('Apple')
      const { wrapper, open, close, query } = await createCombobox({
        'strict': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      // Type something that doesn't match selection
      const input = wrapper.find('input')
      await input.setValue('zzz')
      await input.trigger('input')
      await nextTick()

      close()
      await nextTick()

      // Should revert to selected value
      expect(query()).toBe('Apple')
    })

    it('clears query if nothing selected on close in strict mode', async () => {
      const { wrapper, open, close, query } = await createCombobox({ strict: true })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('zzz')
      await input.trigger('input')
      await nextTick()

      close()
      await nextTick()

      expect(query()).toBe('')
    })

    it('non-strict mode clears query on close', async () => {
      const { wrapper, open, close, query } = await createCombobox({ strict: false })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('partial')
      await input.trigger('input')
      await nextTick()

      close()
      await nextTick()

      expect(query()).toBe('')
    })
  })

  describe('accessibility', () => {
    it('input has role=combobox', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('role')).toBe('combobox')
    })

    it('input has aria-autocomplete=list when not strict', async () => {
      const { wrapper } = await createCombobox({ strict: false })

      const input = wrapper.find('input')
      expect(input.attributes('aria-autocomplete')).toBe('list')
    })

    it('input has aria-autocomplete=both when strict', async () => {
      const { wrapper } = await createCombobox({ strict: true })

      const input = wrapper.find('input')
      expect(input.attributes('aria-autocomplete')).toBe('both')
    })

    it('input has aria-expanded reflecting open state', async () => {
      const { wrapper, open, isOpen } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-expanded')).toBe('false')

      open()
      await nextTick()

      expect(isOpen()).toBe(true)
      expect(input.attributes('aria-expanded')).toBe('true')
    })

    it('input has aria-haspopup=listbox', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-haspopup')).toBe('listbox')
    })

    it('input has aria-controls pointing to listbox', async () => {
      const { wrapper } = await createCombobox({ id: 'a11y-test' })

      const input = wrapper.find('input')
      expect(input.attributes('aria-controls')).toBe('a11y-test-listbox')
    })

    it('input has aria-disabled when disabled', async () => {
      const { wrapper } = await createCombobox({ disabled: true })

      const input = wrapper.find('input')
      expect(input.attributes('aria-disabled')).toBeDefined()
    })

    it('content has role=listbox', async () => {
      const { wrapper } = await createCombobox()

      const content = wrapper.findComponent(Combobox.Content as any)
      expect(content.attributes('role')).toBe('listbox')
    })

    it('content has aria-labelledby pointing to input', async () => {
      const { wrapper } = await createCombobox({ id: 'a11y-test' })

      const content = wrapper.findComponent(Combobox.Content as any)
      expect(content.attributes('aria-labelledby')).toBe('a11y-test-input')
    })

    it('content has aria-multiselectable when multiple', async () => {
      const { wrapper } = await createCombobox({ multiple: true })

      const content = wrapper.findComponent(Combobox.Content as any)
      expect(content.attributes('aria-multiselectable')).toBeTruthy()
    })

    it('items have role=option, aria-selected, aria-disabled', async () => {
      const { itemSlotProps } = await createCombobox({
        items: [
          { value: 'Apple' },
          { value: 'Banana', disabled: true },
        ],
      })

      const apple = itemSlotProps.value.Apple as { attrs: Record<string, unknown> }
      const banana = itemSlotProps.value.Banana as { attrs: Record<string, unknown> }

      expect(apple.attrs.role).toBe('option')
      expect(apple.attrs['aria-selected']).toBe(false)
      expect(apple.attrs['aria-disabled']).toBeUndefined()

      expect(banana.attrs.role).toBe('option')
      expect(banana.attrs['aria-disabled']).toBe(true)
    })
  })

  describe('form integration', () => {
    it('renders hidden input when name prop set', async () => {
      const selected = ref<string>('Apple')
      const { wrapper } = await createCombobox({
        'name': 'fruit',
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      const inputs = wrapper.findAll('input[type="hidden"]')
      expect(inputs.length).toBeGreaterThanOrEqual(1)
      expect(inputs[0]?.attributes('name')).toBe('fruit')
    })

    it('hidden input has correct value', async () => {
      const selected = ref<string>('Banana')
      const { wrapper } = await createCombobox({
        'name': 'fruit',
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      const inputs = wrapper.findAll('input[type="hidden"]')
      expect(inputs[0]?.attributes('value')).toBe('Banana')
    })

    it('renders multiple hidden inputs for multi-select', async () => {
      const selected = ref<string[]>(['Apple', 'Cherry'])
      const { wrapper } = await createCombobox({
        'name': 'fruits',
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      const inputs = wrapper.findAll('input[type="hidden"]')
      expect(inputs.length).toBe(2)
      const values = inputs.map(i => i.attributes('value'))
      expect(values).toContain('Apple')
      expect(values).toContain('Cherry')
    })
  })

  describe('open/close behavior', () => {
    it('input focus opens dropdown', async () => {
      const { wrapper, isOpen } = await createCombobox()

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('cue click opens dropdown when closed', async () => {
      const { wrapper, isOpen } = await createCombobox()

      expect(isOpen()).toBe(false)

      const cue = wrapper.findComponent(Combobox.Cue as any)
      await cue.trigger('click')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('cue click closes dropdown when opened programmatically', async () => {
      const { wrapper, open, isOpen } = await createCombobox()

      open()
      await nextTick()
      expect(isOpen()).toBe(true)

      // Click only the cue element itself, stop propagation to prevent Activator's onClick
      const cueEl = wrapper.findComponent(Combobox.Cue as any).element as HTMLElement
      const event = new MouseEvent('click', { bubbles: false, cancelable: true })
      cueEl.dispatchEvent(event)
      await nextTick()

      expect(isOpen()).toBe(false)
    })

    it('auto-closes after single selection', async () => {
      const selected = ref<string>()
      const { itemSlotProps, open, isOpen } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()
      expect(isOpen()).toBe(true)

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()

      expect(isOpen()).toBe(false)
    })

    it('stays open in multi-select mode', async () => {
      const selected = ref<string[]>([])
      const { itemSlotProps, open, isOpen } = await createCombobox({
        'multiple': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      ;(itemSlotProps.value.Apple as { select: () => void }).select()
      await nextTick()

      expect(isOpen()).toBe(true)
    })
  })

  describe('root slot props', () => {
    it('exposes query, isOpen, isEmpty, isLoading, open, close, toggle, clear', () => {
      let sp: Record<string, unknown>

      mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, {}, {
              default: (slotProps: Record<string, unknown>) => {
                sp = slotProps
                return h('div')
              },
            })
          },
        }),
        { attachTo: document.body },
      )

      expect(typeof sp!.query).toBe('string')
      expect(typeof sp!.isOpen).toBe('boolean')
      expect(typeof sp!.isEmpty).toBe('boolean')
      expect(typeof sp!.isLoading).toBe('boolean')
      expect(typeof sp!.open).toBe('function')
      expect(typeof sp!.close).toBe('function')
      expect(typeof sp!.toggle).toBe('function')
      expect(typeof sp!.clear).toBe('function')
    })

    it('clear resets query and selection', async () => {
      const selected = ref<string>('Apple')
      const { wrapper, open, clear, query } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('App')
      await input.trigger('input')
      await nextTick()

      clear()
      await nextTick()

      expect(query()).toBe('')
    })
  })

  describe('description', () => {
    it('sets aria-describedby on control when Description is mounted', async () => {
      const wrapper = mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, { id: 'desc-test' }, {
              default: () => [
                h(Combobox.Activator as any, {}, {
                  default: () => h(Combobox.Control as any),
                }),
                h(Combobox.Description as any, {}, {
                  default: () => 'Help text',
                }),
              ],
            })
          },
        }),
        { attachTo: document.body },
      )

      await nextTick()

      const input = wrapper.find('input')
      expect(input.attributes('aria-describedby')).toBe('desc-test-description')

      const desc = wrapper.findComponent(Combobox.Description as any)
      expect(desc.attributes('id')).toBe('desc-test-description')
    })

    it('does not set aria-describedby when Description is absent', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-describedby')).toBeUndefined()
    })
  })

  describe('error', () => {
    it('sets aria-errormessage and aria-invalid when errors exist', async () => {
      const wrapper = mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, {
              id: 'err-test',
              errorMessages: ['Required'],
            }, {
              default: () => [
                h(Combobox.Activator as any, {}, {
                  default: () => h(Combobox.Control as any),
                }),
                h(Combobox.Error as any, {}, {
                  default: (sp: { errors: string[] }) => sp.errors.join(', '),
                }),
              ],
            })
          },
        }),
        { attachTo: document.body },
      )

      await nextTick()

      const input = wrapper.find('input')
      expect(input.attributes('aria-errormessage')).toBe('err-test-error')
      expect(input.attributes('aria-invalid')).toBe('true')

      const error = wrapper.findComponent(Combobox.Error as any)
      expect(error.attributes('id')).toBe('err-test-error')
      expect(error.attributes('aria-live')).toBe('polite')
      expect(error.attributes('data-state')).toBe('visible')
    })

    it('does not set aria-errormessage when Error is absent', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-errormessage')).toBeUndefined()
      expect(input.attributes('aria-invalid')).toBeUndefined()
    })

    it('error prop forces invalid without messages', async () => {
      const wrapper = mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, {
              id: 'err-force',
              error: true,
            }, {
              default: () => [
                h(Combobox.Activator as any, {}, {
                  default: () => h(Combobox.Control as any),
                }),
                h(Combobox.Error as any, {}, {
                  default: () => 'Error zone',
                }),
              ],
            })
          },
        }),
        { attachTo: document.body },
      )

      await nextTick()

      const input = wrapper.find('input')
      expect(input.attributes('aria-invalid')).toBe('true')

      const error = wrapper.findComponent(Combobox.Error as any)
      expect(error.attributes('data-state')).toBe('hidden')
    })

    it('exposes errors and isValid in root slot props', () => {
      let sp: Record<string, unknown>

      mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, {
              errorMessages: ['Field required'],
            }, {
              default: (slotProps: Record<string, unknown>) => {
                sp = slotProps
                return h('div')
              },
            })
          },
        }),
        { attachTo: document.body },
      )

      expect(sp!.errors).toEqual(['Field required'])
      expect(sp!.isValid).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles empty items list', async () => {
      const { wrapper } = await createCombobox({ items: [] })

      expect(wrapper.findComponent(Combobox.Root as any).exists()).toBe(true)
    })

    it('does not select disabled items on click', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
        'items': [
          { value: 'Apple' },
          { value: 'Banana', disabled: true },
          { value: 'Cherry' },
        ],
      })

      open()
      await nextTick()

      const items = wrapper.findAllComponents(Combobox.Item as any)
      const banana = items.find(i => i.text() === 'Banana')
      await banana!.trigger('click')
      await nextTick()

      expect(selected.value).toBeUndefined()
    })

    it('handles dynamic item removal', async () => {
      const items = ref([
        { value: 'Apple' },
        { value: 'Banana' },
        { value: 'Cherry' },
      ])
      const selected = ref<string>('Banana')
      const itemSlotProps: Record<string, unknown> = {}
      let ctx: { open: () => void }

      mount(
        defineComponent({
          setup () {
            return { items }
          },
          render () {
            return h(Combobox.Root as any, {
              'modelValue': selected.value,
              'onUpdate:modelValue': (v: unknown) => {
                selected.value = v as string
              },
            }, {
              default: (sp: { open: () => void }) => {
                ctx = sp
                return [
                  h(Combobox.Activator as any, {}, {
                    default: () => h(Combobox.Control as any),
                  }),
                  h(Combobox.Content as any, {}, {
                    default: () => this.items.map((item: { value: string }) =>
                      h(Combobox.Item as any, { key: item.value, value: item.value }, {
                        default: (sp: Record<string, unknown>) => {
                          itemSlotProps[item.value] = sp
                          return h('div', item.value)
                        },
                      }),
                    ),
                  }),
                ]
              },
            })
          },
        }),
        { attachTo: document.body },
      )

      await nextTick()
      ctx!.open()
      await nextTick()

      expect((itemSlotProps.Banana as { isSelected: boolean }).isSelected).toBe(true)

      // Remove the selected item
      items.value = [{ value: 'Apple' }, { value: 'Cherry' }]
      await nextTick()

      expect(selected.value).toBeUndefined()
    })
  })
})
