<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
  import ShareMenu from './ShareMenu.vue'

  const open = defineModel<string | null>('open', { default: null })

  const {
    area,
    fallback,
    subArea,
    hover,
    openDelay,
    closeDelay,
    disabled,
  } = defineProps<{
    area: string
    fallback: string
    subArea: string
    hover: boolean
    openDelay: number
    closeDelay: number
    disabled: boolean
  }>()

  const item = 'rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant'
</script>

<template>
  <Menu.Root
    v-model="open"
    :close-delay
    :disabled
    :open-delay
    :open-on-hover="hover"
    value="actions"
  >
    <div class="flex min-h-72 items-center justify-center">
      <Menu.Activator
        class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary disabled:opacity-40 data-[disabled]:opacity-40"
      >
        Open
      </Menu.Activator>
    </div>

    <Menu.Content
      class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg"
      :position-area="area"
      :position-try="fallback"
    >
      <Menu.Item :class="item">
        New
      </Menu.Item>

      <ShareMenu :position-area="subArea" />

      <Menu.Item :class="item">
        Rename
      </Menu.Item>
    </Menu.Content>
  </Menu.Root>
</template>
