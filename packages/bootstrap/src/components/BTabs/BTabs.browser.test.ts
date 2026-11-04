import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BTabs } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { ShallowRef, VNode } from 'vue'

import { conform } from '../../../harness/conform'

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

function tabs (current: ShallowRef<string | undefined>, props: Record<string, unknown> = {}) {
  return mount(() => h(BTabs, {
    ...props,
    'modelValue': current.value,
    'onUpdate:modelValue': (value: string | undefined) => {
      current.value = value
    },
  }, () => [
    h(BTabs.List, () => [
      h(BTabs.Item, { value: 'home' }, () => 'Home'),
      h(BTabs.Item, { value: 'profile' }, () => 'Profile'),
      h(BTabs.Item, { value: 'locked', disabled: true }, () => 'Disabled'),
    ]),
    h(BTabs.Content, () => [
      h(BTabs.Panel, { value: 'home' }, () => 'Home'),
      h(BTabs.Panel, { value: 'profile' }, () => 'Profile'),
    ]),
  ]))
}

describe('bTabs', () => {
  it('should conform to the tablist and the selected pane', async () => {
    const host = mount(() => h(BTabs, { modelValue: 'home' }, () => [
      h(BTabs.List, () => [
        h(BTabs.Item, { value: 'home' }, () => 'Home'),
      ]),
      h(BTabs.Content, () => [
        h(BTabs.Panel, { value: 'home' }, () => 'Home'),
      ]),
    ]))
    await settle()

    const button = host.querySelector('button')!

    conform(host.querySelector('ul')!, 'tabs:list')
    conform(host.querySelector('.tab-pane')!, 'tabs:pane')
    expect(Object.hasOwn(button.dataset, 'bsToggle')).toBe(false)
    expect(Object.hasOwn(button.dataset, 'bsTarget')).toBe(false)
  })

  it('should select the next enabled tab from the arrow key', async () => {
    const current = shallowRef('home')
    const host = tabs(current)
    await settle()

    const buttons = host.querySelectorAll('button')

    await userEvent.click(buttons[0]!)
    await userEvent.keyboard('{ArrowRight}')
    await settle()

    expect(current.value).toBe('profile')
    expect(buttons[1]!.getAttribute('aria-selected')).toBe('true')
    expect(buttons[1]!.classList.contains('active')).toBe(true)
    expect(buttons[2]!.disabled).toBe(true)
    expect(host.querySelectorAll('.tab-pane')[1]!.classList.contains('active')).toBe(true)
    expect(host.querySelector('.tab-pane')!.classList.contains('show')).toBe(false)
  })

  it('should use pills when vertical is set', async () => {
    const host = tabs(shallowRef('home'), { vertical: true, instant: true })
    await settle()

    const list = host.querySelector('ul')!

    expect(list.classList.contains('nav-pills')).toBe(true)
    expect(list.classList.contains('nav-pills-vertical')).toBe(true)
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    expect(host.querySelector('.tab-pane')!.classList.contains('tab-pane-instant')).toBe(true)
  })
})
