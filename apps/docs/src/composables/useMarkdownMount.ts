/**
 * @module useMarkdownMount
 *
 * Imperatively mounts DocsCallout and DocsMarkup Vue components into the
 * placeholder elements emitted by useMarkdown's renderer:
 *   - [data-alert]  → DocsCallout
 *   - [data-markup] → DocsMarkup (syntax-highlighted code block)
 *
 * Used by any panel that renders useMarkdown's HTML output via v-html and
 * needs the interactive Vue components to appear in place of the stubs.
 */

// Components
import DocsCallout from '@/components/docs/DocsCallout.vue'
import DocsMarkup from '@/components/docs/DocsMarkup.vue'

// Utilities
import { decodeBase64 } from '@/utilities/decodeBase64'
import { getCurrentInstance, h, nextTick, onBeforeUnmount, render, watch } from 'vue'

// Types
import type { Ref, ShallowRef } from 'vue'

export function useMarkdownMount (
  contentRef: Readonly<ShallowRef<HTMLElement | null>>,
  html: Readonly<Ref<string> | ShallowRef<string>>,
) {
  const appContext = getCurrentInstance()?.appContext
  const mountedWrappers = new Set<HTMLElement>()

  function mountMarkupComponents () {
    if (!contentRef.value) return

    for (const el of contentRef.value.querySelectorAll<HTMLElement>('[data-markup]')) {
      const code = el.dataset.code
      const language = el.dataset.language
      if (!code) continue

      const highlighted = el.innerHTML
      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)

      const vnode = h(DocsMarkup, { code, language }, {
        default: () => h('div', { innerHTML: highlighted }),
      })
      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }

  function mountAlertComponents () {
    if (!contentRef.value) return

    for (const el of contentRef.value.querySelectorAll<HTMLElement>('[data-alert]')) {
      const type = el.dataset.type as 'tip' | 'info' | 'warning' | 'error' | 'try' | 'tour'
      if (!type) continue

      const wrapper = document.createElement('div')
      el.replaceWith(wrapper)
      mountedWrappers.add(wrapper)

      let vnode
      if (type === 'tour') {
        const tourId = el.dataset.tourId
        vnode = h(DocsCallout, { type, tourId })
      } else {
        const encodedContent = el.dataset.content
        if (!encodedContent) continue
        const content = decodeBase64(encodedContent)
        vnode = h(DocsCallout, { type }, {
          default: () => h('div', { innerHTML: content }),
        })
      }

      vnode.appContext = appContext ?? null
      render(vnode, wrapper)
    }
  }

  watch(html, async () => {
    await nextTick()
    mountMarkupComponents()
    mountAlertComponents()
  })

  onBeforeUnmount(() => {
    for (const wrapper of mountedWrappers) {
      render(null, wrapper)
    }
    mountedWrappers.clear()
  })
}
