<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnCardHeader' })
</script>

<template>
  <Atom as="div" class="onyx-card__header">
    <slot />
  </Atom>
</template>
