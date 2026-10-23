<script lang="ts">
  // Framework
  import { useId } from '@vuetify/v0'

  // Context
  import { orphan, useQuCard } from './QuCard.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  export type QuCardTitleLevel = 1 | 2 | 3 | 4 | 5 | 6

  export interface QuCardTitleProps {
    /** Heading level of the rendered `h1` to `h6`. The type stays Headline 24 sp whatever the level. */
    level?: QuCardTitleLevel
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCardTitle' })

  defineSlots<{
    /** The title text. */
    default?: () => any
  }>()

  const { level = 2 } = defineProps<QuCardTitleProps>()

  const context = useQuCard()

  orphan('QuCardTitle', context)

  const id = useId()

  const tag = toRef(() => `h${level}` as const)

  // The title names the card and its expanded region; the registration is released on unmount.
  const release = context?.title(id)

  onBeforeUnmount(() => release?.())
</script>

<template>
  <component
    :is="tag"
    :id
    class="quantum-card__title"
  >
    <slot />
  </component>
</template>
