<script lang="ts">
  // Context
  import { orphan, useMd1List, useMd1ListItem } from './context'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'

  export interface Md1ListIconProps {
    /** The glyph role: 24 dp at the 16 dp edge, in the active icon ink, also 24 dp in dense lists. */
    name: Md1IconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListIcon' })

  const { name } = defineProps<Md1ListIconProps>()

  const item = useMd1ListItem()
  const list = useMd1List()

  orphan('Md1ListIcon', 'Md1List.Item', item)

  // The selection pattern's check mark replaces the icon in a multiple-select list.
  const marked = toRef(() => list?.select.value === 'multiple')
  const selected = toRef(() => item?.selected.value ?? false)
</script>

<template>
  <span class="md1-list__icon">
    <span class="md1-list__face">
      <Md1Icon :name />
    </span>

    <span v-if="marked" aria-hidden="true" class="md1-list__mark">
      <Md1Icon :name="selected ? 'check-box' : 'check-box-outline-blank'" />
    </span>
  </span>
</template>
