import { describe, it } from 'vitest'

// Context
import BuBreadcrumb from './BuBreadcrumb.vue'

// Utilities
import { createApp } from 'vue'

import { conform } from '../../../harness/conform'

const items = [
  { text: 'Bulma', href: '#' },
  { text: 'Documentation', href: '#' },
  { text: 'Components', href: '#' },
  { text: 'Breadcrumb', href: '#' },
]

function mount (props: Record<string, unknown>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(BuBreadcrumb, props)
  app.mount(host)
  return {
    el: host.firstElementChild!,
    destroy () {
      app.unmount()
      host.remove()
    },
  }
}

describe('buBreadcrumb', () => {
  it('conforms to the basic breadcrumb fixture with active last item', () => {
    const { el, destroy } = mount({ items })

    try {
      conform(el, 'breadcrumb')
    } finally {
      destroy()
    }
  })

  it('conforms to the alternative separator fixture', () => {
    const { el, destroy } = mount({ items, separator: 'arrow' })

    try {
      conform(el, 'breadcrumb:separator')
    } finally {
      destroy()
    }
  })
})
