<script setup lang="ts">
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

        <input
          v-model.number="state.timeout"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          min="0"
          placeholder="3000"
          type="number"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          Auto-dismiss after N milliseconds. Set to 0 for persistent toasts.
        </span>
      </label>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Namespace</span>

        <input
          v-model="state.namespace"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          placeholder="v0:notifications"
        >

        <span class="block mt-1 text-xs text-on-surface-variant">
          Plugin namespace (rarely changed).
        </span>
      </label>

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

        <select
          v-model="state.adapter"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
        >
          <option v-for="adapter in NOTIFICATIONS_ADAPTERS" :key="adapter" :value="adapter">
            {{ adapter === 'none' ? 'None (toasts work without an external service)' : adapter }}
          </option>
        </select>

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
