/**
 * @module ComboboxInput
 *
 * @remarks
 * Text input for the combobox. Handles query updates, keyboard navigation,
 * and ARIA combobox role. Populates the inputEl ref on the context so
 * virtualFocus can manage aria-activedescendant automatically via control.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { toRef, toValue, useTemplateRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxInputProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** When to open the dropdown */
    openOn?: 'focus' | 'input'
    /** Placeholder text */
    placeholder?: string
  }

  export interface ComboboxInputSlotProps {
    /** Current query value */
    query: string
    /** Whether the dropdown is open */
    isOpen: boolean
    /** Attributes to bind to the input element */
    attrs: {
      'id': string
      'role': 'combobox'
      'aria-autocomplete': 'list' | 'both'
      'aria-expanded': boolean
      'aria-haspopup': 'listbox'
      'aria-controls': string
      'aria-disabled': boolean | undefined
      'disabled': boolean | undefined
      'onInput': (e: Event) => void
      'onFocus': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxInput' })

  defineSlots<{
    default: (props: ComboboxInputSlotProps) => any
  }>()

  const {
    as = 'input',
    namespace = 'v0:combobox',
    openOn = 'focus',
    placeholder,
  } = defineProps<ComboboxInputProps>()

  const context = useComboboxContext(namespace)

  const input = useTemplateRef('input')
  watchEffect(() => {
    context.inputEl.value = input.value?.element ?? null
  })

  function onInput (e: Event) {
    context.pristine.value = false
    context.query.value = (e.target as HTMLInputElement).value
    if (openOn === 'input') context.open()
  }

  function onFocus () {
    if (openOn === 'focus') context.open()
  }

  function onKeydown (e: KeyboardEvent) {
    if (context.isOpen.value) {
      switch (e.key) {
        case 'Enter': {
          e.preventDefault()
          const highlighted = context.virtualFocus.highlightedId.value
          if (!isUndefined(highlighted)) {
            context.select(highlighted)
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
          e.preventDefault()
          if (isUndefined(context.virtualFocus.highlightedId.value)) {
            const selected = context.selection.selectedIds.values().next().value
            if (!isUndefined(selected)) {
              context.virtualFocus.highlight(selected)
              break
            }
          }
          context.virtualFocus.onKeydown(e)
          break
        }
      }
    } else {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault()
          context.open()
          break
        }
      }
    }
  }

  const strict = toRef(() => toValue(context.strict))

  const slotProps = toRef((): ComboboxInputSlotProps => ({
    query: context.query.value,
    isOpen: context.isOpen.value,
    attrs: {
      'id': context.inputId,
      'role': 'combobox',
      'aria-autocomplete': strict.value ? 'both' : 'list',
      'aria-expanded': context.isOpen.value,
      'aria-haspopup': 'listbox',
      'aria-controls': context.listboxId,
      'aria-disabled': toValue(context.disabled) || undefined,
      'disabled': toValue(context.disabled) || undefined,
      'onInput': onInput,
      'onFocus': onFocus,
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    ref="input"
    v-bind="slotProps.attrs"
    :as
    :placeholder
    :value="context.query.value"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
