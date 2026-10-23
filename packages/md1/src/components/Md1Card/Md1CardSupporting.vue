<script lang="ts">
  // Context
  import { orphan, useMd1Card } from './Md1Card.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1CardSupporting' })

  defineSlots<{
    /** The supporting text. */
    default?: () => any
  }>()

  orphan('Md1CardSupporting', useMd1Card())
</script>

<template>
  <div class="md1-card__supporting">
    <slot />
  </div>
</template>
