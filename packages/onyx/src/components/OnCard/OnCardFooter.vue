<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnCardFooter' })
</script>

<template>
  <Atom as="div" class="onyx-card__footer">
    <slot />
  </Atom>
</template>
