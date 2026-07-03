<script setup lang="ts">
  import { useLocale } from '@vuetify/v0'
  import { toRef } from 'vue'

  const { label, name } = defineProps<{
    label: string
    name: string
  }>()

  const locale = useLocale()

  const current = toRef(() => locale.selectedId.value)
</script>

<template>
  <div class="rounded-lg border border-divider p-4 space-y-3">
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm font-medium text-on-surface">{{ label }}</span>
      <span class="text-xs px-2 py-0.5 rounded-md bg-surface-variant text-on-surface-variant">{{ current }}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="id in locale.keys()"
        :key="id"
        class="px-3 py-1.5 text-sm rounded-lg border transition-all"
        :class="current === id
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="locale.select(id)"
      >
        {{ id }}
      </button>
    </div>

    <div class="space-y-2 border-t border-divider pt-3">
      <p class="text-sm font-medium text-on-surface">
        {{ locale.t('greeting', { name }) }}
      </p>

      <p class="text-sm text-on-surface-variant">
        {{ locale.t('cart', 3) }}
      </p>

      <p class="text-sm text-on-surface-variant">
        {{ locale.t('progress', { count: 7, total: 10 }) }}
      </p>

      <div class="flex gap-2">
        <span
          v-for="key in ['nav.home', 'nav.settings']"
          :key
          class="text-xs px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant"
        >
          {{ locale.t(key) }}
        </span>
      </div>

      <p class="text-xs text-on-surface-variant">
        {{ locale.t('amount', locale.n(1234567.89)) }}
      </p>
    </div>
  </div>
</template>
