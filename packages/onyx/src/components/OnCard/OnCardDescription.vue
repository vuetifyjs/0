<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnCardDescription' })
</script>

<template>
  <Atom as="div" class="onyx-card__description">
    <slot />
  </Atom>
</template>
