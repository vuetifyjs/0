/**
 * @module ComboboxContent
 *
 * @remarks
 * Dropdown content for the combobox. Uses the popover composable from Root
 * context for native popover API, CSS anchor positioning, and light dismiss.
 * Single element — renders an Atom with popover attrs, positioning styles,
 * and listbox ARIA.
 *
 * Uses `useLazy` to defer slot rendering until the dropdown is first opened.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Composables
  import { useLazy } from '#v0/composables/useLazy'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface ComboboxContentSlotProps {
    /** Whether the dropdown is open */
    isOpen: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxContent' })

  defineSlots<{
    default: (props: ComboboxContentSlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:combobox',
  } = defineProps<ComboboxContentProps>()

  const context = useComboboxContext(namespace)
  const content = useTemplateRef('content')

  context.popover.attach(() => content.value?.element)

  const { hasContent } = useLazy(context.isOpen)

  const slotProps = toRef((): ComboboxContentSlotProps => ({
    isOpen: context.isOpen.value,
  }))

  const attrs = toRef(() => ({
    ...context.popover.contentAttrs.value,
    'id': context.listboxId,
    'role': 'listbox',
    'aria-labelledby': context.inputId,
    'aria-multiselectable': context.multiple || undefined,
    'tabindex': -1,
  }))

  const style = toRef(() => context.popover.contentStyles.value)
</script>

<template>
  <Atom
    ref="content"
    :as
    :style
    v-bind="attrs"
  >
    <slot v-if="hasContent" v-bind="slotProps" />
  </Atom>
</template>
