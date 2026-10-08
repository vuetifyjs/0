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
      <p class="t-body text-on-surface-variant">
        Respect — or deliberately override — the operating system's
        <code class="code-chip">prefers-reduced-motion</code>
        setting. Components read
        <code class="code-chip">isReduced</code>
        to skip or shorten transitions.
      </p>
    </template>

    <div class="space-y-6">
      <div>
        <div class="field-label mb-2">Initial mode</div>

        <Radio.Group v-model="state.mode" aria-label="Initial reduced-motion mode" class="space-y-2">
          <!-- A 10px dot was the only thing marking the chosen mode, so hovering any other
               row out-ranked it. The whole row now carries the selection. -->
          <label
            v-for="mode in MODES"
            :key="mode"
            class="pick flex items-start gap-3 p-3 cursor-pointer"
            :class="state.mode === mode ? 'pick-on' : 'pick-off'"
          >
            <Radio.Root
              class="mt-0.5 size-5 border rounded-full inline-flex flex-shrink-0 items-center justify-center border-divider bg-background data-[state=checked]:border-primary"
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
          class="field-check"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">Persist the selected mode to storage</span>
      </label>

      <div class="note">
        <div class="field-label mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          A custom <code class="code-chip">ReducedMotionAdapter</code>
          (for framework-specific side effects) is passed to
          <code class="code-chip">createReducedMotionPlugin()</code>
          in code, not from this form.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
