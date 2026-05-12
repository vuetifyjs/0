/**
 * @module ComboboxContent
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Dropdown content for the combobox. Uses the popover composable from Root
 * context for native popover API and CSS anchor positioning. Uses manual
 * popover mode to prevent light-dismiss from closing the dropdown when the
 * user clicks the input/activator area. Dismiss is handled via useClickOutside.
 *
 * Uses `useLazy` to defer slot rendering until the dropdown is first opened.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Composables
  import { useClickOutside } from '#v0/composables/useClickOutside'
  import { useLazy } from '#v0/composables/useLazy'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Render content immediately without waiting for first open */
    eager?: boolean
  }

  export interface ComboboxContentSlotProps {
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Attributes to bind to the content element */
    attrs: Record<string, unknown>
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
    eager = false,
  } = defineProps<ComboboxContentProps>()

  const context = useComboboxContext(namespace)
  const content = useTemplateRef('content')

  context.popover.attach(() => content.value?.element)

  const { hasContent } = useLazy(context.isOpen, { eager })

  // Manual popover mode — dismiss on click outside both content and activator
  const activator = toRef(() => context.inputEl.value?.closest('[data-state]') as HTMLElement | null)

  useClickOutside(
    [() => content.value?.element, activator],
    () => {
      if (context.isOpen.value) context.close()
    },
  )

  const slotProps = toRef((): ComboboxContentSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      ...context.popover.contentAttrs.value,
      'id': context.listboxId,
      'role': 'listbox',
      'aria-labelledby': context.inputId,
      'aria-multiselectable': context.multiple || undefined,
      'popover': 'manual',
      'tabindex': -1,
    },
  }))

  const style = toRef(() => context.popover.contentStyles.value)
</script>

<template>
  <Atom
    ref="content"
    v-bind="slotProps.attrs"
    :as
    :style
  >
    <slot v-if="hasContent" v-bind="slotProps" />
  </Atom>
</template>
