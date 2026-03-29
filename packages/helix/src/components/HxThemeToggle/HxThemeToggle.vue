<script lang="ts">
  export interface HxThemeToggleProps {
    /** Show text label alongside the button */
    showLabel?: boolean
  }
</script>

<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '#helix/composables/useThemeToggle'

  defineOptions({ name: 'HxThemeToggle' })

  const { showLabel = false } = defineProps<HxThemeToggleProps>()

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
    class="helix-theme-toggle"
    :data-mode="mode"
    type="button"
    @click="toggle"
  >
    <slot>
      <span v-if="showLabel" class="helix-theme-toggle__label">{{ labels[mode] }}</span>
    </slot>
  </button>
</template>

<style scoped>
  .helix-theme-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    cursor: pointer;
    background: none;
    border: none;
    border-radius: 0.375rem;
    padding: 0.375rem 0.5rem;
    font: inherit;
    color: var(--v0-on-surface);
    transition: background-color 150ms ease;
  }

  .helix-theme-toggle:hover {
    background-color: var(--v0-surface-tint);
  }

  .helix-theme-toggle:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-theme-toggle__label {
    font-size: 0.875rem;
    color: var(--v0-on-surface-variant);
  }
</style>
