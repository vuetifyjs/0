/**
 * @module PaginationStatus
 *
 * @remarks
 * Visually-hidden live region that announces page changes to screen readers.
 * Uses aria-live="polite" to announce without interrupting the user.
 *
 * The live region must exist in the DOM before content changes for screen readers
 * to detect updates. A small delay (100ms) is used after page changes to ensure
 * reliable announcement across different assistive technologies.
 *
 * This component should be visually hidden but remain in the DOM. Apply
 * visually-hidden CSS (sr-only) to hide it from sighted users while keeping
 * it accessible to screen readers.
 *
 * @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { usePaginationRoot } from './PaginationRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationStatusProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface PaginationStatusSlotProps {
    /** Current page (1-indexed) */
    page: number
    /** Total number of pages */
    pages: number
    /** Announcement text */
    text: string
    /** Attributes to bind to the status element */
    attrs: {
      'aria-atomic': true
      'aria-live': 'polite'
      'role': 'status'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationStatus' })

  defineSlots<{
    default: (props: PaginationStatusSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:pagination',
  } = defineProps<PaginationStatusProps>()

  const locale = useLocale()
  const pagination = usePaginationRoot(namespace)

  // Text starts empty - live regions must be empty initially for announcements to work
  const text = shallowRef('')

  // Watch for page changes and update text after a small delay
  // This ensures screen readers detect the content change
  // @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
  /* v8 ignore start -- watch fires after mount, setTimeout callback requires timer */
  watch(() => pagination.page.value, (page, prevPage) => {
    // Skip initial render (no previous value means first mount)
    if (prevPage === undefined) return

    setTimeout(() => {
      text.value = locale.t(
        'Pagination.status',
        { page, pages: pagination.pages },
        `Page ${page} of ${pagination.pages}`,
      )
    }, 100)
  })
  /* v8 ignore stop */

  const slotProps = toRef((): PaginationStatusSlotProps => ({
    page: pagination.page.value,
    pages: pagination.pages,
    text: text.value,
    attrs: {
      'aria-atomic': true,
      'aria-live': 'polite',
      'role': 'status',
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ text }}
    </slot>
  </Atom>
</template>
