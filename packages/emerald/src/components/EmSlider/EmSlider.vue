<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmSliderProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSlider' })

  const {} = defineProps<EmSliderProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-slider">
    <slot />
  </V0Paper>
</template>
