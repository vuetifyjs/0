<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnCardTitle' })
</script>

<template>
  <Atom as="div" class="onyx-card__title">
    <slot />
  </Atom>
</template>
