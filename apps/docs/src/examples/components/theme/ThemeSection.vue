<script setup lang="ts">
  import { Theme } from '@vuetify/v0'

  const {
    theme,
    label = '',
  } = defineProps<{
    theme: string
    label?: string
  }>()
</script>

<template>
  <Theme :theme>
    <div class="rounded-lg border border-divider overflow-hidden">
      <div class="px-4 py-2 bg-surface-variant/30">
        <span class="text-xs font-medium text-on-surface-variant/50 uppercase tracking-wider">
          {{ label || theme }}
        </span>
      </div>

      <div class="p-4 space-y-3">
        <slot />
      </div>
    </div>
  </Theme>
</template>
