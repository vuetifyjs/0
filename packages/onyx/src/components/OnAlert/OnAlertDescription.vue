<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnAlertDescription' })
</script>

<template>
  <Atom as="div" class="onyx-alert__description">
    <slot />
  </Atom>
</template>
