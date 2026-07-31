<script setup lang="ts">
  import { mdiMinus, mdiPlus } from '@mdi/js'

  // Framework
  import { NumberField } from '@vuetify/v0'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { StackConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useStack as StackConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<StackConfig>({
    baseZIndex: initial.baseZIndex,
    increment: initial.increment,
  })

  function snapshot (): StackConfig {
    return {
      baseZIndex: state.baseZIndex,
      increment: state.increment,
    }
  }

  function onSave () {
    store.savePluginConfig('useStack', snapshot())
  }

  watch(state, () => {
    store.setDraft('useStack', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useStack')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useStack" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Coordinate z-index across overlays (dialogs, menus, snackbars). Each registered
        overlay sits one increment above the one below it.
      </p>
    </template>

    <div class="space-y-6">
      <label class="field">
        <span class="field-label">Base z-index</span>

        <NumberField.Root v-model="state.baseZIndex" class="flex w-full" label="Base z-index" :min="0">
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 flex-1 min-w-0 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          z-index of the first stacked overlay; subsequent overlays stack above.
        </span>
      </label>

      <label class="field">
        <span class="field-label">Increment</span>

        <NumberField.Root v-model="state.increment" class="flex w-full" label="Z-index increment" :min="1">
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 flex-1 min-w-0 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          How much each overlay's z-index increases above the one below.
        </span>
      </label>

      <div class="inset p-4">
        <div class="field-label mb-2">Preview</div>

        <p class="text-sm text-on-surface-variant font-mono">
          first = {{ state.baseZIndex }}, second = {{ state.baseZIndex + state.increment }},
          third = {{ state.baseZIndex + state.increment * 2 }}, ...
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
