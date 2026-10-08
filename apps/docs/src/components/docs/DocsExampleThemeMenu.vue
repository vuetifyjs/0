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

  const chip = 'bg-surface-tint text-on-surface-tint hover:bg-surface-tint pa-1 inline-flex rounded-none rounded-bl-[0.375rem] cursor-pointer'

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
      @click="onFlip"
    >
      <AppIcon :icon />
    </Button.Root>
  </AppTooltip>

  <AppThemeSelector v-else example />
</template>
