<script setup lang="ts">
  // Framework
  import { isNumber } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/storage/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { StorageConfig } from '@/plugins/storage/defaults'

  const ENTRIES = [
    { key: 'theme', value: '"dark"' },
    { key: 'locale', value: '"en"' },
    { key: 'sidebar', value: 'true' },
    { key: 'recent', value: '["acme","globex"]' },
  ]

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useStorage') return store.draft.config as StorageConfig

    return (store.pluginConfig.useStorage as StorageConfig | undefined) ?? defaultConfig
  })

  const rows = toRef(() => ENTRIES.map(entry => ({
    ...entry,
    full: `${config.value.prefix}${entry.key}`,
  })))

  const ttl = toRef(() => isNumber(config.value.ttl) ? config.value.ttl : undefined)

  const expiry = toRef(() => {
    if (!isNumber(ttl.value)) return 'never expires'

    const seconds = Math.round(ttl.value / 1000)

    return seconds >= 60 ? `expires after ${Math.round(seconds / 60)}m` : `expires after ${seconds}s`
  })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">localStorage</span>

      <span class="px-2 py-0.5 rounded-full border border-divider text-on-surface-variant">{{ expiry }}</span>

      <span class="ml-auto font-mono text-on-surface-variant truncate">{{ config.prefix || 'no prefix' }}</span>
    </div>

    <MiniFrame title="storage">
      <div class="rounded-lg border border-divider overflow-hidden">
        <div class="grid grid-cols-[1.4fr_1fr] gap-2 px-3 py-1.5 bg-surface-variant/60 text-[10px] uppercase tracking-wide text-on-surface-variant">
          <span>Key</span>
          <span>Value</span>
        </div>

        <div
          v-for="row in rows"
          :key="row.key"
          class="grid grid-cols-[1.4fr_1fr] gap-2 px-3 py-2 border-t border-divider font-mono text-[11px]"
        >
          <span class="truncate">
            <span class="text-primary">{{ config.prefix }}</span><span class="text-on-surface">{{ row.key }}</span>
          </span>

          <span class="text-on-surface-variant truncate">{{ row.value }}</span>
        </div>
      </div>

      <p class="mt-3 text-[11px] text-on-surface-variant">
        Reads and writes are namespaced; <span class="font-mono text-on-surface">get('theme')</span>
        resolves to <span class="font-mono text-on-surface">{{ rows[0]?.full }}</span>.
      </p>
    </MiniFrame>

    <p v-if="isNumber(ttl)" class="text-xs text-on-surface-variant">
      Entries older than {{ ttl }}ms return their default value instead of the stored one.
    </p>
  </div>
</template>
