<script lang="ts">
  // Context
  import { orphan, useQuCard } from './QuCard.vue'

  export type QuCardActionsAlign = 'start' | 'end'

  export interface QuCardActionsProps {
    /** Where the actions gather in the row. */
    align?: QuCardActionsAlign
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCardActions' })

  defineSlots<{
    /** The supplemental actions: up to two QuButtons and an overflow menu, or an inline UI control. */
    default?: () => any
  }>()

  const { align = 'start' } = defineProps<QuCardActionsProps>()

  orphan('QuCardActions', useQuCard())
</script>

<template>
  <div
    class="quantum-card__actions"
    :data-align="align"
  >
    <slot />
  </div>
</template>
