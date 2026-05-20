<script setup lang="ts">
  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { RtlConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useRtl as RtlConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<RtlConfig>({
    default: !!initial.default,
    target: initial.target,
  })

  function onSave () {
    const config: RtlConfig = {
      default: state.default,
      target: state.target?.trim() || undefined,
    }
    store.savePluginConfig('useRtl', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useRtl" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Right-to-left support flips component layouts for Arabic, Hebrew, and other
        RTL scripts. Most apps default to LTR; toggle this if your primary audience reads RTL.
      </p>
    </template>

    <div class="space-y-6">
      <label class="flex items-start gap-3 p-4 border border-divider rounded-lg cursor-pointer hover:bg-surface-variant">
        <input v-model="state.default" class="w-4 h-4 mt-1" type="checkbox">

        <div>
          <div class="text-sm text-on-surface">Default to right-to-left direction</div>

          <div class="text-xs text-on-surface-variant mt-1">
            When enabled, the adapter sets <code class="px-1 rounded bg-surface-variant">dir="rtl"</code>
            on the target element on mount. Leave off for LTR (default).
          </div>
        </div>
      </label>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Target (optional)</span>

        <input
          v-model="state.target"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          placeholder="Leave blank to use document.documentElement"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          CSS selector for the element that receives the
          <code class="px-1 rounded bg-surface-variant">dir</code> attribute. Defaults to the document root.
        </span>
      </label>
    </div>
  </PluginConfigShell>
</template>
