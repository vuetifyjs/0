<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiMinus, mdiPlus } from '@mdi/js'

  // Framework
  import { Input, NumberField, Select } from '@vuetify/v0'

  import { defaultConfig, NOTIFICATIONS_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { NotificationsAdapter, NotificationsConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useNotifications as NotificationsConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<NotificationsConfig>({
    timeout: initial.timeout,
    namespace: initial.namespace,
    adapter: initial.adapter,
  })

  function adapterLabel (adapter: typeof NOTIFICATIONS_ADAPTERS[number]): string {
    return adapter === 'none' ? 'None (toasts work without an external service)' : adapter
  }

  function snapshot (): NotificationsConfig {
    return {
      timeout: state.timeout,
      namespace: state.namespace,
      adapter: state.adapter,
    }
  }

  function onSave () {
    store.savePluginConfig('useNotifications', snapshot())
  }

  watch(state, () => {
    store.setDraft('useNotifications', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useNotifications')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useNotifications" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Queue and dispatch notifications with an optional auto-dismiss timeout. Use
        <code class="code-chip">notifications.send()</code>
        from any component to push a toast.
      </p>
    </template>

    <div class="space-y-6">
      <div class="inset p-4">
        <div class="field-label mb-2">Heads up</div>

        <p class="text-sm text-on-surface-variant">
          Notification positioning, severity styling, and visual rendering are configured
          on the consuming component (e.g.,
          <code class="code-chip">&lt;Snackbar&gt;</code>
          slot props), not on this plugin.
        </p>
      </div>

      <label class="field">
        <span class="field-label">Timeout (ms)</span>

        <NumberField.Root v-model="state.timeout" class="flex w-full" label="Auto-dismiss timeout in milliseconds" :min="0">
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 flex-1 min-w-0 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Auto-dismiss after N milliseconds. Set to 0 for persistent toasts.
        </span>
      </label>

      <label class="field">
        <span class="field-label">Namespace</span>

        <Input.Root v-model="state.namespace">
          <Input.Control
            class="field-input font-mono"
            placeholder="v0:notifications"
          />
        </Input.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Plugin namespace (rarely changed).
        </span>
      </label>

      <label class="field">
        <span class="field-label">Adapter</span>

        <Select.Root v-model="state.adapter">
          <Select.Activator class="field-activator">
            <Select.Value v-slot="{ selectedValue }">
              {{ adapterLabel(selectedValue as NotificationsAdapter) }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

            <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
            <Select.Item
              v-for="adapter in NOTIFICATIONS_ADAPTERS"
              :id="adapter"
              :key="adapter"
              :value="adapter"
            >
              <template #default="{ isSelected, isHighlighted }">
                <div
                  class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm"
                  :class="[isHighlighted ? 'bg-primary text-on-primary' : isSelected ? 'text-primary font-medium' : 'text-on-surface hover:bg-surface-variant']"
                >
                  <svg class="w-4 h-4" :class="isSelected ? 'visible' : 'invisible'" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                  {{ adapterLabel(adapter) }}
                </div>
              </template>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Optional external sync target (Knock, Novu). Notifications work without one.
        </span>
      </label>

      <div v-if="state.adapter !== 'none'" class="inset p-4">
        <div class="field-label mb-2">Adapter configuration</div>

        <p class="text-sm text-on-surface-variant">
          API keys / channel IDs are passed to the
          <code class="code-chip">{{ state.adapter }}</code>
          constructor in code.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
