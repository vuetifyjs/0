<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnCardContent' })
</script>

<template>
  <Atom as="div" class="onyx-card__content">
    <slot />
  </Atom>
</template>
