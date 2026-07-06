<script lang="ts">
  // Types
  import type { CarouselIndicatorItem } from '@vuetify/v0'

  export interface EmCarouselIndicatorItemProps {
    item: CarouselIndicatorItem
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCarouselIndicatorItem' })

  const { item } = defineProps<EmCarouselIndicatorItemProps>()
</script>

<template>
  <button
    class="emerald-carousel__indicator"
    type="button"
    v-bind="item.attrs"
  >
    <slot />
  </button>
</template>
