import { describe, it } from 'vitest'

// Context
import BuPagination from './BuPagination.vue'

// Utilities
import { createApp } from 'vue'

import { conform } from '../../../harness/conform'

// aria-label: v0 localizes ('Go to page 1' vs the fixture's 'Goto page 1') — tolerated per canon.
// href: JS-driven pagination emits v-model page changes instead of navigating; fixture hrefs are docs placeholders.
// title: the disabled fixture's title is authored content, not component-owned markup.
const IGNORE = { ignoreAttrs: ['aria-label', 'href', 'title'] }

function mount (props: Record<string, unknown>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(BuPagination, props)
  app.mount(host)
  return {
    el: host.firstElementChild!,
    destroy () {
      app.unmount()
      host.remove()
    },
  }
}

describe('buPagination', () => {
  it('conforms to the full pagination fixture with ellipses and current page', () => {
    const { el, destroy } = mount({ pages: 86, modelValue: 46, visible: 7 })

    try {
      conform(el, 'pagination', IGNORE)
    } finally {
      destroy()
    }
  })

  it('conforms to the disabled-previous fixture on the first page', () => {
    const { el, destroy } = mount({ pages: 3, modelValue: 1, visible: 7 })

    try {
      conform(el, 'pagination:disabled', IGNORE)
    } finally {
      destroy()
    }
  })
})
