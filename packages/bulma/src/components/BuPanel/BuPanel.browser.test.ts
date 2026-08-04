import { describe, expect, it } from 'vitest'

import { BuPanel } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BuPanelBlock } from '../BuPanelBlock'
import { BuPanelHeading } from '../BuPanelHeading'
import { BuPanelIcon } from '../BuPanelIcon'
import { BuPanelTab } from '../BuPanelTab'
import { BuPanelTabs } from '../BuPanelTabs'

const labels = ['All', 'Public', 'Private', 'Sources', 'Forks']

const repos = [
  { label: 'bulma', icon: 'fas fa-book' },
  { label: 'marksheet', icon: 'fas fa-book' },
  { label: 'minireset.css', icon: 'fas fa-book' },
  { label: 'jgthms.github.io', icon: 'fas fa-book' },
  { label: 'daniellowtw/infboard', icon: 'fas fa-code-branch' },
  { label: 'mojs', icon: 'fas fa-code-branch' },
]

function search () {
  return h('div', { class: 'panel-block' }, [
    h('p', { class: 'control has-icons-left' }, [
      h('input', { class: 'input', type: 'text', placeholder: 'Search' }),
      h('span', { class: 'icon is-left' }, [
        h('i', { 'class': 'fas fa-search', 'aria-hidden': 'true' }),
      ]),
    ]),
  ])
}

function tabs (props: Record<string, unknown> = {}) {
  return h(BuPanelTabs as any, props, () => labels.map(label =>
    h(BuPanelTab as any, { key: label, value: label }, () => label),
  ))
}

function blocks () {
  return repos.map(repo => h(BuPanelBlock as any, { key: repo.label, value: repo.label }, () => [
    h(BuPanelIcon, { icon: repo.icon }),
    repo.label,
  ]))
}

function footer () {
  return [
    h('label', { class: 'panel-block' }, [
      h('input', { type: 'checkbox' }),
      ' remember me ',
    ]),
    h('div', { class: 'panel-block' }, [
      h('button', { class: 'button is-link is-outlined is-fullwidth' }, ' Reset all filters '),
    ]),
  ]
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
      render: () => h(BuPanel as any, { modelValue: 'bulma' }, () => [
        h(BuPanelHeading, null, () => 'Repositories'),
        search(),
        tabs(),
        blocks(),
        footer(),
      ]),
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
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: string | string[]) => {
            selected.value = value
          },
        }, () => [
          h(BuPanelHeading, null, () => 'Repositories'),
          search(),
          tabs({
            'modelValue': tabbed.value,
            'onUpdate:modelValue': (value: string) => {
              tabbed.value = value
            },
          }),
          blocks(),
          footer(),
        ])
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
    const rows = [...el.querySelectorAll('a.panel-block')]
    ;(rows[1] as HTMLElement).click()
    await nextTick()
    expect(selected.value).toBe('marksheet')
    expect(rows[0].classList.contains('is-active')).toBe(false)
    expect(rows[1].classList.contains('is-active')).toBe(true)

    unmount()
  })

  it('supports multi-selection of blocks via the multiple prop', async () => {
    const selected = shallowRef<string[]>(['bulma'])
    const { el, unmount } = mount({
      setup () {
        return () => h(BuPanel as any, {
          'multiple': true,
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: string | string[]) => {
            selected.value = value as string[]
          },
        }, blocks)
      },
    })

    const rows = [...el.querySelectorAll('a.panel-block')]
    ;(rows[1] as HTMLElement).click()
    await nextTick()
    expect(selected.value).toEqual(['bulma', 'marksheet'])
    expect(rows[0].classList.contains('is-active')).toBe(true)
    expect(rows[1].classList.contains('is-active')).toBe(true)

    unmount()
  })
})
