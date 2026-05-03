/**
 * @module ComboboxControl
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Text input for the combobox. Handles query updates, keyboard navigation,
 * and ARIA combobox role. Populates the inputEl ref on the context so
 * useVirtualFocus can manage aria-activedescendant automatically via control.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { toRef, toValue, useTemplateRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxControlProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** When to open the dropdown */
    openOn?: 'focus' | 'input'
    /** Placeholder text */
    placeholder?: string
  }

  export interface ComboboxControlSlotProps {
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
      'aria-describedby': string | undefined
      'aria-errormessage': string | undefined
      'aria-invalid': boolean | undefined
      'aria-disabled': boolean | undefined
      'disabled': boolean | undefined
      'onInput': (e: Event) => void
      'onFocus': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxControl' })

  defineSlots<{
    default: (props: ComboboxControlSlotProps) => any
  }>()

  const {
    as = 'input',
    namespace = 'v0:combobox',
    openOn = 'focus',
    placeholder,
  } = defineProps<ComboboxControlProps>()

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
          const highlighted = context.cursor.highlightedId.value
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
          if (isUndefined(context.cursor.highlightedId.value)) {
            const selected = context.selection.selectedIds.values().next().value
            if (!isUndefined(selected)) {
              context.cursor.highlight(selected)
              break
            }
          }
          context.cursor.onKeydown(e)
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
  const invalid = toRef(() => context.isValid.value === false)

  const slotProps = toRef((): ComboboxControlSlotProps => ({
    query: context.query.value,
    isOpen: context.isOpen.value,
    attrs: {
      'id': context.inputId,
      'role': 'combobox',
      'aria-autocomplete': strict.value ? 'both' : 'list',
      'aria-expanded': context.isOpen.value,
      'aria-haspopup': 'listbox',
      'aria-controls': context.listboxId,
      'aria-describedby': context.hasDescription.value ? context.descriptionId : undefined,
      'aria-errormessage': (context.hasError.value && context.errors.value.length > 0) ? context.errorId : undefined,
      'aria-invalid': invalid.value || undefined,
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
    :value="context.display.value"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
