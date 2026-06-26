/**
 * @module createFormSchema
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-form-schema
 *
 * @remarks
 * Schema-driven form generation built on top of `createForm` and
 * `createValidation`. Accepts a typed field-definition object and returns
 * reactive value refs, per-field bindings ready to spread onto any input
 * component, and form-level submit / reset helpers.
 *
 * The schema is intentionally UI-agnostic — consumers decide how each field
 * is rendered. This makes it usable with any component library, plain `<input>`
 * elements, or renderless headless primitives.
 *
 * @example
 * ```ts
 * import { createFormSchema } from '@vuetify/v0'
 *
 * const schema = createFormSchema({
 *   username: {
 *     default: '',
 *     rules: ['required', v => String(v).length >= 3 || 'Min 3 characters'],
 *   },
 *   email: {
 *     default: '',
 *     rules: ['required', 'email'],
 *   },
 * })
 *
 * // Spread onto any input component:
 * // <TextField v-bind="schema.fields.username" />
 *
 * // Submit and get a boolean result:
 * const ok = await schema.submit()
 * if (ok) console.log(schema.values.username.value)
 *
 * // Reset all fields:
 * schema.reset()
 * ```
 */

// Composables
import { createForm } from '#v0/composables/createForm'
import { createValidation } from '#v0/composables/createValidation'

// Utilities
import { shallowRef } from 'vue'

// Types
import type { FormContext } from '#v0/composables/createForm'
import type { RuleInput } from '#v0/composables/useRules'
import type { ComputedRef, ShallowRef } from 'vue'

// Exports
export type { FormContext }

/**
 * Definition for a single field in a schema.
 *
 * @template T The value type of the field.
 */
export interface FieldDefinition<T = unknown> {
  /** Initial/default value. Defaults to `null`. */
  default?: T
  /** Validation rules. Accepts aliases ('required'), functions, or standard schemas (Zod, Valibot). */
  rules?: RuleInput[]
}

/**
 * Map of field definitions keyed by field name.
 */
export interface FormSchemaDefinition {
  [key: string]: FieldDefinition
}

/**
 * Reactive bindings for a single field, ready to spread onto an input component.
 *
 * @template T The value type of the field.
 */
export interface FieldBindings<T = unknown> {
  /** Current field value — use as `:model-value`. */
  modelValue: T
  /** Value setter — use as `@update:model-value`. */
  'onUpdate:modelValue': (value: T) => void
  /** Validation error messages. Empty when valid or not yet validated. */
  errorMessages: ShallowRef<string[]>
}

/**
 * The object returned by `createFormSchema`.
 *
 * @template S The schema definition type.
 */
export interface FormSchema<S extends FormSchemaDefinition> {
  /** The underlying `FormContext` for advanced control. */
  form: FormContext
  /**
   * Reactive field value refs keyed by field name.
   * Mutate `.value` to change the field value programmatically.
   */
  values: { [K in keyof S]: ShallowRef<S[K] extends FieldDefinition<infer T> ? T : unknown> }
  /**
   * Per-field bindings ready to spread onto input components.
   *
   * @example `<TextField v-bind="schema.fields.email" />`
   */
  fields: { [K in keyof S]: FieldBindings<S[K] extends FieldDefinition<infer T> ? T : unknown> }
  /** Tri-state aggregate validity: `null` (not validated), `true`, or `false`. */
  isValid: ComputedRef<boolean | null>
  /** Whether any field is currently running async validation. */
  isValidating: ComputedRef<boolean>
  /**
   * Trigger validation on all fields.
   * @returns `true` if every field is valid.
   */
  submit: () => Promise<boolean>
  /** Reset all fields to their initial values and clear all error states. */
  reset: () => void
}

/**
 * Creates a schema-driven form with typed reactive field bindings.
 *
 * @param schema Field definitions keyed by name.
 * @returns A `FormSchema` object with reactive values, per-field bindings,
 *   and form-level submit / reset / validity state.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-form-schema
 *
 * @example
 * ```ts
 * const schema = createFormSchema({
 *   name: { default: '', rules: ['required'] },
 *   age:  { default: null, rules: ['required', v => Number(v) >= 18 || 'Must be 18+'] },
 * })
 *
 * const isValid = await schema.submit()
 * ```
 */
export function createFormSchema<S extends FormSchemaDefinition> (schema: S): FormSchema<S> {
  const form = createForm()

  type Values = { [K in keyof S]: ShallowRef<S[K] extends FieldDefinition<infer T> ? T : unknown> }
  type Fields = { [K in keyof S]: FieldBindings<S[K] extends FieldDefinition<infer T> ? T : unknown> }

  const values = {} as Values
  const fields = {} as Fields
  const defaults: Record<string, unknown> = {}

  for (const key in schema) {
    const def = schema[key]
    const initial = def.default ?? null
    defaults[key] = initial

    const ref = shallowRef(initial) as ShallowRef<unknown>
    ;(values as Record<string, ShallowRef<unknown>>)[key] = ref

    const validation = createValidation({
      value: ref,
      rules: def.rules ?? [],
    })

    form.register({ id: key, value: validation })

    ;(fields as Record<string, FieldBindings>)[key] = {
      get modelValue () { return ref.value },
      'onUpdate:modelValue': (v: unknown) => { ref.value = v },
      errorMessages: validation.errors,
    }
  }

  function reset (): void {
    for (const key in schema) {
      ;(values as Record<string, ShallowRef<unknown>>)[key].value = defaults[key]
    }
    form.reset()
  }

  return {
    form,
    values,
    fields,
    isValid: form.isValid,
    isValidating: form.isValidating,
    submit: form.submit,
    reset,
  }
}
