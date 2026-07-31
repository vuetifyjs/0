<script setup lang="ts">
  import { Tooltip } from '@vuetify/v0'

  const { label } = defineProps<{ label: string }>()
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Activator
      class="h-8 w-8 inline-flex items-center justify-center rounded-md border border-divider bg-surface text-on-surface text-sm hover:bg-surface-tint"
    >
      <slot />
    </Tooltip.Activator>

    <Tooltip.Content
      class="px-2 py-1 rounded text-xs bg-on-surface text-surface shadow-md"
      :style="{ margin: '6px 0' }"
    >
      {{ label }}
    </Tooltip.Content>
  </Tooltip.Root>
</template>
