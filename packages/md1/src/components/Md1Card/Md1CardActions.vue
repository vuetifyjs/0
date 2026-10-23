<script lang="ts">
  // Context
  import { orphan, useMd1Card } from './Md1Card.vue'

  export type Md1CardActionsAlign = 'start' | 'end'

  export interface Md1CardActionsProps {
    /** Where the actions gather in the row. */
    align?: Md1CardActionsAlign
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1CardActions' })

  defineSlots<{
    /** The supplemental actions: up to two Md1Buttons and an overflow menu, or an inline UI control. */
    default?: () => any
  }>()

  const { align = 'start' } = defineProps<Md1CardActionsProps>()

  orphan('Md1CardActions', useMd1Card())
</script>

<template>
  <div
    class="md1-card__actions"
    :data-align="align"
  >
    <slot />
  </div>
</template>
