import { describe, expect, it } from 'vitest'

import { BuMenu } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BuMenuSection } from './index'

import { conform } from '../../../harness/conform'

const sections: BuMenuSection<string>[] = [
  {
    label: 'General',
    items: [
      { label: 'Dashboard' },
      { label: 'Customers' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Team Settings' },
      {
        label: 'Manage Your Team',
        children: [
          { label: 'Members' },
          { label: 'Plugins' },
          { label: 'Add a member' },
        ],
      },
      { label: 'Invitations' },
      { label: 'Cloud Storage Environment Settings' },
      { label: 'Authentication' },
    ],
  },
  {
    label: 'Transactions',
    items: [
      { label: 'Payments' },
      { label: 'Transfers' },
      { label: 'Balance' },
    ],
  },
]

function mount (component: Parameters<typeof createApp>[0]) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(component)
  app.mount(host)
  const el = host.firstElementChild!
  function unmount () {
    app.unmount()
    host.remove()
  }
  return { el, unmount }
}

describe('buMenu', () => {
  it('conforms to the menu fixture', () => {
    const { el, unmount } = mount({
      render: () => h(BuMenu as any, { items: sections, modelValue: 'Manage Your Team' }),
    })
    conform(el, 'menu')
    unmount()
  })

  it('drives is-active on the clicked anchor through v-model', async () => {
    const active = shallowRef<string>()
    const { el, unmount } = mount({
      setup () {
        return () => h(BuMenu as any, {
          'items': sections,
          'modelValue': active.value,
          'onUpdate:modelValue': (value: string) => {
            active.value = value
          },
        })
      },
    })

    const anchors = [...el.querySelectorAll('a')]
    const members = anchors.find(a => a.textContent === 'Members')!
    members.click()
    await nextTick()
    expect(active.value).toBe('Members')
    expect(members.classList.contains('is-active')).toBe(true)

    const payments = anchors.find(a => a.textContent === 'Payments')!
    payments.click()
    await nextTick()
    expect(active.value).toBe('Payments')
    expect(members.classList.contains('is-active')).toBe(false)
    expect(payments.classList.contains('is-active')).toBe(true)

    unmount()
  })
})
