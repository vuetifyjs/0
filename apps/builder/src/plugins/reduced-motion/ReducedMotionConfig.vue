<script setup lang="ts">
  import { mdiCheck } from '@mdi/js'

  // Framework
  import { Checkbox, Radio } from '@vuetify/v0'

  import { defaultConfig, MODE_HINTS, MODES } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { ReducedMotionConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useReducedMotion as ReducedMotionConfig | undefined
  const initial: ReducedMotionConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<ReducedMotionConfig>({
    mode: initial.mode,
    persist: !!initial.persist,
  })

  function snapshot (): ReducedMotionConfig {
    return {
      mode: state.mode,
      persist: state.persist,
    }
  }

  function onSave () {
    store.savePluginConfig('useReducedMotion', snapshot())
  }

  watch(state, () => {
    store.setDraft('useReducedMotion', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useReducedMotion')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useReducedMotion" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Respect — or deliberately override — the operating system's
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">prefers-reduced-motion</code>
        setting. Components read
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">isReduced</code>
        to skip or shorten transitions.
      </p>
    </template>

    <div class="space-y-6">
      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Initial mode</div>

        <Radio.Group v-model="state.mode" aria-label="Initial reduced-motion mode" class="space-y-2">
          <label
            v-for="mode in MODES"
            :key="mode"
            class="flex items-start gap-3 p-3 rounded-lg border border-divider bg-surface cursor-pointer hover:border-on-surface-variant/40 transition-colors"
          >
            <Radio.Root
              class="mt-0.5 size-5 border rounded-full inline-flex flex-shrink-0 items-center justify-center border-divider data-[state=checked]:border-primary"
              :value="mode"
            >
              <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
            </Radio.Root>

            <span class="min-w-0">
              <span class="block text-sm font-medium font-mono text-on-surface">{{ mode }}</span>
              <span class="block text-xs text-on-surface-variant mt-0.5">{{ MODE_HINTS[mode] }}</span>
            </span>
          </label>
        </Radio.Group>
      </div>

      <label class="flex items-center gap-2">
        <Checkbox.Root
          v-model="state.persist"
          class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">Persist the selected mode to storage</span>
      </label>

      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          A custom <code class="text-xs px-1.5 py-0.5 rounded bg-surface">ReducedMotionAdapter</code>
          (for framework-specific side effects) is passed to
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">createReducedMotionPlugin()</code>
          in code, not from this form.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
