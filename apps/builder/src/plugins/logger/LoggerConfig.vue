<script setup lang="ts">
  import { defaultConfig, LOG_LEVELS, LOGGER_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { LoggerConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useLogger as LoggerConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<LoggerConfig>({
    level: initial.level,
    adapter: initial.adapter,
    prefix: initial.prefix,
    enabled: initial.enabled,
  })

  function onSave () {
    const config: LoggerConfig = {
      level: state.level,
      adapter: state.adapter,
      prefix: state.prefix,
      enabled: state.enabled,
    }
    store.savePluginConfig('useLogger', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useLogger" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Structured logging with a single global level and a pluggable adapter.
        Pick from the bundled adapters or plug in your own.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Level</span>

          <select
            v-model="state.level"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
          >
            <option v-for="level in LOG_LEVELS" :key="level" :value="level">{{ level }}</option>
          </select>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Minimum severity to emit. Applies globally to all namespaces.
          </span>
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

          <select
            v-model="state.adapter"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
          >
            <option v-for="adapter in LOGGER_ADAPTERS" :key="adapter" :value="adapter">{{ adapter }}</option>
          </select>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Bundled adapter to instantiate.
          </span>
        </label>
      </div>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Prefix</span>

        <input
          v-model="state.prefix"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          placeholder="v0"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          Prepended to every log message.
        </span>
      </label>

      <label class="flex items-center gap-2">
        <input v-model="state.enabled" class="w-4 h-4" type="checkbox">
        <span class="text-sm text-on-surface">Enabled</span>
      </label>

      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          Adapter-specific configuration (e.g.,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">Pino</code> options,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">Consola</code> reporter)
          is passed to the adapter's constructor in code, not from the builder.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
