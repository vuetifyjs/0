/**
 * Shared validateOn machinery for the native-wrapping form components
 * (BuCheckbox, BuRadio, BuSelect, BuFile).
 */

// Framework
import { parseValidateOn } from '@vuetify/v0'

// Types
import type { ValidateEvent, ValidateOn } from '@vuetify/v0'
import type { Ref } from 'vue'

/** The subset of a `createInput` return the validateOn gate needs. */
export interface ValidateHost {
  isFocused: Ref<boolean>
  isTouched: Ref<boolean>
  isValid: { readonly value: boolean | null }
  validate: () => unknown
}

export interface ValidateHandlers {
  /** Whether validation should run for the given trigger. */
  should: (trigger: ValidateEvent) => boolean
  /** Native focus handler — mirrors focus into the input context. */
  onFocus: () => void
  /** Native blur handler — marks touched and validates when configured. */
  onBlur: () => void
}

/** Factory wiring the canonical validateOn gate + focus handlers to an input. */
export function createValidateOn (input: ValidateHost, validateOn: () => ValidateOn): ValidateHandlers {
  function should (trigger: ValidateEvent): boolean {
    const { event, modifier } = parseValidateOn(validateOn())
    if (event === 'submit') return false
    if (modifier === 'lazy' && !input.isTouched.value) return false
    if (modifier === 'eager') {
      if (input.isValid.value === false) return true
      if (trigger === 'input') return false
      return trigger === event
    }
    return trigger === event
  }

  function onFocus () {
    input.isFocused.value = true
  }

  function onBlur () {
    input.isFocused.value = false
    input.isTouched.value = true
    if (should('blur')) input.validate()
  }

  return { should, onFocus, onBlur }
}
