import { describe, expect, it } from 'vitest'

import { BuTabs } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BuTab } from '../BuTab'
import { BuTabList } from '../BuTabList'
import { BuTabPanel } from '../BuTabPanel'

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
  return { el, host, unmount }
}

// Generic SFCs defeat h()'s overloads — same cast packages/0's own Tabs tests use.
function tab (value: string, label: string) {
  return h(BuTab as any, { value }, () => label)
}

function icon (classes: string, label: string) {
  return h(BuTab as any, { value: label }, () => [
    h('span', { class: 'icon is-small' }, [h('i', { 'class': classes, 'aria-hidden': 'true' })]),
    h('span', label),
  ])
}

describe('buTabs', () => {
  it('should conform to the basic tabs fixture', async () => {
    const { el, unmount } = mount({
      render: () => h(BuTabs as any, () => h(BuTabList, null, () => [
        tab('pictures', 'Pictures'),
        tab('music', 'Music'),
        tab('videos', 'Videos'),
        tab('documents', 'Documents'),
      ])),
    })

    await nextTick()

    conform(el, 'tabs')

    unmount()
  })

  it('should conform to the centered icon tabs fixture', async () => {
    const { el, unmount } = mount({
      render: () => h(BuTabs as any, () => h(BuTabList, { centered: true }, () => [
        icon('fas fa-image', 'Pictures'),
        icon('fas fa-music', 'Music'),
        icon('fas fa-film', 'Videos'),
        icon('far fa-file-alt', 'Documents'),
      ])),
    })

    await nextTick()

    conform(el, 'tabs:icons')

    unmount()
  })

  it('should auto-select the first tab and switch panels on click', async () => {
    const model = shallowRef<string>()

    const { el, host, unmount } = mount({
      render: () => h(BuTabs as any, {
        'modelValue': model.value,
        'onUpdate:modelValue': (value: unknown) => {
          model.value = value as string
        },
      }, () => [
        h(BuTabList, null, () => [tab('a', 'Alpha'), tab('b', 'Beta')]),
        h(BuTabPanel as any, { value: 'a' }, () => 'Alpha panel'),
        h(BuTabPanel as any, { value: 'b' }, () => 'Beta panel'),
      ]),
    })

    await nextTick()

    const items = el.querySelectorAll('li')
    const panels = host.querySelectorAll<HTMLElement>('[role="tabpanel"]')

    expect(model.value).toBe('a')
    expect(items[0]!.classList.contains('is-active')).toBe(true)
    expect(items[1]!.classList.contains('is-active')).toBe(false)
    expect(panels[0]!.hidden).toBe(false)
    expect(panels[1]!.hidden).toBe(true)

    el.querySelectorAll('a')[1]!.click()
    await nextTick()

    expect(model.value).toBe('b')
    expect(items[0]!.classList.contains('is-active')).toBe(false)
    expect(items[1]!.classList.contains('is-active')).toBe(true)
    expect(panels[0]!.hidden).toBe(true)
    expect(panels[1]!.hidden).toBe(false)

    unmount()
  })
})
