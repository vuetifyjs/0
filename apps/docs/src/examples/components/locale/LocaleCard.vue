<script setup lang="ts">
  import { useLocale } from '@vuetify/v0'

  const { selectedId, t } = useLocale()
</script>

<template>
  <div class="rounded-lg border border-divider p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span class="font-medium text-on-surface">{{ t('language') }}</span>

      <span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
        {{ selectedId.value }}
      </span>
    </div>

    <div class="space-y-1 text-sm text-on-surface-variant">
      <p>{{ t('greeting') }} &mdash; {{ t('welcome') }}</p>
      <p class="font-mono text-xs">{{ t('items', 3) }}</p>
      <p class="font-mono text-xs">{{ t('goodbye', { name: 'World' }) }}</p>
    </div>
  </div>
</template>
