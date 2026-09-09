/**
 * Shared validateOn machinery for the native-wrapping form components
 * (BuCheckbox, BuRadio, BuSelect, BuFile).
 *
 * v0's `parseValidateOn` lives inside `InputRoot.vue` and is not exported from
 * the Input barrel, so the pattern is reproduced here once for the whole
 * package instead of per component. v0-core follow-up: export
 * `parseValidateOn` from the Input barrel so this file can shrink to the
 * `createValidateOn` factory.
 */

// Types
import type { ValidateEvent, ValidateOn } from '@vuetify/v0'
import type { Ref } from 'vue'

export interface ValidateParsed {
  event: ValidateEvent
  modifier?: 'lazy' | 'eager'
}

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

/** Parse a `validateOn` expression into its event and modifier parts. */
function parse (value: ValidateOn): ValidateParsed {
  const parts = String(value).split(' ')
  let event: ValidateEvent = 'blur'
  let modifier: 'lazy' | 'eager' | undefined

  for (const part of parts) {
    if (part === 'lazy' || part === 'eager') modifier = part
    else if (part === 'blur' || part === 'input' || part === 'submit') event = part
  }

  return { event, modifier }
}

/** Factory wiring the canonical validateOn gate + focus handlers to an input. */
export function createValidateOn (input: ValidateHost, validateOn: () => ValidateOn): ValidateHandlers {
  function should (trigger: ValidateEvent): boolean {
    const { event, modifier } = parse(validateOn())
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
