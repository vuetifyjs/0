<script lang="ts">
  // Context
  import { orphan, useQuList, useQuListItem } from './context'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'

  export interface QuListIconProps {
    /** The glyph role: 24 dp at the 16 dp edge, in the active icon ink, also 24 dp in dense lists. */
    name: QuIconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListIcon' })

  const { name } = defineProps<QuListIconProps>()

  const item = useQuListItem()
  const list = useQuList()

  orphan('QuListIcon', 'QuList.Item', item)

  // The selection pattern's check mark replaces the icon in a multiple-select list.
  const marked = toRef(() => list?.select.value === 'multiple')
  const selected = toRef(() => item?.selected.value ?? false)
</script>

<template>
  <span class="quantum-list__icon">
    <span class="quantum-list__face">
      <QuIcon :name />
    </span>

    <span v-if="marked" aria-hidden="true" class="quantum-list__mark">
      <QuIcon :name="selected ? 'check-box' : 'check-box-outline-blank'" />
    </span>
  </span>
</template>
