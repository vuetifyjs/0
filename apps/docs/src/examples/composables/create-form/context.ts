import { createContext, createForm } from '@vuetify/v0'
import type { FormContext, FormValidationRule } from '@vuetify/v0'

export interface FieldConfig {
  key: string
  label: string
  type: string
  autocomplete: string
  placeholder: string
  multiline?: boolean
  rules: FormValidationRule[]
}

export const [useContactForm, provideContactForm] = createContext<FormContext>('app:contact-form')

export function createContactForm () {
  return createForm()
}
