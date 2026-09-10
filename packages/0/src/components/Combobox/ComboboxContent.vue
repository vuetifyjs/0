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
  import { useComboboxRoot } from './ComboboxRoot.vue'

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

  const root = useComboboxRoot(namespace)
  const content = useTemplateRef<AtomExpose>('content')
  const el = toRef(() => {
    const node = toElement(content.value?.element)
    return node instanceof HTMLElement ? node : null
  })

  root.popover.attach(el)
  watch(el, node => {
    root.listEl.value = node
  }, { immediate: true })
  onBeforeUnmount(() => {
    root.listEl.value = null
  })

  const { hasContent } = useLazy(root.isOpen, { eager })

  // Manual popover mode — dismiss on click outside both content and activator
  const activator = toRef(() => {
    const node = root.inputEl.value?.closest('[data-state]')
    return node instanceof HTMLElement ? node : null
  })

  useClickOutside(
    [el, activator],
    () => {
      if (root.isOpen.value) {
        root.commit()
        root.close()
      }
    },
  )

  const slotProps = toRef((): ComboboxContentSlotProps => ({
    isOpen: root.isOpen.value,
    attrs: {
      ...root.popover.contentAttrs.value,
      'id': root.listboxId,
      'role': 'listbox',
      'aria-labelledby': root.inputId,
      'aria-multiselectable': toValue(root.multiple) || undefined,
      'popover': 'manual',
      'tabindex': -1,
      'style': root.popover.contentStyles.value,
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
