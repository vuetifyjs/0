/**
 * @module useForm
 *
 * @remarks
 * Form orchestration composable for managing multiple validated fields.
 *
 * Key features:
 * - Manages multiple validation fields via useRegistry
 * - Form-level validation and reset
 * - Aggregate validation state
 * - Per-field or form-level validation modes
 *
 * Builds on useValidation for individual field logic.
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useValidation } from '#v0/composables/useValidation'

// Utilities
import { computed } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ValidationRule } from '#v0/composables/useValidation'
import type { ComputedRef, Ref, ShallowRef, App } from 'vue'
import type { ID } from '#v0/types'

export type FormValidationResult = string | true | Promise<string | true>

export type FormValidationRule = ValidationRule

export type FormValue = Ref<any> | ShallowRef<any>

export interface FormTicket extends RegistryTicket {
  validate: (silent?: boolean) => Promise<boolean>
  reset: () => void
  validateOn: 'submit' | 'change' | string
  disabled: boolean
  errors: ShallowRef<string[]>
  rules: FormValidationRule[]
  isPristine: ShallowRef<boolean>
  isValid: ShallowRef<boolean | null>
  isValidating: ShallowRef<boolean>
}

export interface FormContext<Z extends FormTicket = FormTicket> extends RegistryContext<Z> {
  submit: (id?: ID | ID[]) => Promise<boolean>
  reset: () => void
  validateOn: 'submit' | 'change' | string
  isValid: ComputedRef<boolean | null>
  isValidating: ComputedRef<boolean>
}

export interface FormOptions extends RegistryOptions {
  validateOn?: 'submit' | 'change' | string
}

export interface FormContextOptions extends RegistryOptions {
  namespace: string
  validateOn?: 'submit' | 'change' | string
}

/**
 * Creates a new form instance.
 *
 * @param options The options for the form instance.
 * @template Z The type of the form ticket.
 * @template E The type of the form context.
 * @returns A new form instance.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-form
 *
 * @example
 * ```ts
 * import { createForm } from '@vuetify/v0'
 *
 * const form = createForm()
 *
 * const username = form.register({
 *   id: 'username',
 *   value: '',
 *   rules: [(v) => v.length > 0 || 'Username is required'],
 * })
 *
 * await form.submit()
 *
 * console.log(username.errors.value) // ['Username is required']
 *
 * form.reset()
 * ```
 */
export function createForm<
  Z extends FormTicket = FormTicket,
  E extends FormContext<Z> = FormContext<Z>,
> (options?: FormOptions): E {
  const registry = useRegistry<Z, E>(options)
  const validateOn = options?.validateOn || 'submit'

  function parse (value: string): string[] {
    return value.toLowerCase().split(/\s+/)
  }

  function validatesOn (event: 'submit' | 'change'): boolean {
    return parse(validateOn).includes(event)
  }

  const isValidating = computed(() => {
    for (const ticket of registry.collection.values()) {
      if (ticket.isValidating.value) return true
    }
    return false
  })

  const isValid = computed(() => {
    let hasFields = false
    for (const ticket of registry.values()) {
      hasFields = true
      if (ticket.isValid.value === false) return false
      if (ticket.isValid.value === null) return null
    }
    return hasFields || null
  })

  function reset () {
    for (const ticket of registry.values()) {
      ticket.reset()
    }
  }

  async function submit (): Promise<boolean> {
    return validate(registry.keys())
  }

  async function validate (id: ID | ID[]): Promise<boolean> {
    const validating = toArray(id)

    if (validatesOn('submit')) {
      const results = await Promise.all(
        validating.map(async id => await registry.get(id)?.validate() ?? true),
      )
      return results.every(Boolean)
    }

    const tickets = validating.map(id => registry.get(id)).filter(Boolean) as Z[]
    return tickets.every(ticket => ticket.isValid.value === true)
  }

  function register (registration: Partial<Z>): Z {
    // Use useValidation for the field validation logic
    const validation = useValidation({
      value: registration.value,
      rules: registration.rules,
      validateOn: registration.validateOn || validateOn,
      disabled: registration.disabled,
    })

    const item: Partial<Z> = {
      ...registration,
      rules: validation.rules,
      errors: validation.errors,
      disabled: validation.disabled,
      validateOn: validation.validateOn,
      isValidating: validation.isValidating,
      isPristine: validation.isPristine,
      isValid: validation.isValid,
      reset: validation.reset,
      validate: validation.validate,
    }

    const ticket = registry.register(item) as Z

    // Copy the value getter/setter from validation to the ticket
    Object.defineProperty(ticket, 'value', {
      get () {
        return validation.value
      },
      set (val) {
        validation.value = val
      },
      enumerable: true,
      configurable: true,
    })

    return ticket
  }

  return {
    ...registry,
    register,
    reset,
    submit,
    validateOn,
    isValid,
    isValidating,
    get size () {
      return registry.size
    },
  } as E
}

/**
 * Creates a new form context.
 *
 * @param namespace The namespace for the form context.
 * @param options The options for the form context.
 * @template Z The type of the form ticket.
 * @template E The type of the form context.
 * @returns A new form context.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-form
 *
 * @example
 * ```ts
 * import { createFormContext } from '@vuetify/v0'
 *
 * export const [useMyForm, provideMyForm, myForm] = createFormContext('my-form', {
 *   validateOn: 'change',
 * })
 *
 * // In a parent component:
 * provideMyForm()
 *
 * // In a child component:
 * const form = useMyForm()
 * form.register({ id: 'field', value: ref(''), rules: [...] })
 * ```
 */
export function createFormContext<
  Z extends FormTicket = FormTicket,
  E extends FormContext<Z> = FormContext<Z>,
> (
  _options: FormContextOptions,
): ContextTrinity<E> {
  const { namespace, ...options } = _options
  const [useFormContext, _provideFormContext] = createContext<E>(namespace)

  const context = createForm<Z, E>(options)

  function provideFormContext (_context: E = context, app?: App): E {
    return _provideFormContext(_context, app)
  }

  return createTrinity<E>(useFormContext, provideFormContext, context)
}

/**
 * Returns the current form instance.
 *
 * @param namespace The namespace for the form context. Defaults to `'v0:form'`.
 * @returns The current form instance.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-form
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useForm } from '@vuetify/v0'
 *
 *   const form = useForm()
 * </script>
 *
 * <template>
 *   <div>
 *     <p>Form is {{ form.isValid.value ? 'valid' : 'invalid' }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useForm<
  Z extends FormTicket = FormTicket,
  E extends FormContext<Z> = FormContext<Z>,
> (namespace = 'v0:form'): E {
  return useContext<E>(namespace)
}
