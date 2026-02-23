<script setup lang="ts">
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  const playground = usePlayground()

  function onClickClose () {
    playground.unselect('playground-left')
  }
</script>

<template>
  <div class="flex items-center justify-between pl-4 pr-2 py-2.5 border-b border-divider bg-surface">
    <slot />

    <AppCloseButton @click="onClickClose" />
  </div>
</template>
