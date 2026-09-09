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

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isElement, isUndefined } from '#v0/utilities'
  import { onBeforeUnmount, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

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
      'aria-disabled': boolean
      'autocomplete': 'off'
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'placeholder': string | undefined
      'value': string
      'onInput': (e: Event) => void
      'onFocus': () => void
      'onBlur': (e: FocusEvent) => void
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
    renderless,
  } = defineProps<ComboboxControlProps>()

  const context = useComboboxContext(namespace)

  const atomRef = useTemplateRef<AtomExpose>('input')
  watch(() => toElement(atomRef.value?.element) ?? null, el => {
    context.inputEl.value = el instanceof HTMLElement ? el : null
  }, { immediate: true })
  onBeforeUnmount(() => {
    context.inputEl.value = null
  })

  function onInput (e: Event) {
    context.pristine.value = false
    context.query.value = (e.target as HTMLInputElement).value
    if (openOn === 'input') context.open()
  }

  function onFocus () {
    if (openOn === 'focus') context.open()
  }

  function onBlur (e: FocusEvent) {
    const next = e.relatedTarget
    if (isElement(next)) {
      const activator = context.inputEl.value?.closest('[data-state]')
      if (context.listEl.value?.contains(next) || activator?.contains(next)) return
    }
    context.commit()
    context.close()
  }

  function composing (e: KeyboardEvent) {
    return e.isComposing && (
      e.key === 'ArrowUp'
      || e.key === 'ArrowDown'
      || e.key === 'ArrowLeft'
      || e.key === 'ArrowRight'
      || e.key === 'Enter'
      || e.key === 'Escape'
      || e.key === 'Tab'
      || e.key === ' '
    )
  }

  function onKeydown (e: KeyboardEvent) {
    if (composing(e)) return

    if (context.isOpen.value) {
      switch (e.key) {
        case 'Enter': {
          e.preventDefault()
          const highlighted = context.cursor.highlightedId.value
          if (isUndefined(highlighted)) {
            context.commit()
          } else {
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
          const highlighted = context.cursor.highlightedId.value
          if (isUndefined(highlighted)) {
            context.commit()
          } else if (!context.selection.selected(highlighted)) {
            context.select(highlighted)
          }
          // Multiple-select commit/select keeps the menu open; close it here so the
          // listbox doesn't float over the next control (useClickOutside dismisses on
          // pointer events, not on focus leaving via Tab).
          context.close()
          break
        }
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault()
          if (isUndefined(context.cursor.highlightedId.value)) {
            const selected = context.selection.selectedIds.values().next().value
            if (!isUndefined(selected)) {
              context.cursor.highlight(selected)
              if (!isUndefined(context.cursor.highlightedId.value)) break
            }
          }
          context.cursor.onKeydown(e)
          break
        }
        case 'Home':
        case 'End': {
          context.cursor.clear()
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
      'aria-disabled': toValue(context.disabled),
      'autocomplete': 'off',
      'data-disabled': toValue(context.disabled) || undefined,
      'disabled': toValue(context.disabled) || undefined,
      'placeholder': placeholder,
      'value': context.display.value,
      'onInput': onInput,
      'onFocus': onFocus,
      'onBlur': onBlur,
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    ref="input"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
