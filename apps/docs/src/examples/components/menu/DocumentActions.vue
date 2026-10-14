<script setup lang="ts">
  import { Menu } from '@vuetify/v0'

  const emit = defineEmits<{
    action: [name: string]
  }>()

  const item = 'rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant'

  function onAction (name: string) {
    emit('action', name)
  }
</script>

<template>
  <Menu.Item :class="item" @click="onAction('Copy')">
    Copy
  </Menu.Item>

  <Menu.Item :class="item" @click="onAction('Paste')">
    Paste
  </Menu.Item>
</template>
