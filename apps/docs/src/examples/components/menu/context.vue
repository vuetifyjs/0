<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
</script>

<template>
  <Menu.Root>
    <Menu.Context class="flex h-32 items-center justify-center rounded-md border border-dashed border-divider text-sm text-on-surface-variant">
      Right-click this area
    </Menu.Context>

    <Menu.Content class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg">
      <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
        Copy
      </Menu.Item>

      <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
        Paste
      </Menu.Item>
    </Menu.Content>
  </Menu.Root>
</template>
