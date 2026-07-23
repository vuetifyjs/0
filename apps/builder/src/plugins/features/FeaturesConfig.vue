<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  import { defaultConfig, FEATURES_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { FeaturesAdapter, FeaturesConfig } from './defaults'

  interface FlagRow {
    key: string
    default: boolean
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.useFeatures as FeaturesConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive({
    adapter: initial.adapter as FeaturesAdapter,
    flags: Object.entries(initial.features).map<FlagRow>(([key, value]) => ({
      key,
      default: !!value,
    })),
  })

  function addFlag () {
    state.flags.push({ key: '', default: false })
  }

  function removeFlag (index: number) {
    state.flags.splice(index, 1)
  }

  function onSave () {
    const features: Record<string, boolean> = {}
    for (const row of state.flags) {
      if (row.key) features[row.key] = row.default
    }

    const config: FeaturesConfig = {
      features,
      adapter: state.adapter,
    }

    store.savePluginConfig('useFeatures', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useFeatures" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Toggle features on or off at runtime. Use static defaults alone, or pair with
        a third-party adapter for remote-controlled flags.
      </p>
    </template>

    <div class="space-y-6">
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

        <select
          v-model="state.adapter"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
        >
          <option v-for="adapter in FEATURES_ADAPTERS" :key="adapter" :value="adapter">
            {{ adapter === 'none' ? 'None (static flags only)' : adapter }}
          </option>
        </select>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Features work statically without an adapter. Pick one to source flags remotely.
        </span>
      </label>

      <div v-if="state.adapter !== 'none'" class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Adapter configuration</div>

        <p class="text-sm text-on-surface-variant">
          API keys, environments, and other provider-specific options are passed to the
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">{{ state.adapter }}</code>
          constructor in code, not from this form.
        </p>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Static flags</div>

        <div class="space-y-2">
          <div
            v-for="(flag, index) in state.flags"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="flag.key"
              class="flex-1 px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="my-feature"
            >

            <label class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-divider bg-surface">
              <input v-model="flag.default" class="w-4 h-4" type="checkbox">
              <span class="text-sm text-on-surface">on</span>
            </label>

            <button
              class="text-on-surface-variant hover:text-error p-1"
              :title="`Remove ${flag.key}`"
              type="button"
              @click="removeFlag(index)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
            </button>
          </div>
        </div>

        <button
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          type="button"
          @click="addFlag"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          Add flag
        </button>
      </div>
    </div>
  </PluginConfigShell>
</template>
