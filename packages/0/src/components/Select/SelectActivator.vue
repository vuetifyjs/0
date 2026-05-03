/**
 * @module SelectActivator
 *
 * @see https://0.vuetifyjs.com/components/forms/select
 *
 * @remarks
 * Trigger component for the select dropdown. Provides the button element
 * with combobox ARIA role, keyboard navigation, and CSS anchor positioning
 * for the dropdown content.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSelectContext } from './SelectRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { toRef, useTemplateRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SelectActivatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface SelectActivatorSlotProps {
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Attributes to bind to the trigger element */
    attrs: {
      'id': string
      'role': 'combobox'
      'type': 'button' | undefined
      'aria-expanded': boolean
      'aria-haspopup': 'listbox'
      'aria-controls': string
      'data-open': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SelectActivator' })

  defineSlots<{
    default: (props: SelectActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:select',
  } = defineProps<SelectActivatorProps>()

  const context = useSelectContext(namespace)

  const activatorEl = useTemplateRef('activator')
  watchEffect(() => {
    context.activatorEl.value = activatorEl.value?.element ?? null
  })

  function onClick () {
    context.toggle()
  }

  function onKeydown (e: KeyboardEvent) {
    if (context.isOpen.value) {
      switch (e.key) {
        case ' ':
        case 'Enter': {
          e.preventDefault()
          if (!isUndefined(context.virtualFocus.highlightedId.value)) {
            context.select(context.virtualFocus.highlightedId.value)
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          context.close()
          break
        }
        case 'Tab': {
          context.close()
          break
        }
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Home':
        case 'End': {
          context.virtualFocus.onKeydown(e)
          break
        }
      }
    } else {
      switch (e.key) {
        case ' ':
        case 'Enter':
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault()
          context.open()
          break
        }
      }
    }
  }

  const style = toRef(() => context.popover.anchorStyles.value)

  const slotProps = toRef((): SelectActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'id': context.activatorId,
      'role': 'combobox',
      'type': as === 'button' ? 'button' : undefined,
      'aria-expanded': context.isOpen.value,
      'aria-haspopup': 'listbox',
      'aria-controls': context.listboxId,
      'data-open': context.isOpen.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    ref="activator"
    :as
    :style
    v-bind="slotProps.attrs"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
