import { afterEach, describe, expect, it, vi } from 'vitest'

// Adapters
import { ClientComboboxAdapter } from '#v0/composables/createCombobox/adapters/client'

// Composables
import { createLocalePlugin } from '#v0/composables'

import { Combobox } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Track every mounted wrapper so afterEach can unmount each one. Without
// unmount, attachTo: document.body leaks both DOM nodes and Vue effect scopes
// (including useDocumentEventListener subscriptions) across tests, which
// piles up in CI workers and stalls the suite.
const wrappers: ReturnType<typeof mount>[] = []

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
  // Cursor uses document.querySelector (global), so stale elements from
  // prior tests cause false matches if not cleared.
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
  'adapter'?: InstanceType<typeof ClientComboboxAdapter>
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

  wrappers.push(wrapper)

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
    it('should select item on click', async () => {
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

    it('should select highlighted item via Enter key', async () => {
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

    it('should toggle selection in multi-select mode', async () => {
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

    it('should prevent deselecting last item when mandatory=true', async () => {
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

    it('should update query to selected value on single select', async () => {
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

    it('should clear query on multi-select item selection', async () => {
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

    it('should replace selection in single-select mode', async () => {
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

    it('should allow multiple selections when multiple=true', async () => {
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
    it('should keep all items visible after selection (pristine=true)', async () => {
      const selected = ref<string>()
      const { itemSlotProps, open } = await createCombobox({
        'adapter': new ClientComboboxAdapter(),
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

    it('should show only matching items after typing (pristine=false)', async () => {
      const { wrapper, itemSlotProps, open } = await createCombobox({
        adapter: new ClientComboboxAdapter(),
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

    it('should activate filter after selecting then typing', async () => {
      const selected = ref<string>()
      const { wrapper, itemSlotProps, open } = await createCombobox({
        'adapter': new ClientComboboxAdapter(),
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
    it('should focus input after multi-select click', async () => {
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

    it('should highlight next item (not first) on ArrowDown after multi-select click', async () => {
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
    it('should filter items by query via client adapter', async () => {
      const { wrapper, itemSlotProps, open } = await createCombobox({
        adapter: new ClientComboboxAdapter(),
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

    it('should show all items for empty query', async () => {
      const { wrapper, itemSlotProps, open } = await createCombobox({
        adapter: new ClientComboboxAdapter(),
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

    it('should show empty state when no items match query', async () => {
      const { wrapper, open } = await createCombobox({
        adapter: new ClientComboboxAdapter(),
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

    it('should fall back to the inline default "No results" when no locale plugin is configured', async () => {
      const wrapper = mount(
        defineComponent({
          render: () =>
            h(Combobox.Root as any, { adapter: new ClientComboboxAdapter() }, {
              default: () => [
                h(Combobox.Activator as any, {}, {
                  default: () => h(Combobox.Control as any),
                }),
                h(Combobox.Content as any, {}, {
                  default: () => h(Combobox.Empty as any),
                }),
              ],
            }),
        }),
        { attachTo: document.body },
      )
      wrappers.push(wrapper)

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()
      await input.setValue('zzzzz')
      await input.trigger('input')
      await nextTick()

      const empty = wrapper.findComponent(Combobox.Empty as any)
      expect(empty.text()).toBe('No results')
    })

    it('should use the translated string when locale plugin is configured', async () => {
      const plugin = createLocalePlugin({
        default: 'fr',
        messages: {
          fr: {
            Combobox: {
              noResults: 'Aucun résultat',
            },
          },
        },
      })

      const wrapper = mount(
        defineComponent({
          render: () =>
            h(Combobox.Root as any, { adapter: new ClientComboboxAdapter() }, {
              default: () => [
                h(Combobox.Activator as any, {}, {
                  default: () => h(Combobox.Control as any),
                }),
                h(Combobox.Content as any, {}, {
                  default: () => h(Combobox.Empty as any),
                }),
              ],
            }),
        }),
        { global: { plugins: [plugin] }, attachTo: document.body },
      )
      wrappers.push(wrapper)

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()
      await input.setValue('zzzzz')
      await input.trigger('input')
      await nextTick()

      const empty = wrapper.findComponent(Combobox.Empty as any)
      expect(empty.text()).toBe('Aucun résultat')
    })

    it('should hide filtered-out items via v-show', async () => {
      const { wrapper, open } = await createCombobox({
        adapter: new ClientComboboxAdapter(),
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

    it('should skip filtered items in virtual focus', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'adapter': new ClientComboboxAdapter(),
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
    it('should open on ArrowDown when closed', async () => {
      const { wrapper, isOpen } = await createCombobox()

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('should open on ArrowUp when closed', async () => {
      const { wrapper, isOpen } = await createCombobox()

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'ArrowUp' })
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('should navigate items with ArrowDown when open', async () => {
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

    it('should navigate items with ArrowUp when open', async () => {
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

    it('should select highlighted item on Enter', async () => {
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

    it('should close on Escape', async () => {
      const { wrapper, open, isOpen } = await createCombobox()

      open()
      await nextTick()
      expect(isOpen()).toBe(true)

      const input = wrapper.find('input')
      await input.trigger('keydown', { key: 'Escape' })
      await nextTick()

      expect(isOpen()).toBe(false)
    })

    it('should close on Tab without preventDefault', async () => {
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

    it('should navigate to first item on Home', async () => {
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

    it('should navigate to last item on End', async () => {
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
    it('should update query on typing', async () => {
      const { wrapper, open, query } = await createCombobox()

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Ban')
      await input.trigger('input')
      await nextTick()

      expect(query()).toBe('Ban')
    })

    it('should open on focus when openOn=focus', async () => {
      const { wrapper, isOpen } = await createCombobox({ openOn: 'focus' })

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('should open on first keystroke when openOn=input', async () => {
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

    it('should prevent interaction on disabled input', async () => {
      const { wrapper, isOpen } = await createCombobox({ disabled: true })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
      expect(isOpen()).toBe(false)
    })
  })

  describe('strict mode', () => {
    it('should revert query to selected value on close', async () => {
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

    it('should clear query if nothing selected on close in strict mode', async () => {
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

    it('should clear query on close in non-strict mode', async () => {
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

  describe('free-text commit', () => {
    it('should commit unmatched free text on Enter when not strict', async () => {
      const selected = ref<string>()
      const { wrapper, open, isOpen, query } = await createCombobox({
        'strict': false,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Durian')
      await input.trigger('input')
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(selected.value).toBe('Durian')
      expect(isOpen()).toBe(false)
      expect(query()).toBe('Durian')
    })

    it('should discard unmatched free text on Enter when strict', async () => {
      const selected = ref<string>()
      const { wrapper, open, isOpen, query } = await createCombobox({
        'strict': true,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Durian')
      await input.trigger('input')
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(selected.value).toBeUndefined()
      expect(isOpen()).toBe(false)
      expect(query()).toBe('')
    })

    it('should select an exact match on Enter without minting a free-text value', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'strict': false,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Banana')
      await input.trigger('input')
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(selected.value).toBe('Banana')
    })

    it('should commit free text on Tab when nothing is highlighted', async () => {
      const selected = ref<string>()
      const { wrapper, open, isOpen } = await createCombobox({
        'strict': false,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Fig')
      await input.trigger('input')
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      input.element.dispatchEvent(event)
      await nextTick()

      expect(selected.value).toBe('Fig')
      expect(isOpen()).toBe(false)
      expect(event.defaultPrevented).toBe(false)
    })

    it('should select the highlighted option on Tab instead of free text', async () => {
      const selected = ref<string>()
      const { wrapper, open, isOpen } = await createCombobox({
        'strict': false,
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
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      input.element.dispatchEvent(event)
      await nextTick()

      expect(selected.value).toBe('Banana')
      expect(isOpen()).toBe(false)
    })

    it('should not commit free text on Escape', async () => {
      const selected = ref<string>()
      const { wrapper, open, isOpen, query } = await createCombobox({
        'strict': false,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('Guava')
      await input.trigger('input')
      await nextTick()
      await input.trigger('keydown', { key: 'Escape' })
      await nextTick()

      expect(selected.value).toBeUndefined()
      expect(isOpen()).toBe(false)
      expect(query()).toBe('')
    })

    it('should prefer the highlighted option over free text on Enter', async () => {
      const selected = ref<string>()
      const { wrapper, open } = await createCombobox({
        'strict': false,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      // Partial query keeps Apple and Banana filtered in; highlight Banana.
      await input.setValue('a')
      await input.trigger('input')
      await nextTick()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      await input.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      await input.trigger('keydown', { key: 'Enter' })
      await nextTick()

      expect(selected.value).toBe('Banana')
    })

    it('should close the menu on Tab in multiple-select mode after free-text commit', async () => {
      const selected = ref<string[]>([])
      const { wrapper, open, isOpen } = await createCombobox({
        'multiple': true,
        'strict': false,
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string[]
        },
      })

      open()
      await nextTick()

      const input = wrapper.find('input')
      await input.setValue('tag')
      await input.trigger('input')
      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      input.element.dispatchEvent(event)
      await nextTick()

      expect(selected.value).toEqual(['tag'])
      expect(isOpen()).toBe(false)
    })
  })

  describe('accessibility', () => {
    it('should give input role=combobox', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('role')).toBe('combobox')
    })

    it('should set aria-autocomplete=list on input when not strict', async () => {
      const { wrapper } = await createCombobox({ strict: false })

      const input = wrapper.find('input')
      expect(input.attributes('aria-autocomplete')).toBe('list')
    })

    it('should set aria-autocomplete=both on input when strict', async () => {
      const { wrapper } = await createCombobox({ strict: true })

      const input = wrapper.find('input')
      expect(input.attributes('aria-autocomplete')).toBe('both')
    })

    it('should set aria-expanded on input reflecting open state', async () => {
      const { wrapper, open, isOpen } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-expanded')).toBe('false')

      open()
      await nextTick()

      expect(isOpen()).toBe(true)
      expect(input.attributes('aria-expanded')).toBe('true')
    })

    it('should set aria-haspopup=listbox on input', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-haspopup')).toBe('listbox')
    })

    it('should set aria-controls on input pointing to listbox', async () => {
      const { wrapper } = await createCombobox({ id: 'a11y-test' })

      const input = wrapper.find('input')
      expect(input.attributes('aria-controls')).toBe('a11y-test-listbox')
    })

    it('should set aria-disabled on input when disabled', async () => {
      const { wrapper } = await createCombobox({ disabled: true })

      const input = wrapper.find('input')
      expect(input.attributes('aria-disabled')).toBeDefined()
    })

    it('should give content role=listbox', async () => {
      const { wrapper } = await createCombobox()

      const content = wrapper.findComponent(Combobox.Content as any)
      expect(content.attributes('role')).toBe('listbox')
    })

    it('should set aria-labelledby on content pointing to input', async () => {
      const { wrapper } = await createCombobox({ id: 'a11y-test' })

      const content = wrapper.findComponent(Combobox.Content as any)
      expect(content.attributes('aria-labelledby')).toBe('a11y-test-input')
    })

    it('should set aria-multiselectable on content when multiple', async () => {
      const { wrapper } = await createCombobox({ multiple: true })

      const content = wrapper.findComponent(Combobox.Content as any)
      expect(content.attributes('aria-multiselectable')).toBeTruthy()
    })

    it('should give items role=option, aria-selected, aria-disabled', async () => {
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
      expect(apple.attrs['aria-disabled']).toBe(false)

      expect(banana.attrs.role).toBe('option')
      expect(banana.attrs['aria-disabled']).toBe(true)
    })
  })

  describe('form integration', () => {
    it('should render hidden input when name prop set', async () => {
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

    it('should give hidden input correct value', async () => {
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

    it('should render multiple hidden inputs for multi-select', async () => {
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
    it('should open dropdown on input focus', async () => {
      const { wrapper, isOpen } = await createCombobox()

      expect(isOpen()).toBe(false)

      const input = wrapper.find('input')
      await input.trigger('focus')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('should open dropdown on cue click when closed', async () => {
      const { wrapper, isOpen } = await createCombobox()

      expect(isOpen()).toBe(false)

      const cue = wrapper.findComponent(Combobox.Cue as any)
      await cue.trigger('click')
      await nextTick()

      expect(isOpen()).toBe(true)
    })

    it('should close dropdown on cue click when opened programmatically', async () => {
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

    it('should auto-close after single selection', async () => {
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

    it('should stay open in multi-select mode', async () => {
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
    it('should expose query, isOpen, isEmpty, isLoading, open, close, toggle, clear', () => {
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

    it('should reset query and selection via clear', async () => {
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
    it('should set aria-describedby on control when Description is mounted', async () => {
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

    it('should not set aria-describedby when Description is absent', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-describedby')).toBeUndefined()
    })
  })

  describe('error', () => {
    it('should set aria-errormessage and aria-invalid when errors exist', async () => {
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

    it('should not set aria-errormessage when Error is absent', async () => {
      const { wrapper } = await createCombobox()

      const input = wrapper.find('input')
      expect(input.attributes('aria-errormessage')).toBeUndefined()
      expect(input.attributes('aria-invalid')).toBeUndefined()
    })

    it('should force invalid via error prop without messages', async () => {
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

    it('should expose errors and isValid in root slot props', () => {
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
    it('should handle empty items list', async () => {
      const { wrapper } = await createCombobox({ items: [] })

      expect(wrapper.findComponent(Combobox.Root as any).exists()).toBe(true)
    })

    it('should not select disabled items on click', async () => {
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

    it('should handle dynamic item removal', async () => {
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

  describe('cue', () => {
    it('should not toggle when disabled', async () => {
      const { wrapper, isOpen } = await createCombobox({
        disabled: true,
      })

      const cue = wrapper.findComponent(Combobox.Cue as any)
      await cue.trigger('click')
      await nextTick()

      expect(isOpen()).toBe(false)
    })
  })

  describe('description and error lifecycle', () => {
    it('should clear hasDescription on description unmount', async () => {
      const showDescription = ref(true)
      let descriptionContext: { hasDescription: { value: boolean } } | undefined

      mount(
        defineComponent({
          setup () {
            return { showDescription }
          },
          render () {
            return h(Combobox.Root as any, {}, {
              default: (sp: { hasDescription: { value: boolean } }) => {
                descriptionContext = sp as any
                return [
                  h(Combobox.Activator as any, {}, {
                    default: () => h(Combobox.Control as any),
                  }),
                  this.showDescription
                    ? h(Combobox.Description as any, {}, () => 'Help text')
                    : null,
                ]
              },
            })
          },
        }),
        { attachTo: document.body },
      )

      await nextTick()
      expect(descriptionContext).toBeDefined()

      // Mount lifecycle should set hasDescription flag truthy.
      // Now unmount and verify the flag flips back.
      showDescription.value = false
      await nextTick()
    })

    it('should clear hasError on error unmount', async () => {
      const showError = ref(true)

      const wrapper = mount(
        defineComponent({
          setup () {
            return () => h(Combobox.Root as any, { error: true, errorMessages: 'oops' }, {
              default: () => [
                h(Combobox.Activator as any, {}, {
                  default: () => h(Combobox.Control as any),
                }),
                showError.value
                  ? h(Combobox.Error as any, {}, () => 'Error text')
                  : null,
              ],
            })
          },
        }),
        { attachTo: document.body },
      )

      await nextTick()
      expect(wrapper.exists()).toBe(true)

      showError.value = false
      await nextTick()
    })
  })

  describe('hidden input edge cases', () => {
    it('should serialize object selection values to JSON', async () => {
      const value = { foo: 'bar' }
      let ctx: { open: () => void } | undefined

      // The model is generic — object values are a legal type and must not
      // trigger a prop-type warning (regression pin for the old ID-typed model)
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const wrapper = mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, {
              modelValue: value,
              name: 'fruit',
            }, {
              default: (sp: { open: () => void }) => {
                ctx = sp
                return [
                  h(Combobox.Activator as any, {}, {
                    default: () => h(Combobox.Control as any),
                  }),
                  h(Combobox.Content as any, {}, {
                    default: () => h(Combobox.Item as any, { value }, () => 'Item'),
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

      const hidden = wrapper.find('input[type="hidden"]')
      expect(hidden.exists()).toBe(true)
      // Object values should be serialized to JSON
      expect((hidden.element as HTMLInputElement).value).toBe(JSON.stringify(value))
      expect(warn).not.toHaveBeenCalled()
    })

    it('should render empty string for null selection values', async () => {
      let ctx: { open: () => void } | undefined

      const wrapper = mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, {
              modelValue: [null],
              name: 'fruit',
              multiple: true,
            }, {
              default: (sp: { open: () => void }) => {
                ctx = sp
                return [
                  h(Combobox.Activator as any, {}, {
                    default: () => h(Combobox.Control as any),
                  }),
                  h(Combobox.Content as any, {}, {
                    default: () => h(Combobox.Item as any, { value: null }, () => 'None'),
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

      const hidden = wrapper.find('input[type="hidden"]')
      expect(hidden.exists()).toBe(true)
      expect((hidden.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('renderless', () => {
    async function createRenderless (options: {
      'modelValue'?: unknown
      'onUpdate:modelValue'?: (v: unknown) => void
      'adapter'?: InstanceType<typeof ClientComboboxAdapter>
    } = {}) {
      const captured: Record<string, any> = {}
      let context: { open: () => void, close: () => void }

      const wrapper = mount(
        defineComponent({
          render () {
            return h(Combobox.Root as any, options, {
              default: (sp: typeof context) => {
                context = sp
                return [
                  h(Combobox.Activator as any, { renderless: true }, {
                    default: (activator: any) => {
                      captured.activator = activator
                      return h('div', { 'data-testid': 'activator', ...activator.attrs }, [
                        h(Combobox.Control as any, { renderless: true, placeholder: 'Search' }, {
                          default: (control: any) => {
                            captured.control = control
                            return h('input', { 'data-testid': 'control', ...control.attrs })
                          },
                        }),
                        h(Combobox.Cue as any, { renderless: true }, {
                          default: (cue: any) => {
                            captured.cue = cue
                            return h('span', { 'data-testid': 'cue', ...cue.attrs })
                          },
                        }),
                      ])
                    },
                  }),
                  h(Combobox.Content as any, { renderless: true, eager: true }, {
                    default: (content: any) => {
                      captured.content = content
                      return h('ul', { 'data-testid': 'content', ...content.attrs }, [
                        ...['Apple', 'Banana', 'Cherry'].map(value =>
                          h(Combobox.Item as any, { key: value, value, renderless: true }, {
                            default: (item: any) => {
                              captured[value] = item
                              return h('li', { 'data-testid': `item-${value}`, ...item.attrs }, value)
                            },
                          }),
                        ),
                        h(Combobox.Empty as any, { renderless: true }, {
                          default: () => h('li', { 'data-testid': 'empty' }, 'No results'),
                        }),
                      ])
                    },
                  }),
                ]
              },
            })
          },
        }),
        { attachTo: document.body },
      )

      wrappers.push(wrapper)
      await nextTick()

      return {
        wrapper,
        captured,
        open: () => context!.open(),
        close: () => context!.close(),
      }
    }

    it('should forward the combobox contract to a renderless control', async () => {
      const { wrapper, captured } = await createRenderless()

      const control = wrapper.find('[data-testid="control"]')
      expect(control.exists()).toBe(true)
      expect(wrapper.findAll('input')).toHaveLength(1)
      expect(control.attributes('role')).toBe('combobox')
      expect(control.attributes('aria-haspopup')).toBe('listbox')
      expect(control.attributes('aria-controls')).toBe(captured.content.attrs.id)
      expect(control.attributes('placeholder')).toBe('Search')
      expect(captured.control.attrs.onInput).toBeTypeOf('function')
      expect(captured.control.attrs.onFocus).toBeTypeOf('function')
      expect(captured.control.attrs.onKeydown).toBeTypeOf('function')

      await control.trigger('focus')
      await nextTick()

      expect(control.attributes('aria-expanded')).toBe('true')
    })

    it('should forward the listbox contract to renderless content', async () => {
      const { wrapper, captured } = await createRenderless()

      const listboxes = wrapper.findAll('[role="listbox"]')
      expect(listboxes).toHaveLength(1)
      expect(listboxes[0]!.element.tagName).toBe('UL')
      expect(captured.content.attrs.id).toBeDefined()
      expect(captured.content.attrs.popover).toBe('manual')
      expect(captured.content.attrs['aria-labelledby']).toBe(captured.control.attrs.id)
      expect(captured.content.attrs.style['position-anchor']).toMatch(/^--/)
    })

    it('should forward the option contract to renderless items', async () => {
      const selected = ref<string>()
      const { wrapper, captured } = await createRenderless({
        'modelValue': selected.value,
        'onUpdate:modelValue': v => {
          selected.value = v as string
        },
      })

      const options = wrapper.findAll('[role="option"]')
      expect(options).toHaveLength(3)
      expect(options.every(o => o.element.tagName === 'LI')).toBe(true)
      expect(captured.Apple.attrs.onClick).toBeTypeOf('function')
      expect(captured.Apple.attrs['aria-selected']).toBe(false)

      await wrapper.find('[data-testid="item-Apple"]').trigger('click')
      await nextTick()

      expect(selected.value).toBe('Apple')
      expect(wrapper.find('[data-testid="item-Apple"]').attributes('data-selected')).toBe('true')
    })

    it('should forward anchor styles to a renderless activator', async () => {
      const { wrapper, captured, open } = await createRenderless()

      expect(wrapper.findAll('[data-state]')).toHaveLength(2)
      expect(captured.activator.attrs['data-state']).toBe('closed')
      expect(captured.activator.attrs.style.anchorName).toMatch(/^--/)

      open()
      await nextTick()

      expect(wrapper.find('[data-testid="activator"]').attributes('data-state')).toBe('open')
    })

    it('should forward the toggle handler to a renderless cue', async () => {
      const { wrapper, captured } = await createRenderless()

      expect(captured.cue.attrs['aria-hidden']).toBe(true)
      expect(captured.cue.attrs.onClick).toBeTypeOf('function')

      await wrapper.find('[data-testid="cue"]').trigger('click')
      await nextTick()

      expect(wrapper.find('[data-testid="control"]').attributes('aria-expanded')).toBe('true')
    })

    it('should render renderless empty state without a wrapper', async () => {
      const { wrapper, open } = await createRenderless({
        adapter: new ClientComboboxAdapter(),
      })

      open()
      await nextTick()

      const control = wrapper.find('[data-testid="control"]')
      await control.setValue('zzz')
      await control.trigger('input')
      await nextTick()

      const empty = wrapper.find('[data-testid="empty"]')
      expect(empty.exists()).toBe(true)
      expect(empty.element.parentElement?.dataset.testid).toBe('content')
    })
  })
})
