<script lang="ts">
  // Framework
  import { Atom, Button } from '@vuetify/v0'

  // Context
  import { orphan, useQuBottomSheet } from './context'

  // Types
  import type { QuIconName } from '../../icons'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuBottomSheetItemProps {
    /** A glyph role: 24 dp at the start of a list row, 48 dp above the label of a grid tile. */
    icon?: QuIconName
    /** Renders the item as a link instead of a button. */
    href?: string
    /** Out of the tab order, no activation, the disabled ink. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuBottomSheetItem' })

  defineSlots<{
    /** The label: one line, Regular 16 sp in a list. */
    default?: () => any
  }>()

  const { icon, href, disabled = false } = defineProps<QuBottomSheetItemProps>()

  const context = useQuBottomSheet()

  orphan('QuBottomSheetItem', context)

  // A modal sheet is a menu of actions: choosing one is done with the sheet.
  // A persistent sheet stays, as the page says it remains visible when not in use.
  function onClick () {
    if (disabled || !context || context.persistent.value) return

    context.close()
  }
</script>

<template>
  <Atom
    v-if="href"
    :aria-disabled="disabled || undefined"
    as="a"
    class="quantum-bottom-sheet__item"
    :data-disabled="disabled || undefined"
    :href="disabled ? undefined : href"
    :role="disabled ? 'link' : undefined"
    @click="onClick"
  >
    <QuRipple />

    <span v-if="icon" class="quantum-bottom-sheet__icon">
      <QuIcon :name="icon" />
    </span>

    <span class="quantum-bottom-sheet__label"><slot /></span>
  </Atom>

  <Button.Root
    v-else
    class="quantum-bottom-sheet__item"
    :disabled
    @click="onClick"
  >
    <QuRipple />

    <span v-if="icon" class="quantum-bottom-sheet__icon">
      <QuIcon :name="icon" />
    </span>

    <span class="quantum-bottom-sheet__label"><slot /></span>
  </Button.Root>
</template>
