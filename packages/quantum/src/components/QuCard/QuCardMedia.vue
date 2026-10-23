<script lang="ts">
  // Framework
  import { isString, useImage } from '@vuetify/v0'

  // Context
  import { orphan, useQuCard } from './QuCard.vue'

  // Utilities
  import { toRef } from 'vue'

  /** The cards page's media sizes: the two full-width ratios, and the inset squares on the 80 dp base. */
  export type QuCardMediaRatio = '16:9' | '1:1' | '1x' | '1.5x' | '2x' | '3x'

  export interface QuCardMediaProps {
    /** Image source. Leave it unset to fill the media area with your own content. */
    src?: string
    /** Alternative text. Empty, the default, marks the image decorative. */
    alt?: string
    /** `16:9` or `1:1` fill the card's width; `1x` to `3x` are inset squares of 80, 120, 160 and 240 dp. */
    ratio?: QuCardMediaRatio
  }

  const INSET = new Set<QuCardMediaRatio>(['1x', '1.5x', '2x', '3x'])
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCardMedia' })

  defineSlots<{
    /** Content over the image: a title, a caption. */
    default?: () => any
  }>()

  const { src, alt = '', ratio = '16:9' } = defineProps<QuCardMediaProps>()

  orphan('QuCardMedia', useQuCard())

  const image = useImage({ src: () => src })

  const inset = toRef(() => INSET.has(ratio))

  // The load state drives the loading-images recipe; without a source there is nothing to load.
  const state = toRef(() => (isString(src) ? image.status.value : undefined))
</script>

<template>
  <div
    class="quantum-card__media"
    :data-inset="inset || undefined"
    :data-ratio="ratio"
    :data-state="state"
  >
    <img
      v-if="src"
      :alt
      class="quantum-card__image"
      :src="image.source.value"
      @error="image.onError"
      @load="image.onLoad"
    >

    <slot />
  </div>
</template>
