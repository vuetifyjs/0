<script setup lang="ts">
  import { mdiCheck, mdiMinus, mdiPlus } from '@mdi/js'

  // Framework
  import { Checkbox, NumberField } from '@vuetify/v0'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { TooltipConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useTooltip as TooltipConfig | undefined
  const initial: TooltipConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<TooltipConfig>({
    openDelay: initial.openDelay,
    closeDelay: initial.closeDelay,
    skipDelay: initial.skipDelay,
    disabled: !!initial.disabled,
  })

  function snapshot (): TooltipConfig {
    return {
      openDelay: state.openDelay,
      closeDelay: state.closeDelay,
      skipDelay: state.skipDelay,
      disabled: state.disabled,
    }
  }

  function onSave () {
    store.savePluginConfig('useTooltip', snapshot())
  }

  watch(state, () => {
    store.setDraft('useTooltip', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useTooltip')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useTooltip" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Coordinate tooltip timing across a region. Once one tooltip has opened, moving to a
        neighbouring target opens instantly instead of waiting out the open delay again.
      </p>
    </template>

    <div class="space-y-6">
      <label class="field">
        <span class="field-label">Open delay (ms)</span>

        <NumberField.Root
          v-model="state.openDelay"
          class="flex w-full"
          label="Open delay in milliseconds"
          :min="0"
          :step="50"
        >
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 flex-1 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          How long a target must be hovered or focused before its tooltip opens.
        </span>
      </label>

      <label class="field">
        <span class="field-label">Close delay (ms)</span>

        <NumberField.Root
          v-model="state.closeDelay"
          class="flex w-full"
          label="Close delay in milliseconds"
          :min="0"
          :step="50"
        >
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 flex-1 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Grace period after the pointer leaves, so brief gaps don't dismiss the tooltip.
        </span>
      </label>

      <label class="field">
        <span class="field-label">Skip delay (ms)</span>

        <NumberField.Root
          v-model="state.skipDelay"
          class="flex w-full"
          label="Skip delay in milliseconds"
          :min="0"
          :step="50"
        >
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 flex-1 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Window after a tooltip closes during which the next one opens instantly.
        </span>
      </label>

      <label class="flex items-center gap-2">
        <Checkbox.Root
          v-model="state.disabled"
          class="field-check"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">Disable all tooltips in this region</span>
      </label>

      <div class="inset p-4">
        <div class="field-label mb-2">Preview</div>

        <p class="text-sm text-on-surface-variant font-mono">
          hover {{ state.openDelay }}ms to open, {{ state.closeDelay }}ms grace on leave,
          instant re-open within {{ state.skipDelay }}ms
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
