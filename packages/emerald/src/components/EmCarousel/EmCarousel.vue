<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmCarouselProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarousel' })

  const {} = defineProps<EmCarouselProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-carousel">
    <slot />
  </V0Paper>
</template>
