<script lang="ts">
  // Context
  import { orphan, useQuCard } from './QuCard.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCardSubtitle' })

  defineSlots<{
    /** The subtitle text. */
    default?: () => any
  }>()

  orphan('QuCardSubtitle', useQuCard())
</script>

<template>
  <div class="quantum-card__subtitle">
    <slot />
  </div>
</template>
