<script lang="ts">
  // Context
  import { orphan, useMd1Card } from './Md1Card.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1CardSubtitle' })

  defineSlots<{
    /** The subtitle text. */
    default?: () => any
  }>()

  orphan('Md1CardSubtitle', useMd1Card())
</script>

<template>
  <div class="md1-card__subtitle">
    <slot />
  </div>
</template>
