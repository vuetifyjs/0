<script setup lang="ts">
  import { mdiCheck, mdiMinus, mdiPlus } from '@mdi/js'

  // Framework
  import { Checkbox, Input, NumberField } from '@vuetify/v0'

  import { defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, shallowRef, watch } from 'vue'

  // Types
  import type { StorageConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useStorage as StorageConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<StorageConfig>({
    prefix: initial.prefix,
    ttl: initial.ttl,
  })

  const ttlEnabled = shallowRef(typeof initial.ttl === 'number')

  function onTtlToggle (next: boolean) {
    ttlEnabled.value = next
    state.ttl = next ? (state.ttl ?? 60_000) : undefined
  }

  function snapshot (): StorageConfig {
    return {
      prefix: state.prefix,
      ttl: ttlEnabled.value ? state.ttl : undefined,
    }
  }

  function onSave () {
    store.savePluginConfig('useStorage', snapshot())
  }

  watch([state, ttlEnabled], () => {
    store.setDraft('useStorage', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useStorage')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useStorage" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Persist values across reloads with a uniform key/value API. Backed by
        <code class="code-chip">window.localStorage</code>
        by default, with optional time-to-live expiry.
      </p>
    </template>

    <div class="space-y-6">
      <label class="field">
        <span class="field-label">Key prefix</span>

        <Input.Root v-model="state.prefix">
          <Input.Control
            class="field-input font-mono"
            placeholder="v0:"
          />
        </Input.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Prepended to all keys in storage.
        </span>
      </label>

      <div>
        <label class="flex items-center gap-2 mb-2">
          <Checkbox.Root
            class="field-check"
            :model-value="ttlEnabled"
            @update:model-value="onTtlToggle(!!$event)"
          >
            <Checkbox.Indicator class="text-on-primary">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
            </Checkbox.Indicator>
          </Checkbox.Root>

          <span class="text-sm text-on-surface">Enable TTL (auto-expire)</span>
        </label>

        <NumberField.Root
          v-model="state.ttl"
          class="flex w-full"
          :disabled="!ttlEnabled"
          label="Time to live in milliseconds"
          :min="0"
        >
          <NumberField.Decrement class="px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control
            class="flex-1 px-3 py-2 border-y border-divider bg-surface text-on-surface text-sm font-mono outline-none disabled:opacity-50"
            placeholder="60000"
          />

          <NumberField.Increment class="px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Auto-expire stored values after N milliseconds.
        </span>
      </div>

      <div class="inset p-4">
        <div class="field-label mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          Adapter and serializer are advanced — customize in code by passing a custom
          <code class="code-chip">Storage</code> instance or
          <code class="code-chip">{ read, write }</code> pair to
          <code class="code-chip">createStoragePlugin()</code>.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
