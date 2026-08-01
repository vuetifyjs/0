import { describe, expect, it } from 'vitest'

import { BuPanel } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { BuPanelItem } from './index'

import { conform } from '../../../harness/conform'

const tabs = ['All', 'Public', 'Private', 'Sources', 'Forks']

const repos: BuPanelItem<string>[] = [
  { label: 'bulma', icon: 'fas fa-book' },
  { label: 'marksheet', icon: 'fas fa-book' },
  { label: 'minireset.css', icon: 'fas fa-book' },
  { label: 'jgthms.github.io', icon: 'fas fa-book' },
  { label: 'daniellowtw/infboard', icon: 'fas fa-code-branch' },
  { label: 'mojs', icon: 'fas fa-code-branch' },
]

const slots = {
  start: () => h('div', { class: 'panel-block' }, [
    h('p', { class: 'control has-icons-left' }, [
      h('input', { class: 'input', type: 'text', placeholder: 'Search' }),
      h('span', { class: 'icon is-left' }, [
        h('i', { 'class': 'fas fa-search', 'aria-hidden': 'true' }),
      ]),
    ]),
  ]),
  default: () => [
    h('label', { class: 'panel-block' }, [
      h('input', { type: 'checkbox' }),
      ' remember me ',
    ]),
    h('div', { class: 'panel-block' }, [
      h('button', { class: 'button is-link is-outlined is-fullwidth' }, ' Reset all filters '),
    ]),
  ],
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

describe('buPanel', () => {
  it('conforms to the panel fixture', () => {
    const { el, unmount } = mount({
      render: () => h(BuPanel as any, {
        heading: 'Repositories',
        tabs,
        items: repos,
        modelValue: 'bulma',
      }, slots),
    })
    conform(el, 'panel')
    unmount()
  })

  it('keeps the tab scope and the block scope independent', async () => {
    const selected = shallowRef<string | string[]>('bulma')
    const tabbed = shallowRef<string>()
    const { el, unmount } = mount({
      setup () {
        return () => h(BuPanel as any, {
          'heading': 'Repositories',
          tabs,
          'items': repos,
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: string | string[]) => {
            selected.value = value
          },
          'onTab': (value: string) => {
            tabbed.value = value
          },
        }, slots)
      },
    })

    // mandatory 'force' auto-selects the first tab.
    const anchors = [...el.querySelectorAll('.panel-tabs a')]
    expect(anchors[0].classList.contains('is-active')).toBe(true)
    expect(tabbed.value).toBe('All')

    // Selecting a tab moves is-active within the tab scope only.
    ;(anchors[1] as HTMLElement).click()
    await nextTick()
    expect(tabbed.value).toBe('Public')
    expect(anchors[0].classList.contains('is-active')).toBe(false)
    expect(anchors[1].classList.contains('is-active')).toBe(true)
    expect(el.querySelector('a.panel-block.is-active')!.textContent!.trim()).toBe('bulma')

    // Selecting another block moves the single block selection.
    const blocks = [...el.querySelectorAll('a.panel-block')]
    ;(blocks[1] as HTMLElement).click()
    await nextTick()
    expect(selected.value).toBe('marksheet')
    expect(blocks[0].classList.contains('is-active')).toBe(false)
    expect(blocks[1].classList.contains('is-active')).toBe(true)

    unmount()
  })

  it('supports multi-selection of blocks via the multiple prop', async () => {
    const selected = shallowRef<string[]>(['bulma'])
    const { el, unmount } = mount({
      setup () {
        return () => h(BuPanel as any, {
          'items': repos,
          'multiple': true,
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: string | string[]) => {
            selected.value = value as string[]
          },
        })
      },
    })

    const blocks = [...el.querySelectorAll('a.panel-block')]
    ;(blocks[1] as HTMLElement).click()
    await nextTick()
    expect(selected.value).toEqual(['bulma', 'marksheet'])
    expect(blocks[0].classList.contains('is-active')).toBe(true)
    expect(blocks[1].classList.contains('is-active')).toBe(true)

    unmount()
  })
})
