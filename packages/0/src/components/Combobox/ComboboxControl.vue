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
  import { useComboboxRoot } from './ComboboxRoot.vue'

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

  const root = useComboboxRoot(namespace)

  const atomRef = useTemplateRef<AtomExpose>('input')
  watch(() => toElement(atomRef.value?.element) ?? null, el => {
    root.inputEl.value = el instanceof HTMLElement ? el : null
  }, { immediate: true })
  onBeforeUnmount(() => {
    root.inputEl.value = null
  })

  function onInput (e: Event) {
    root.pristine.value = false
    root.query.value = (e.target as HTMLInputElement).value
    if (openOn === 'input') root.open()
  }

  function onFocus () {
    if (openOn === 'focus') root.open()
  }

  function onBlur (e: FocusEvent) {
    const next = e.relatedTarget
    if (isElement(next)) {
      const activator = root.inputEl.value?.closest('[data-state]')
      if (root.listEl.value?.contains(next) || activator?.contains(next)) return
    }
    root.commit()
    root.close()
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

    if (root.isOpen.value) {
      switch (e.key) {
        case 'Enter': {
          e.preventDefault()
          const highlighted = root.cursor.highlightedId.value
          if (isUndefined(highlighted)) {
            root.commit()
          } else {
            root.select(highlighted)
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          root.close()
          break
        }
        case 'Tab': {
          const highlighted = root.cursor.highlightedId.value
          if (isUndefined(highlighted)) {
            root.commit()
          } else if (!root.selection.selected(highlighted)) {
            root.select(highlighted)
          }
          // Multiple-select commit/select keeps the menu open; close it here so the
          // listbox doesn't float over the next control (useClickOutside dismisses on
          // pointer events, not on focus leaving via Tab).
          root.close()
          break
        }
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault()
          if (isUndefined(root.cursor.highlightedId.value)) {
            const selected = root.selection.selectedIds.values().next().value
            if (!isUndefined(selected)) {
              root.cursor.highlight(selected)
              if (!isUndefined(root.cursor.highlightedId.value)) break
            }
          }
          root.cursor.onKeydown(e)
          break
        }
        case 'Home':
        case 'End': {
          root.cursor.clear()
          break
        }
      }
    } else {
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          e.preventDefault()
          root.open()
          break
        }
      }
    }
  }

  const strict = toRef(() => toValue(root.strict))
  const invalid = toRef(() => root.isValid.value === false)

  const slotProps = toRef((): ComboboxControlSlotProps => ({
    query: root.query.value,
    isOpen: root.isOpen.value,
    attrs: {
      'id': root.inputId,
      'role': 'combobox',
      'aria-autocomplete': strict.value ? 'both' : 'list',
      'aria-expanded': root.isOpen.value,
      'aria-haspopup': 'listbox',
      'aria-controls': root.listboxId,
      'aria-describedby': root.hasDescription.value ? root.descriptionId : undefined,
      'aria-errormessage': (root.hasError.value && root.errors.value.length > 0) ? root.errorId : undefined,
      'aria-invalid': invalid.value || undefined,
      'aria-disabled': toValue(root.disabled),
      'autocomplete': 'off',
      'data-disabled': toValue(root.disabled) || undefined,
      'disabled': toValue(root.disabled) || undefined,
      'placeholder': placeholder,
      'value': root.display.value,
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
