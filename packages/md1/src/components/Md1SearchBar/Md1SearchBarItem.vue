<script lang="ts">
  // Framework
  import { Combobox, isNull } from '@vuetify/v0'

  // Context
  import { orphan, useMd1SearchBar } from './Md1SearchBar.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1SearchBarItemProps {
    /** The query this suggestion submits; also its text unless the slot replaces it. */
    value: string
    /**
     * A recent query (search page, "historical search suggestions"): offered
     * from focus, before anything is typed, with the history glyph. Without it
     * the row is an auto-completion, shown only once something is typed.
     */
    history?: boolean
    /** The leading glyph. Defaults to `history` for recent queries and `search` for completions. */
    icon?: Md1IconName
    /** Kept in the list at the disabled ink and skipped by the keyboard. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1SearchBarItem' })

  defineSlots<{
    /** The suggestion text. Defaults to `value`. */
    default?: () => any
  }>()

  const { value, history = false, icon, disabled = false } = defineProps<Md1SearchBarItemProps>()

  const context = useMd1SearchBar()

  orphan('Md1SearchBarItem', context)

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
    class="md1-search-bar__item"
    :data-history="history || undefined"
    :disabled
    :namespace="context?.namespace.value"
    :value
    @click="onClick"
  >
    <Md1Ripple />

    <span aria-hidden="true" class="md1-search-bar__icon">
      <Md1Icon :name="glyph" />
    </span>

    <span class="md1-search-bar__text">
      <slot>{{ value }}</slot>
    </span>
  </Combobox.Item>
</template>
