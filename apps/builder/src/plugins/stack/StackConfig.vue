<script setup lang="ts">
  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { StackConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useStack as StackConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<StackConfig>({
    baseZIndex: initial.baseZIndex,
    increment: initial.increment,
  })

  function onSave () {
    const config: StackConfig = {
      baseZIndex: state.baseZIndex,
      increment: state.increment,
    }
    store.savePluginConfig('useStack', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useStack" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Coordinate z-index across overlays (dialogs, menus, snackbars). Each registered
        overlay sits one increment above the one below it.
      </p>
    </template>

    <div class="space-y-6">
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Base z-index</span>

        <input
          v-model.number="state.baseZIndex"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          min="0"
          placeholder="2000"
          type="number"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          z-index of the first stacked overlay; subsequent overlays stack above.
        </span>
      </label>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Increment</span>

        <input
          v-model.number="state.increment"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          min="1"
          placeholder="10"
          type="number"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          How much each overlay's z-index increases above the one below.
        </span>
      </label>

      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Preview</div>

        <p class="text-sm text-on-surface-variant font-mono">
          first = {{ state.baseZIndex }}, second = {{ state.baseZIndex + state.increment }},
          third = {{ state.baseZIndex + state.increment * 2 }}, ...
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
