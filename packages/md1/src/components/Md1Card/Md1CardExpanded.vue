<script lang="ts">
  // Framework
  import { Collapsible, isUndefined, useLogger } from '@vuetify/v0'

  // Context
  import { MD1_CARD_COLLAPSIBLE, useMd1Card } from './Md1Card.vue'

  // Utilities
  import { toRef } from 'vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1CardExpanded' })

  defineSlots<{
    /** The expanded supporting text. */
    default?: () => any
  }>()

  // Collapsible.Content throws outside an Md1Card, as every v0-backed part does;
  // the card context is read for the label and the model check.
  const context = useMd1Card()

  if (__DEV__ && context && isUndefined(context.expanded.value)) {
    useLogger().warn('[Md1CardExpanded] the card has no expansion: bind `v-model:expanded` on <Md1Card> to reveal this region')
  }

  // The region is named by the card's title rather than by v0's activator id,
  // which no element carries here.
  const label = toRef(() => context?.labelId.value)
</script>

<template>
  <Collapsible.Content
    :aria-labelledby="label"
    class="md1-card__expanded"
    :namespace="MD1_CARD_COLLAPSIBLE"
  >
    <slot />
  </Collapsible.Content>
</template>
