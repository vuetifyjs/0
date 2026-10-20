<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Menu } from '../Menu/index'

  const open = shallowRef<string | null>('actions')
</script>

<template>
  <Menu.Root v-model="open" value="actions">
    <Menu.Activator>Actions</Menu.Activator>

    <Menu.Content>
      <Menu.Item>Copy</Menu.Item>
      <Menu.Item>Paste</Menu.Item>
    </Menu.Content>
  </Menu.Root>
</template>
