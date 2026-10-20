<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
  import ShareMenu from './ShareMenu.vue'

  const item = 'rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant'
</script>

<template>
  <div class="flex justify-center">
    <Menu.Root>
      <Menu.Activator class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary">
        File
      </Menu.Activator>

      <Menu.Content class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg">
        <Menu.Item :class="item">
          New file
        </Menu.Item>

        <ShareMenu />
      </Menu.Content>
    </Menu.Root>
  </div>
</template>
