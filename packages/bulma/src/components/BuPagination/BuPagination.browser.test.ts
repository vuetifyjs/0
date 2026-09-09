import { describe, it } from 'vitest'

import { BuPagination } from './index'

// Utilities
import { createApp, h } from 'vue'

import { conform } from '../../../harness/conform'
import { BuPaginationEllipsis } from '../BuPaginationEllipsis'
import { BuPaginationItem } from '../BuPaginationItem'
import { BuPaginationList } from '../BuPaginationList'
import { BuPaginationNext } from '../BuPaginationNext'
import { BuPaginationPrev } from '../BuPaginationPrev'

// aria-label: v0 localizes ('Go to page 1' vs the fixture's 'Goto page 1') — tolerated per canon.
// href: JS-driven pagination emits v-model page changes instead of navigating; fixture hrefs are docs placeholders.
// title: the disabled fixture's title is authored content, not component-owned markup.
const IGNORE = { ignoreAttrs: ['aria-label', 'href', 'title'] }

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

function pager (props: { pages: number, modelValue: number, visible?: number }, prevExtra: Record<string, unknown> = {}) {
  return h(BuPagination, props, {
    default: ({ items }: { items: { type: string, value: number }[] }) => [
      h(BuPaginationPrev, prevExtra, () => 'Previous'),
      h(BuPaginationNext, null, () => 'Next page'),
      h(BuPaginationList, null, () => items.map((item, index) =>
        item.type === 'page'
          ? h(BuPaginationItem, { key: index, value: item.value })
          : h(BuPaginationEllipsis, { key: index }),
      )),
    ],
  })
}

describe('buPagination', () => {
  it('conforms to the full pagination fixture with ellipses and current page', () => {
    const { el, destroy } = mount(pager({ pages: 86, modelValue: 46, visible: 7 }))
    try {
      conform(el, 'pagination', IGNORE)
    } finally {
      destroy()
    }
  })

  it('conforms to the disabled-previous fixture on the first page', () => {
    const { el, destroy } = mount(pager(
      { pages: 3, modelValue: 1, visible: 7 },
      { title: 'This is the first page' },
    ))
    try {
      conform(el, 'pagination:disabled', IGNORE)
    } finally {
      destroy()
    }
  })
})
