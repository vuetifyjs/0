<script setup lang="ts">
  import MenuButton from './MenuButton.vue'
  import { useMenu } from './useMenu'

  const menu = useMenu()
</script>

<template>
  <div class="flex flex-col items-center gap-6 py-8">
    <MenuButton :menu />

    <p class="text-xs text-on-surface-variant">
      <template v-if="menu.selected.value">
        Last action: <span class="font-medium text-primary">{{ menu.selected.value.label }}</span>
      </template>

      <template v-else>
        Open the menu and choose an action. Click outside or press Escape to dismiss.
      </template>
    </p>
  </div>
</template>
