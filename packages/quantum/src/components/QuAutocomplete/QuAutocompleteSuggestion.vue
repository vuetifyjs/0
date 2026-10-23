<script lang="ts">
  // Framework
  import { useComboboxRoot, useEventListener } from '@vuetify/v0'

  // Context
  import { useQuAutocomplete } from './context'

  // Utilities
  import { shallowRef, toRef, toValue, watch } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface QuAutocompleteSuggestionProps {
    /** The v0 Combobox namespace of the field this completion belongs to. */
    namespace: string
  }

  interface Completion {
    id: ID
    rest: string
  }

  /** Arrow keys walk a list; in-line completion has none to walk. */
  const ARROWS = new Set(['ArrowDown', 'ArrowUp'])
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuAutocompleteSuggestion' })

  const { namespace } = defineProps<QuAutocompleteSuggestionProps>()

  const root = useComboboxRoot(namespace)
  const context = useQuAutocomplete()

  /**
   * The first enabled suggestion, in list order, whose text starts with what
   * was typed: "suggest input as it's typed (refreshing suggestions with each
   * keystroke)" (text-fields page). A multiple field skips the ones it holds.
   */
  const completion = toRef((): Completion | undefined => {
    const typed = root.query.value

    if (root.pristine.value || typed === '') return undefined

    const lower = typed.toLocaleLowerCase()

    for (const id of root.filtered.value) {
      const ticket = root.selection.get(id)

      if (!ticket || toValue(ticket.disabled)) continue
      if (toValue(root.multiple) && root.selection.selected(id)) continue

      const label = context ? context.display(ticket.value) : String(ticket.value)

      if (label.toLocaleLowerCase().startsWith(lower)) return { id, rest: label.slice(typed.length) }
    }

    return undefined
  })

  /**
   * "Pressing the return button accepts the current autocomplete suggestion."
   * Capture phase on the input, so v0's own Enter (which would commit the
   * typed fragment as free text) never runs when there is a suggestion.
   */
  function onKeydown (event: KeyboardEvent) {
    if (event.isComposing) return

    if (ARROWS.has(event.key)) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }

    const match = completion.value

    if (event.key !== 'Enter' || !match) return

    event.preventDefault()
    event.stopImmediatePropagation()
    root.select(match.id)
  }

  useEventListener(() => root.inputEl.value, 'keydown', onKeydown, { capture: true })

  /**
   * Once the typed text overflows, the input scrolls it left; the completion
   * scrolls with it so it stays to the right of the cursor instead of over
   * the typed run.
   */
  const offset = shallowRef(0)

  function onScroll () {
    offset.value = root.inputEl.value?.scrollLeft ?? 0
  }

  useEventListener(() => root.inputEl.value, 'scroll', onScroll)
  watch(() => root.query.value, onScroll, { flush: 'post' })
</script>

<template>
  <span
    v-if="completion"
    aria-hidden="true"
    class="quantum-autocomplete__suggestion"
    :style="offset ? { textIndent: `${-offset}px` } : undefined"
  ><span class="quantum-autocomplete__typed">{{ root.query.value }}</span>{{ completion.rest }}</span>
</template>
