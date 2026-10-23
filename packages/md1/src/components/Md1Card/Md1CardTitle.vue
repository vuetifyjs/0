<script lang="ts">
  // Framework
  import { useId } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Card } from './Md1Card.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  export type Md1CardTitleLevel = 1 | 2 | 3 | 4 | 5 | 6

  export interface Md1CardTitleProps {
    /** Heading level of the rendered `h1` to `h6`. The type stays Headline 24 sp whatever the level. */
    level?: Md1CardTitleLevel
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1CardTitle' })

  defineSlots<{
    /** The title text. */
    default?: () => any
  }>()

  const { level = 2 } = defineProps<Md1CardTitleProps>()

  const context = useMd1Card()

  orphan('Md1CardTitle', context)

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
    class="md1-card__title"
  >
    <slot />
  </component>
</template>
