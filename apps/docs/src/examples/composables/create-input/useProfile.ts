import { isString } from '@vuetify/v0'
import { ref, shallowRef } from 'vue'
import type { FormValidationRule } from '@vuetify/v0'

export interface Profile {
  name: string
  email: string
}

export function useProfile () {
  const name = ref('')
  const email = ref('')
  const saved = shallowRef<Profile>()

  const nameRules: FormValidationRule[] = [
    v => (isString(v) && v.length > 0) || 'Name is required',
    v => (isString(v) && v.length >= 2) || 'At least 2 characters',
  ]

  const emailRules: FormValidationRule[] = [
    v => (isString(v) && v.length > 0) || 'Email is required',
    v => (isString(v) && /.+@.+\..+/.test(v)) || 'Must be a valid email',
  ]

  function save () {
    saved.value = { name: name.value, email: email.value }
  }

  function clear () {
    saved.value = undefined
  }

  return { name, email, saved, nameRules, emailRules, save, clear }
}
