<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  const { showInlineApi } = useSettings()

  function onKeydown (e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      showInlineApi.value = !showInlineApi.value
    }
  }
</script>

<template>
  <section>
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="beaker" size="16" />
      <span>API Reference</span>
    </h3>
    <label class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-tint/50 cursor-pointer">
      <div>
        <span class="text-sm">Show inline</span>
        <p class="text-xs text-on-surface-variant/60">Display API details inline instead of links</p>
      </div>
      <button
        :aria-checked="showInlineApi"
        aria-label="Toggle inline API display"
        :class="[
          'relative w-11 h-6 rounded-full transition-colors shrink-0',
          showInlineApi ? 'bg-primary' : 'bg-surface-variant',
        ]"
        role="switch"
        type="button"
        @click="showInlineApi = !showInlineApi"
        @keydown="onKeydown"
      >
        <span
          :class="[
            'absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow transition-transform',
            showInlineApi ? 'translate-x-6' : 'translate-x-1',
          ]"
        />
      </button>
    </label>
  </section>
</template>
