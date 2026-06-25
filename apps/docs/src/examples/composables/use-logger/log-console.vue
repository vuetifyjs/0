<script setup lang="ts">
  import LogConsole from './LogConsole.vue'
  import { useLogConsole } from './useLogConsole'

  const { logs, level, enabled, levels, onLevel, onToggle, onClear } = useLogConsole()
</script>

<template>
  <div class="space-y-3">
    <LogConsole
      :enabled
      :level
      :levels
      :logs
      @clear="onClear"
      @level="onLevel"
      @toggle="onToggle"
    />

    <p class="text-xs text-on-surface-variant/70">
      Raise the minimum level to <span class="font-medium text-on-surface">warn</span>, then
      click <span class="font-mono">debug()</span> — the call is gated out and never reaches the
      panel. Toggle <span class="font-medium text-on-surface">Disabled</span> to silence every
      level at once.
    </p>
  </div>
</template>
