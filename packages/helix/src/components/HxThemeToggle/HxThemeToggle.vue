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
    padding: 0;
    font: inherit;
  }
</style>
