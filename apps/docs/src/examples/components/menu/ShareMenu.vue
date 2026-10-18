<script setup lang="ts">
  import { Menu } from '@vuetify/v0'

  const { positionArea = 'inline-end span-block-start' } = defineProps<{
    /** CSS position-area for the submenu. Defaults to the inline-end side of the item. */
    positionArea?: string
  }>()

  const item = 'rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant'
</script>

<template>
  <Menu.Sub>
    <Menu.SubActivator :class="[item, 'flex items-center justify-between gap-6 data-[state=open]:bg-surface-variant']">
      Share
      <span aria-hidden="true" class="i-lucide-chevron-right size-4 shrink-0 text-on-surface-variant rtl:-scale-x-100" />
    </Menu.SubActivator>

    <Menu.SubContent
      class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg"
      :position-area
    >
      <Menu.Item :class="item">
        Email
      </Menu.Item>

      <Menu.Item :class="item">
        Copy link
      </Menu.Item>
    </Menu.SubContent>
  </Menu.Sub>
</template>
