import { describe, expect, it } from 'vitest'

import { BuMenu } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BuMenuItem } from '../BuMenuItem'
import { BuMenuLabel } from '../BuMenuLabel'
import { BuMenuLink } from '../BuMenuLink'
import { BuMenuList } from '../BuMenuList'

function link (value: string, label = value) {
  return h(BuMenuItem, null, () => h(BuMenuLink, { value }, () => label))
}

function nested (value: string, children: string[]) {
  return h(BuMenuItem, null, () => [
    h(BuMenuLink, { value }, () => value),
    h(BuMenuList, { nested: true }, () => children.map(child => link(child))),
  ])
}

function menu (modelValue?: string, onUpdate?: (value: string) => void) {
  return h(BuMenu as any, {
    modelValue,
    'onUpdate:modelValue': onUpdate,
  }, () => [
    h(BuMenuLabel, null, () => 'General'),
    h(BuMenuList, null, () => [
      link('Dashboard'),
      link('Customers'),
    ]),
    h(BuMenuLabel, null, () => 'Administration'),
    h(BuMenuList, null, () => [
      link('Team Settings'),
      nested('Manage Your Team', ['Members', 'Plugins', 'Add a member']),
      link('Invitations'),
      link('Cloud Storage Environment Settings'),
      link('Authentication'),
    ]),
    h(BuMenuLabel, null, () => 'Transactions'),
    h(BuMenuList, null, () => [
      link('Payments'),
      link('Transfers'),
      link('Balance'),
    ]),
  ])
}

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
      render: () => menu('Manage Your Team'),
    })
    conform(el, 'menu')
    unmount()
  })

  it('drives is-active on the clicked anchor through v-model', async () => {
    const active = shallowRef<string>()
    const { el, unmount } = mount({
      setup () {
        return () => menu(active.value, value => {
          active.value = value
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
