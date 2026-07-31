<script setup lang="ts">
  import SettingsPanel from './SettingsPanel.vue'
  import { useSettings } from './useSettings'

  const { name, theme, note, saved, save, forget, reset } = useSettings()
</script>

<template>
  <div class="max-w-md mx-auto space-y-4">
    <SettingsPanel
      v-model:name="name"
      v-model:note="note"
      v-model:theme="theme"
      :forget
      :reset
      :save
      :saved
    />

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 text-xs space-y-0.5">
      <p class="text-on-surface-variant">Stored snapshot</p>
      <p class="text-on-surface">name: <span class="font-mono">{{ name }}</span></p>
      <p class="text-on-surface">theme: <span class="font-mono">{{ theme }}</span></p>
      <p class="text-on-surface">draft saved: <span class="font-mono">{{ saved }}</span></p>
    </div>
  </div>
</template>
