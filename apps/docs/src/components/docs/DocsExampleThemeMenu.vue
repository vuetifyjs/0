<script setup lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const { modesOnly = false } = defineProps<{
    /** Light / dark only — a flip button, not the theme menu. */
    modesOnly?: boolean
  }>()

  const toggle = useThemeToggleController()
  const icon = toRef(() => (toggle.isDark.value ? 'theme-dark' : 'theme-light'))
  const title = toRef(() => (toggle.isDark.value ? 'Switch to light' : 'Switch to dark'))

  // Painted with the example frame, not the preview panel. The frame color
  // stays put when the example theme flips, and only the inner corner rounds.
  const chip = 'docs-example-theme-chip text-on-surface pa-1 inline-flex rounded-bl-[0.375rem] cursor-pointer'
  const chipStyle = {
    background: 'var(--v0-surface-tint, var(--v0-surface, #f5f5f8))',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
  }

  function onFlip () {
    toggle.setMode(toggle.isDark.value ? 'light' : 'dark')
  }
</script>

<template>
  <AppTooltip
    v-if="modesOnly"
    as="span"
    class="mt-[8px] me-[8px] inline-flex"
    position-area="bottom"
    :text="title"
  >
    <Button.Root
      :aria-label="title"
      :class="chip"
      :style="chipStyle"
      @click="onFlip"
    >
      <AppIcon :icon />
    </Button.Root>
  </AppTooltip>

  <AppThemeSelector v-else example />
</template>
