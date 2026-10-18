<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center">
    <Menu.Root>
      <Menu.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Actions
      </Menu.Activator>

      <Menu.Content class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg">
        <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
          Copy
        </Menu.Item>

        <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
          Paste
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  </div>
</template>
