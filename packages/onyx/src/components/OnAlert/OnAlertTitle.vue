<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  defineOptions({ name: 'OnAlertTitle' })
</script>

<template>
  <Atom as="div" class="onyx-alert__title">
    <slot />
  </Atom>
</template>
