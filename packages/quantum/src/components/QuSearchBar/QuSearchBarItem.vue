<script lang="ts">
  // Framework
  import { Combobox, isNull } from '@vuetify/v0'

  // Context
  import { orphan, useQuSearchBar } from './QuSearchBar.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuSearchBarItemProps {
    /** The query this suggestion submits; also its text unless the slot replaces it. */
    value: string
    /**
     * A recent query (search page, "historical search suggestions"): offered
     * from focus, before anything is typed, with the history glyph. Without it
     * the row is an auto-completion, shown only once something is typed.
     */
    history?: boolean
    /** The leading glyph. Defaults to `history` for recent queries and `search` for completions. */
    icon?: QuIconName
    /** Kept in the list at the disabled ink and skipped by the keyboard. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSearchBarItem' })

  defineSlots<{
    /** The suggestion text. Defaults to `value`. */
    default?: () => any
  }>()

  const { value, history = false, icon, disabled = false } = defineProps<QuSearchBarItemProps>()

  const context = useQuSearchBar()

  orphan('QuSearchBarItem', context)

  // Recent queries lead; completions replace the prompt once the user types (search page).
  const shown = toRef(() => !isNull(context) && (history || context.typing.value))
  const glyph = toRef(() => icon ?? (history ? 'history' : 'search'))

  // Runs after Combobox.Item's own click, which has already selected the row.
  function onClick () {
    if (!disabled) context?.submit()
  }
</script>

<template>
  <Combobox.Item
    v-if="shown"
    class="quantum-search-bar__item"
    :data-history="history || undefined"
    :disabled
    :namespace="context?.namespace.value"
    :value
    @click="onClick"
  >
    <QuRipple />

    <span aria-hidden="true" class="quantum-search-bar__icon">
      <QuIcon :name="glyph" />
    </span>

    <span class="quantum-search-bar__text">
      <slot>{{ value }}</slot>
    </span>
  </Combobox.Item>
</template>
