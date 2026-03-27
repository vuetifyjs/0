<script lang="ts">
  export interface CxThemeToggleProps {
    /** Show text label alongside the button */
    showLabel?: boolean
  }
</script>

<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '#codex/composables/useThemeToggle'

  defineOptions({ name: 'CxThemeToggle' })

  const { showLabel = false } = defineProps<CxThemeToggleProps>()

  const { mode, toggle } = useThemeToggle()

  const labels: Record<string, string> = {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  }
</script>

<template>
  <button
    :aria-label="`Theme: ${labels[mode]}`"
    class="codex-theme-toggle"
    :data-mode="mode"
    type="button"
    @click="toggle"
  >
    <slot>
      <span v-if="showLabel" class="codex-theme-toggle__label">{{ labels[mode] }}</span>
    </slot>
  </button>
</template>

<style scoped>
  .codex-theme-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
  }
</style>
