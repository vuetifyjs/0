/**
 * @module SelectContent
 *
 * @remarks
 * Dropdown content component for the select. Wraps the existing Popover compound
 * component to leverage native popover API, CSS anchor positioning, and light
 * dismiss behavior. Shares the root `id` with Popover.Root so content
 * automatically anchors to the activator element.
 *
 * Uses `useLazy` to defer rendering until the dropdown is first opened.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SelectContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** CSS position-area value for anchor positioning */
    positionArea?: string
    /** CSS position-try-fallbacks value for fallback positioning */
    positionTry?: string
  }

  export interface SelectContentSlotProps {
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Attributes to bind to the listbox element */
    attrs: {
      'id': string
      'role': 'listbox'
      'aria-multiselectable': boolean | undefined
      'tabindex': -1
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { Popover } from '#v0/components/Popover'
  import { useSelectContext } from './SelectRoot.vue'

  // Composables
  import { useLazy } from '#v0/composables/useLazy'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'SelectContent' })

  defineSlots<{
    default: (props: SelectContentSlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:select',
    positionArea,
    positionTry,
  } = defineProps<SelectContentProps>()

  const context = useSelectContext(namespace)

  const { hasContent } = useLazy(context.isOpen)

  const slotProps = toRef((): SelectContentSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'id': context.listboxId,
      'role': 'listbox',
      'aria-multiselectable': context.multiple || undefined,
      'tabindex': -1,
    },
  }))
</script>

<template>
  <Popover.Root
    :id="context.id"
    v-model="context.isOpen.value"
  >
    <Popover.Content
      :position-area
      :position-try
    >
      <Atom
        v-if="hasContent"
        :as
        v-bind="slotProps.attrs"
      >
        <slot v-bind="slotProps" />
      </Atom>
    </Popover.Content>
  </Popover.Root>
</template>
