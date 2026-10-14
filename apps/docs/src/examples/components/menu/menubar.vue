<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
</script>

<template>
  <Menu.Root>
    <Menu.Bar class="flex w-fit gap-1 rounded-md border border-divider bg-surface p-1">
      <Menu.Activator
        class="rounded px-3 py-1.5 text-sm text-on-surface data-[highlighted]:bg-surface-variant data-[state=open]:bg-surface-variant"
        value="file"
      >
        File
      </Menu.Activator>

      <Menu.Activator
        class="rounded px-3 py-1.5 text-sm text-on-surface data-[highlighted]:bg-surface-variant data-[state=open]:bg-surface-variant"
        value="edit"
      >
        Edit
      </Menu.Activator>
    </Menu.Bar>

    <Menu.Content
      class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg"
      value="file"
    >
      <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
        New file
      </Menu.Item>

      <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
        Open
      </Menu.Item>
    </Menu.Content>

    <Menu.Content
      class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg"
      value="edit"
    >
      <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
        Undo
      </Menu.Item>

      <Menu.Item class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant">
        Redo
      </Menu.Item>
    </Menu.Content>
  </Menu.Root>
</template>
