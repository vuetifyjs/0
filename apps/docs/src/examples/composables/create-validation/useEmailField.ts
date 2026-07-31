import { createValidation } from '@vuetify/v0'
import { shallowRef, toRef, watch } from 'vue'

// Emails the mock "server" treats as already registered.
const registered = new Set([
  'taken@example.com',
  'admin@example.com',
  'jane@example.com',
])

export type FieldStatus = 'idle' | 'checking' | 'valid' | 'invalid'

export function useEmailField () {
  const email = shallowRef('')
  const touched = shallowRef(false)

  const validation = createValidation({
    value: email,
    rules: [
      (v: unknown) => !!v || 'Email is required',
      (v: unknown) => /^.+@\S+\.\S+$/.test(String(v)) || 'Enter a valid email address',
      async (v: unknown) => {
        if (!v || !/^.+@\S+\.\S+$/.test(String(v))) return true
        await new Promise(resolve => setTimeout(resolve, 700))
        return !registered.has(String(v).toLowerCase()) || 'This email is already registered'
      },
    ],
  })

  const status = toRef((): FieldStatus => {
    if (validation.isValidating.value) return 'checking'
    if (validation.isValid.value === true) return 'valid'
    if (validation.isValid.value === false) return 'invalid'
    return 'idle'
  })

  // Validate after the field loses focus — the async availability rule guards
  // itself on sync validity, so the network call only runs for well-formed input.
  async function onBlur () {
    touched.value = true
    await validation.validate()
  }

  // Clear stale results once the user edits a field they have already validated.
  watch(email, () => {
    if (touched.value) validation.reset()
  })

  function reset () {
    email.value = ''
    touched.value = false
    validation.reset()
  }

  return {
    email,
    touched,
    status,
    errors: validation.errors,
    isValid: validation.isValid,
    isValidating: validation.isValidating,
    onBlur,
    reset,
  }
}
