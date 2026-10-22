import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BCombobox } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BComboboxItem } from './BCombobox.vue'
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const TOLERATE = { ignoreAttrs: ['style'] }

const OPTIONS: BComboboxItem[] = [
  { value: '1', text: 'Option one' },
  { value: '2', text: 'Option two' },
  { value: '3', text: 'Option three' },
]

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bCombobox', () => {
  it('should conform to the placeholder toggle', async () => {
    const host = mount(() => h(BCombobox, {
      items: OPTIONS,
      placeholder: 'Select an item…',
    }))
    await settle()

    conform(host.querySelector('button.combobox-toggle')!, 'combobox:placeholder', TOLERATE)
    expect(host.innerHTML).not.toContain('data-bs-toggle')
    expect(host.innerHTML).not.toContain('data-bs-value')
    expect(host.querySelector('.menu')!.classList.contains('show')).toBe(false)
  })

  it('should conform to the selected toggle and the open menu', async () => {
    const host = mount(() => h(BCombobox, {
      items: OPTIONS,
      modelValue: '2',
      placeholder: 'Select an item…',
    }))
    await settle()

    conform(host.querySelector('button.combobox-toggle')!, 'combobox:selected', TOLERATE)

    await userEvent.click(host.querySelector('button.combobox-toggle')!)
    await settle()

    conform(host.querySelector('.menu')!, 'combobox:menu', TOLERATE)
  })

  it('should open an empty menu', async () => {
    const host = mount(() => h(BCombobox, {
      items: [],
      placeholder: 'Select an item…',
    }))
    await settle()

    await userEvent.click(host.querySelector('button.combobox-toggle')!)
    await settle()

    conform(host.querySelector('.menu')!, 'combobox:empty', TOLERATE)
  })

  it('should select a value and close', async () => {
    const model = shallowRef<string | undefined>()
    const host = mount(() => h(BCombobox, {
      'items': OPTIONS,
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string | undefined) => {
        model.value = value
      },
      'placeholder': 'Select an item…',
    }))
    await settle()

    await userEvent.click(host.querySelector('button.combobox-toggle')!)
    await settle()
    await userEvent.click(host.querySelector('.menu-item')!)
    await settle()

    expect(model.value).toBe('1')
    expect(host.querySelector('.menu')!.classList.contains('show')).toBe(false)
  })

  it('should submit the value through a hidden input when name is set', async () => {
    const host = mount(() => h(BCombobox, {
      items: [{ value: 'us', text: 'United States' }],
      modelValue: 'us',
      name: 'country',
    }))
    await settle()

    const hidden = host.querySelector('input[type="hidden"]')
    expect(hidden?.getAttribute('name')).toBe('country')
    expect(hidden?.getAttribute('value')).toBe('us')
  })
})
