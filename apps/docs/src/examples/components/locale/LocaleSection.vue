<script setup lang="ts">
  import { Locale } from '@vuetify/v0'

  const {
    locale,
    label = '',
  } = defineProps<{
    locale: string
    label?: string
  }>()
</script>

<template>
  <Locale :locale>
    <div class="rounded-lg border border-divider overflow-hidden">
      <div class="px-4 py-2 bg-surface-variant/30">
        <span class="text-xs font-medium text-on-surface-variant/50 uppercase tracking-wider">
          {{ label || locale }}
        </span>
      </div>

      <div class="p-4 space-y-3">
        <slot />
      </div>
    </div>
  </Locale>
</template>
