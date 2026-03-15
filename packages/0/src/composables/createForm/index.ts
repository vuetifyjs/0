/**
 * @module createForm
 *
 * @remarks
 * Form composable that coordinates validation across multiple fields.
 *
 * Key features:
 * - Pure registry of ValidationContext instances
 * - Validations auto-register via useForm() injection
 * - Form-level submit, reset, and aggregate state
 * - Exposes disabled/readonly refs for component consumption
 * - Trinity pattern for DI
 *
 * Per-field validation logic lives in createValidation.
 * createForm is the mothership — it coordinates, not creates.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Utilities
import { isNull, isNullOrUndefined } from '#v0/utilities'
import { computed, shallowRef, toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ValidationContext } from '#v0/composables/createValidation'
import type { ID } from '#v0/types'
import type { App, ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'

export type FormValidationResult = string | boolean | Promise<string | boolean>

export type FormValidationRule = (value: unknown) => FormValidationResult

export type FormValue = ValidationContext

/**
 * User-facing input shape for form tickets.
 */
export interface FormTicketInput extends RegistryTicketInput<FormValue> {}

/**
 * A registered validation in the form registry.
 *
 * @template Z The input ticket type that extends FormTicketInput.
 */
export type FormTicket<Z extends FormTicketInput = FormTicketInput> = RegistryTicket<FormValue> & Z

/**
 * Context for coordinating validation across multiple fields.
 *
 * @template Z The input ticket type.
 * @template E The output ticket type.
 */
export interface FormContext<
  Z extends FormTicketInput = FormTicketInput,
  E extends FormTicket<Z> = FormTicket<Z>,
> extends Omit<RegistryContext<E>, 'register' | 'onboard'> {
  /** Register a validation context with the form. */
  register: (registration: Partial<Z> & { value: FormValue }) => E
  /** Submit: validate specific fields or all. */
  submit: (id?: ID | ID[]) => Promise<boolean>
  /** Reset all registered validations. */
  reset: () => void
  /** Whether the form is disabled. Components can read this to conditionally disable inputs. */
  disabled: ShallowRef<boolean>
  /** Whether the form is readonly. Components can read this to conditionally disable inputs. */
  readonly: ShallowRef<boolean>
  /** Aggregate: true if all validations valid, false if any invalid, null if any unvalidated. */
  isValid: ComputedRef<boolean | null>
  /** Aggregate: true if any validation is in progress. */
  isValidating: ComputedRef<boolean>
}

export interface FormOptions extends RegistryOptions {
  /** Whether the form starts disabled. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Whether the form starts readonly. */
  readonly?: MaybeRefOrGetter<boolean>
}

export interface FormContextOptions extends FormOptions {
  namespace?: string
}

/**
 * Creates a new form instance.
 *
 * A form is a pure registry of validation contexts. Validations register
 * themselves via `useForm()` injection. The form coordinates submit, reset,
 * and aggregate state across all registered validations.
 *
 * @param options The options for the form instance.
 * @returns A new form context.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-form
 *
 * @example
 * ```ts
 * import { createForm, createValidation } from '@vuetify/v0'
 *
 * const form = createForm()
 *
 * // Validations register themselves — form is just the coordinator
 * const validation = createValidation()
 * const email = validation.register({
 *   id: 'email',
 *   value: '',
 *   rules: ['required', 'email'],
 * })
 *
 * form.register({ value: validation })
 *
 * await form.submit()
 * form.reset()
 * ```
 */
export function createForm<
  Z extends FormTicketInput = FormTicketInput,
  E extends FormTicket<Z> = FormTicket<Z>,
  R extends FormContext<Z, E> = FormContext<Z, E>,
> (options?: FormOptions): R {
  const registry = createRegistry<E>(options)
  const disabled = shallowRef(false)
  const readonly = shallowRef(false)

  if (!isNullOrUndefined(options?.disabled)) disabled.value = toValue(options.disabled) ?? false
  if (!isNullOrUndefined(options?.readonly)) readonly.value = toValue(options.readonly) ?? false

  const isValidating = computed(() => {
    for (const ticket of registry.values()) {
      if (ticket.value.isValidating.value) return true
    }
    return false
  })

  const isValid = computed(() => {
    let hasNull = false
    let hasFields = false
    for (const ticket of registry.values()) {
      hasFields = true
      if (ticket.value.isValid.value === false) return false
      if (isNull(ticket.value.isValid.value)) hasNull = true
    }
    if (!hasFields) return null
    return hasNull ? null : true
  })

  function register (registration: Partial<Z> & { value: FormValue }): E {
    return registry.register(registration as Partial<E>)
  }

  function reset () {
    for (const ticket of registry.values()) {
      for (const field of ticket.value.values()) {
        field.reset()
      }
    }
  }

  async function submit (id?: ID | ID[]): Promise<boolean> {
    const ids = id ? toArray(id) : [...registry.keys()]
    const results = await Promise.all(
      ids.map(async id => {
        const ticket = registry.get(id)
        if (!ticket) return true

        // Submit validates all fields within each validation context
        const validated = await Promise.all(
          [...ticket.value.values()].map(field => field.validate()),
        )
        return validated.every(Boolean)
      }),
    )
    return results.every(Boolean)
  }

  return {
    ...registry,
    register,
    submit,
    reset,
    disabled,
    readonly,
    isValid,
    isValidating,
    get size () {
      return registry.size
    },
  } as unknown as R
}

/**
 * Creates a new form context using the Trinity pattern.
 *
 * @param options The options for the form context.
 * @returns A Trinity tuple: [useFormContext, provideFormContext, formContext]
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-form
 *
 * @example
 * ```ts
 * import { createFormContext } from '@vuetify/v0'
 *
 * export const [useMyForm, provideMyForm, myForm] = createFormContext()
 * ```
 */
export function createFormContext<
  Z extends FormTicketInput = FormTicketInput,
  E extends FormTicket<Z> = FormTicket<Z>,
  R extends FormContext<Z, E> = FormContext<Z, E>,
> (_options: FormContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:form', ...options } = _options
  const [useFormContext, _provideFormContext] = createContext<R>(namespace)

  const context = createForm<Z, E, R>(options)

  function provideFormContext (_context: R = context, app?: App): R {
    return _provideFormContext(_context, app)
  }

  return createTrinity<R>(useFormContext, provideFormContext, context)
}

/**
 * Returns the current form instance.
 *
 * @param namespace The namespace for the form context. Defaults to `'v0:form'`.
 * @returns The current form instance, or undefined if not provided.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-form
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useForm } from '@vuetify/v0'
 *
 *   const form = useForm()
 * </script>
 * ```
 */
export function useForm<
  Z extends FormTicketInput = FormTicketInput,
  E extends FormTicket<Z> = FormTicket<Z>,
  R extends FormContext<Z, E> = FormContext<Z, E>,
> (namespace = 'v0:form'): R | undefined {
  try {
    return useContext<R>(namespace)
  } catch {
    return undefined
  }
}
