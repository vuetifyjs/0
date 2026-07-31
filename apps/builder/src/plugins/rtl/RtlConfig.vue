<script setup lang="ts">
  import { mdiCheck } from '@mdi/js'

  // Framework
  import { Checkbox, Input } from '@vuetify/v0'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { RtlConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useRtl as RtlConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<RtlConfig>({
    default: !!initial.default,
    target: initial.target,
  })

  function snapshot (): RtlConfig {
    return {
      default: state.default,
      target: state.target?.trim() || undefined,
    }
  }

  function onSave () {
    store.savePluginConfig('useRtl', snapshot())
  }

  watch(state, () => {
    store.setDraft('useRtl', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useRtl')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useRtl" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Right-to-left support flips component layouts for Arabic, Hebrew, and other
        RTL scripts. Most apps default to LTR; toggle this if your primary audience reads RTL.
      </p>
    </template>

    <div class="space-y-6">
      <label class="flex items-start gap-3 p-4 border border-divider rounded-lg cursor-pointer hover:bg-surface-variant">
        <Checkbox.Root
          v-model="state.default"
          class="size-5 mt-1 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <div>
          <div class="text-sm text-on-surface">Default to right-to-left direction</div>

          <div class="text-xs text-on-surface-variant mt-1">
            When enabled, the adapter sets <code class="code-chip">dir="rtl"</code>
            on the target element on mount. Leave off for LTR (default).
          </div>
        </div>
      </label>

      <label class="field">
        <span class="field-label">Target (optional)</span>

        <Input.Root v-model="state.target">
          <Input.Control
            class="field-input font-mono"
            placeholder="Leave blank to use document.documentElement"
          />
        </Input.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          CSS selector for the element that receives the
          <code class="code-chip">dir</code> attribute. Defaults to the document root.
        </span>
      </label>
    </div>
  </PluginConfigShell>
</template>
