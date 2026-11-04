import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BFormAdorn } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

const teardowns: (() => void)[] = []

function mount (render: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
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

function rootOf (host: HTMLElement): HTMLElement {
  const root = host.querySelector('.form-adorn')
  if (!(root instanceof HTMLElement)) throw new Error('missing form adorn')
  return root
}

function field (icon = true) {
  return () => [
    icon ? h(BFormAdorn.Icon) : h(BFormAdorn.Text, () => '$'),
    h(BFormAdorn.Control),
  ]
}

describe('bFormAdorn', () => {
  it('should conform to the basic adornment', async () => {
    const host = mount(() => h(BFormAdorn, field()))
    await settle()

    const root = rootOf(host)

    conform(root, 'form-adorn:basic')
    expect(root.tagName).toBe('LABEL')
    expect(root.parentElement).toBe(host)
    expect(root.querySelector('input')?.classList.contains('form-ghost')).toBe(true)
  })

  it('should add form-adorn-end', async () => {
    const host = mount(() => h(BFormAdorn, { end: true }, field()))
    await settle()

    conform(rootOf(host), 'form-adorn:end')
  })

  it('should add form-control-sm and form-control-lg', async () => {
    const sm = mount(() => h(BFormAdorn, { size: 'sm' }, field()))
    const lg = mount(() => h(BFormAdorn, { size: 'lg' }, field()))
    await settle()

    conform(rootOf(sm), 'form-adorn:sm')
    conform(rootOf(lg), 'form-adorn:lg')
  })

  it('should conform to a text adornment', async () => {
    const host = mount(() => h(BFormAdorn, field(false)))
    await settle()

    const root = rootOf(host)

    conform(root, 'form-adorn:text')
    expect(root.querySelector('.form-adorn-text')?.getAttribute('aria-hidden')).toBe('true')
    expect(root.querySelector('.form-adorn-icon')).toBeNull()
  })

  it('should update the ghost input model', async () => {
    const query = shallowRef('')
    const host = mount(() => h(BFormAdorn, () => [
      h(BFormAdorn.Icon),
      h(BFormAdorn.Control, {
        'modelValue': query.value,
        'placeholder': 'Search...',
        'type': 'search',
        'onUpdate:modelValue': (value: string) => {
          query.value = value
        },
      }),
    ]))
    await settle()

    const input = rootOf(host).querySelector('input')
    if (!(input instanceof HTMLInputElement)) throw new Error('missing ghost input')

    expect(input.type).toBe('search')
    expect(input.placeholder).toBe('Search...')

    await userEvent.type(input, 'v0')
    await settle()

    expect(query.value).toBe('v0')
  })
})
