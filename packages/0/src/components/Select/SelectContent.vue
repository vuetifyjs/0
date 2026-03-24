/**
 * @module SelectContent
 *
 * @remarks
 * Dropdown content for the select. Uses the popover composable from Root
 * context for native popover API, CSS anchor positioning, and light dismiss.
 * Single element — renders an Atom with popover attrs, positioning styles,
 * and listbox ARIA.
 *
 * Uses `useLazy` to defer slot rendering until the dropdown is first opened.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useSelectContext } from './SelectRoot.vue'

  // Composables
  import { useLazy } from '#v0/composables/useLazy'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SelectContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface SelectContentSlotProps {
    /** Whether the dropdown is open */
    isOpen: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SelectContent' })

  defineSlots<{
    default: (props: SelectContentSlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:select',
  } = defineProps<SelectContentProps>()

  const context = useSelectContext(namespace)
  const content = useTemplateRef('content')

  context.popover.attach(() => content.value?.element)

  const { hasContent } = useLazy(context.isOpen)

  const slotProps = toRef((): SelectContentSlotProps => ({
    isOpen: context.isOpen.value,
  }))

  const attrs = toRef(() => ({
    ...context.popover.contentAttrs.value,
    'id': context.listboxId,
    'role': 'listbox',
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
