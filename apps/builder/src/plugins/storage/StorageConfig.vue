<script setup lang="ts">
  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive, shallowRef } from 'vue'

  // Types
  import type { StorageConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useStorage as StorageConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<StorageConfig>({
    prefix: initial.prefix,
    ttl: initial.ttl,
  })

  const ttlEnabled = shallowRef(typeof initial.ttl === 'number')

  function onTtlToggle (next: boolean) {
    ttlEnabled.value = next
    state.ttl = next ? (state.ttl ?? 60_000) : undefined
  }

  function onSave () {
    const config: StorageConfig = {
      prefix: state.prefix,
      ttl: ttlEnabled.value ? state.ttl : undefined,
    }
    store.savePluginConfig('useStorage', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useStorage" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Persist values across reloads with a uniform key/value API. Backed by
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">window.localStorage</code>
        by default, with optional time-to-live expiry.
      </p>
    </template>

    <div class="space-y-6">
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Key prefix</span>

        <input
          v-model="state.prefix"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          placeholder="v0:"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          Prepended to all keys in storage.
        </span>
      </label>

      <div>
        <label class="flex items-center gap-2 mb-2">
          <input
            :checked="ttlEnabled"
            class="w-4 h-4"
            type="checkbox"
            @change="onTtlToggle(($event.target as HTMLInputElement).checked)"
          >

          <span class="text-sm text-on-surface">Enable TTL (auto-expire)</span>
        </label>

        <input
          v-model.number="state.ttl"
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono disabled:opacity-50"
          :disabled="!ttlEnabled"
          min="0"
          placeholder="60000"
          type="number"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          Auto-expire stored values after N milliseconds.
        </span>
      </div>

      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          Adapter and serializer are advanced — customize in code by passing a custom
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">Storage</code> instance or
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">{ read, write }</code> pair to
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">createStoragePlugin()</code>.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
