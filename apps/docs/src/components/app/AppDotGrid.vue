<script setup lang="ts">
  // Framework
  import { GnDotGrid, type GnDotGridProps } from '@paper/genesis'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Docs adapter for the canonical GnDotGrid primitive in @paper/genesis.
  // Kept as a thin local component so the docs auto-import keeps resolving
  // <AppDotGrid>. The connecting-line intensity and skew default to the user's
  // "Line intensity" / "Skew" settings (shared with the app-shell grid); the
  // genesis primitive itself stays neutral (lines=0, skew=0). Any usage can
  // override :lines or :skew.
  const { lines, skew, ...props } = defineProps<GnDotGridProps>()

  const settings = useSettings()
</script>

<template>
  <GnDotGrid
    v-bind="props"
    :lines="lines ?? settings.dotGridIntensity.value"
    :skew="skew ?? settings.dotGridSkew.value"
  />
</template>
