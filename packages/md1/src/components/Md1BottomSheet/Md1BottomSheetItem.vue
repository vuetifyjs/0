<script lang="ts">
  // Framework
  import { Atom, Button } from '@vuetify/v0'

  // Context
  import { orphan, useMd1BottomSheet } from './context'

  // Types
  import type { Md1IconName } from '../../icons'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1BottomSheetItemProps {
    /** A glyph role: 24 dp at the start of a list row, 48 dp above the label of a grid tile. */
    icon?: Md1IconName
    /** Renders the item as a link instead of a button. */
    href?: string
    /** Out of the tab order, no activation, the disabled ink. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1BottomSheetItem' })

  defineSlots<{
    /** The label: one line, Regular 16 sp in a list. */
    default?: () => any
  }>()

  const { icon, href, disabled = false } = defineProps<Md1BottomSheetItemProps>()

  const context = useMd1BottomSheet()

  orphan('Md1BottomSheetItem', context)

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
    class="md1-bottom-sheet__item"
    :data-disabled="disabled || undefined"
    :href="disabled ? undefined : href"
    :role="disabled ? 'link' : undefined"
    @click="onClick"
  >
    <Md1Ripple />

    <span v-if="icon" class="md1-bottom-sheet__icon">
      <Md1Icon :name="icon" />
    </span>

    <span class="md1-bottom-sheet__label"><slot /></span>
  </Atom>

  <Button.Root
    v-else
    class="md1-bottom-sheet__item"
    :disabled
    @click="onClick"
  >
    <Md1Ripple />

    <span v-if="icon" class="md1-bottom-sheet__icon">
      <Md1Icon :name="icon" />
    </span>

    <span class="md1-bottom-sheet__label"><slot /></span>
  </Button.Root>
</template>
