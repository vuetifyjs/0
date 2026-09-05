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

  // `target` is omitted rather than set to undefined when blank — the config is
  // JSON-serialized, so an explicit undefined key is both meaningless and misleading.
  function snapshot (): RtlConfig {
    const target = state.target?.trim()

    if (!target) return { default: state.default }

    return { default: state.default, target }
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
      <!-- The card changed nothing on select, so hover was the strongest state on screen. -->
      <label
        class="pick flex items-start gap-3 p-4 cursor-pointer"
        :class="state.default ? 'pick-on' : 'pick-off'"
      >
        <Checkbox.Root
          v-model="state.default"
          class="field-check size-5 mt-1"
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
