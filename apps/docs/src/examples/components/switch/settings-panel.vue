<script setup lang="ts">
  import SettingsPanel from './SettingsPanel.vue'
  import { useSettings } from './useSettings'

  const { settings, enabled, saved, onSubmit, reset } = useSettings()

  function labelFor (id: string) {
    return settings.find(setting => setting.id === id)?.label ?? id
  }
</script>

<template>
  <div class="max-w-md mx-auto">
    <SettingsPanel
      v-model:enabled="enabled"
      :reset
      :settings
      :submit="onSubmit"
    />

    <p v-if="saved" class="mt-4 text-sm text-success">
      Saved:
      <template v-if="saved.enabled.length > 0">
        {{ saved.enabled.map(labelFor).join(', ') }}
      </template>

      <template v-else>all notifications off</template>
    </p>

    <p v-else class="mt-4 text-xs text-on-surface-variant">
      Toggle settings and press Save to capture the current selection.
    </p>
  </div>
</template>
