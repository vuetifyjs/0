<script setup lang="ts">
  // Framework
  import { GnDotGrid, type GnDotGridProps } from '@paper/genesis'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Docs adapter for the canonical GnDotGrid primitive in @paper/genesis.
  // Kept as a thin local component so the docs auto-import keeps resolving
  // <AppDotGrid>. The connecting-line intensity defaults to the user's
  // "Line intensity" setting (shared with the app-shell grid); the genesis
  // primitive itself stays neutral (lines=0). Any usage can override :lines.
  const { lines, ...props } = defineProps<GnDotGridProps>()

  const settings = useSettings()
</script>

<template>
  <GnDotGrid v-bind="props" :lines="lines ?? settings.dotGridIntensity.value" />
</template>
