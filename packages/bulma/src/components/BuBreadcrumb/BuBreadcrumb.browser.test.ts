import { describe, it } from 'vitest'

import { BuBreadcrumb } from './index'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'
import { BuBreadcrumbItem } from '../BuBreadcrumbItem'

function mount (vnode: ReturnType<typeof h>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: () => vnode })
  app.mount(host)
  return {
    el: host.firstElementChild!,
    destroy () {
      app.unmount()
      host.remove()
    },
  }
}

function trail () {
  return [
    h(BuBreadcrumbItem, { href: '#' }, () => 'Bulma'),
    h(BuBreadcrumbItem, { href: '#' }, () => 'Documentation'),
    h(BuBreadcrumbItem, { href: '#' }, () => 'Components'),
    h(BuBreadcrumbItem, { href: '#', current: true }, () => 'Breadcrumb'),
  ]
}

describe('buBreadcrumb', () => {
  it('conforms to the basic breadcrumb fixture with active last item', () => {
    const { el, destroy } = mount(h(BuBreadcrumb, null, () => trail()))
    try {
      conform(el, 'breadcrumb')
    } finally {
      destroy()
    }
  })

  it('conforms to the alternative separator fixture', () => {
    const { el, destroy } = mount(h(BuBreadcrumb, { separator: 'arrow' }, () => trail()))
    try {
      conform(el, 'breadcrumb:separator')
    } finally {
      destroy()
    }
  })

  it('conforms to the icons fixture', () => {
    function crumb (href: string, icon: string, text: string, current = false) {
      return h(BuBreadcrumbItem, { href, current }, () => [
        h('span', { class: 'icon is-small' }, h('i', { 'class': icon, 'aria-hidden': 'true' })),
        h('span', null, text),
      ])
    }
    const { el, destroy } = mount(h(BuBreadcrumb, null, () => [
      crumb('#', 'fas fa-home', 'Bulma'),
      crumb('#', 'fas fa-book', 'Documentation'),
      crumb('#', 'fas fa-thumbs-up', 'Breadcrumb', true),
    ]))
    try {
      conform(el, 'breadcrumb:icons')
    } finally {
      destroy()
    }
  })
})
