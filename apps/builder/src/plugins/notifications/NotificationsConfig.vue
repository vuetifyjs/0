<script setup lang="ts">
  // Framework
  import { Input, NumberField, Select } from '@vuetify/v0'

  import { defaultConfig, NOTIFICATIONS_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { NotificationsConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useNotifications as NotificationsConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<NotificationsConfig>({
    timeout: initial.timeout,
    namespace: initial.namespace,
    adapter: initial.adapter,
  })

  function adapterLabel (adapter: typeof NOTIFICATIONS_ADAPTERS[number]): string {
    return adapter === 'none' ? 'None (toasts work without an external service)' : adapter
  }

  function onSave () {
    const config: NotificationsConfig = {
      timeout: state.timeout,
      namespace: state.namespace,
      adapter: state.adapter,
    }
    store.savePluginConfig('useNotifications', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useNotifications" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Queue and dispatch notifications with an optional auto-dismiss timeout. Use
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">notifications.send()</code>
        from any component to push a toast.
      </p>
    </template>

    <div class="space-y-6">
      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Heads up</div>

        <p class="text-sm text-on-surface-variant">
          Notification positioning, severity styling, and visual rendering are configured
          on the consuming component (e.g.,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">&lt;Toast&gt;</code>
          slot props), not on this plugin.
        </p>
      </div>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Timeout (ms)</span>

        <NumberField.Root v-model="state.timeout" :min="0">
          <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
            &minus;
          </NumberField.Decrement>

          <NumberField.Control class="mt-1 w-full text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

          <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
            +
          </NumberField.Increment>
        </NumberField.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Auto-dismiss after N milliseconds. Set to 0 for persistent toasts.
        </span>
      </label>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Namespace</span>

        <Input.Root v-model="state.namespace">
          <Input.Control
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
            placeholder="v0:notifications"
          />
        </Input.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Plugin namespace (rarely changed).
        </span>
      </label>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

        <Select.Root v-model="state.adapter">
          <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            <Select.Value v-slot="{ selectedValue }">
              {{ adapterLabel(selectedValue) }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

            <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
              {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
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
                  <span class="w-4 text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
                  {{ adapterLabel(adapter) }}
                </div>
              </template>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Optional external sync target (Knock, Novu). Toasts work without one.
        </span>
      </label>

      <div v-if="state.adapter !== 'none'" class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Adapter configuration</div>

        <p class="text-sm text-on-surface-variant">
          API keys / channel IDs are passed to the
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">{{ state.adapter }}</code>
          constructor in code.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
