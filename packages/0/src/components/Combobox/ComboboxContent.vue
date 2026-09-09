/**
 * @module ComboboxContent
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Dropdown content for the combobox. Uses the popover composable from Root
 * context for native popover API and CSS anchor positioning. Uses manual
 * popover mode to prevent light-dismiss from closing the dropdown when the
 * user clicks the input/activator area. Pointer dismiss is handled via
 * useClickOutside as commit-then-close of the query (ignores leftover
 * virtual focus); Escape still cancels via close() only.
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

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { onBeforeUnmount, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

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
    attrs: {
      'id': string
      'role': 'listbox'
      'aria-labelledby': string
      'aria-multiselectable': true | undefined
      'popover': 'manual'
      'tabindex': -1
      'style': Record<string, string>
    }
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
    renderless,
  } = defineProps<ComboboxContentProps>()

  const context = useComboboxContext(namespace)
  const content = useTemplateRef<AtomExpose>('content')

  function contentEl () {
    const el = toElement(content.value?.element)
    return el instanceof HTMLElement ? el : null
  }

  context.popover.attach(contentEl)
  watch(contentEl, el => {
    context.listEl.value = el
  }, { immediate: true })
  onBeforeUnmount(() => {
    context.listEl.value = null
  })

  const { hasContent } = useLazy(context.isOpen, { eager })

  // Manual popover mode — dismiss on click outside both content and activator
  const activator = toRef(() => {
    const node = context.inputEl.value?.closest('[data-state]')
    return node instanceof HTMLElement ? node : null
  })

  useClickOutside(
    [contentEl, activator],
    () => {
      if (context.isOpen.value) {
        context.commit()
        context.close()
      }
    },
  )

  const slotProps = toRef((): ComboboxContentSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      ...context.popover.contentAttrs.value,
      'id': context.listboxId,
      'role': 'listbox',
      'aria-labelledby': context.inputId,
      'aria-multiselectable': toValue(context.multiple) || undefined,
      'popover': 'manual',
      'tabindex': -1,
      'style': context.popover.contentStyles.value,
    },
  }))
</script>

<template>
  <Atom
    ref="content"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-if="hasContent" v-bind="slotProps" />
  </Atom>
</template>
