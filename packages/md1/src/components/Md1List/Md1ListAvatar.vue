<script lang="ts">
  // Context
  import { orphan, useMd1List, useMd1ListItem } from './context'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'

  export interface Md1ListAvatarProps {
    /** The image drawn in the 40 dp circle. Without it the circle is a Grey 400 fill for the default slot (an icon, initials). */
    src?: string
    /** Alternative text. Empty by default: the tile's primary text already names the person or thing. */
    alt?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListAvatar' })

  defineSlots<{
    /** What the circle shows without `src`: an `Md1Icon`, initials. */
    default?: () => any
  }>()

  const { src, alt = '' } = defineProps<Md1ListAvatarProps>()

  const item = useMd1ListItem()
  const list = useMd1List()

  orphan('Md1ListAvatar', 'Md1List.Item', item)

  // The selection pattern's check mark replaces the avatar in a multiple-select list.
  const marked = toRef(() => list?.select.value === 'multiple')
  const selected = toRef(() => item?.selected.value ?? false)
</script>

<template>
  <span class="md1-list__avatar">
    <span class="md1-list__face">
      <img v-if="src" :alt class="md1-list__image" :src>

      <slot v-else />
    </span>

    <span v-if="marked" aria-hidden="true" class="md1-list__mark">
      <Md1Icon :name="selected ? 'check-box' : 'check-box-outline-blank'" />
    </span>
  </span>
</template>
