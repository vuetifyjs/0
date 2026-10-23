<script lang="ts">
  // Context
  import { orphan, useQuList, useQuListItem } from './context'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'

  export interface QuListAvatarProps {
    /** The image drawn in the 40 dp circle. Without it the circle is a Grey 400 fill for the default slot (an icon, initials). */
    src?: string
    /** Alternative text. Empty by default: the tile's primary text already names the person or thing. */
    alt?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListAvatar' })

  defineSlots<{
    /** What the circle shows without `src`: a `QuIcon`, initials. */
    default?: () => any
  }>()

  const { src, alt = '' } = defineProps<QuListAvatarProps>()

  const item = useQuListItem()
  const list = useQuList()

  orphan('QuListAvatar', 'QuList.Item', item)

  // The selection pattern's check mark replaces the avatar in a multiple-select list.
  const marked = toRef(() => list?.select.value === 'multiple')
  const selected = toRef(() => item?.selected.value ?? false)
</script>

<template>
  <span class="quantum-list__avatar">
    <span class="quantum-list__face">
      <img v-if="src" :alt class="quantum-list__image" :src>

      <slot v-else />
    </span>

    <span v-if="marked" aria-hidden="true" class="quantum-list__mark">
      <QuIcon :name="selected ? 'check-box' : 'check-box-outline-blank'" />
    </span>
  </span>
</template>
