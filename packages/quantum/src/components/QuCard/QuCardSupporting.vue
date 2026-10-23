<script lang="ts">
  // Context
  import { orphan, useQuCard } from './QuCard.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCardSupporting' })

  defineSlots<{
    /** The supporting text. */
    default?: () => any
  }>()

  orphan('QuCardSupporting', useQuCard())
</script>

<template>
  <div class="quantum-card__supporting">
    <slot />
  </div>
</template>
