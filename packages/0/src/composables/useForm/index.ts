/**
 * @module useForm
 *
 * @remarks
 * Form validation composable with async rule support and multiple validation modes.
 *
 * Key features:
 * - Sync and async validation rules
 * - Multiple validation modes (submit, change, combined)
 * - Tri-state isValid (null/true/false)
 * - isPristine tracking
 * - Silent validation mode
 * - Form-level validation and reset
 *
 * Each field is registered with validation rules and tracks its own state independently.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { isString } from '#v0/utilities'
import { computed, shallowRef, toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ID } from '#v0/types'
import type { App, ComputedRef, Ref, ShallowRef } from 'vue'

export type FormValidationResult = string | true | Promise<string | true>

export type FormValidationRule = (value: unknown) => FormValidationResult

export type FormValue = Ref<unknown> | ShallowRef<unknown>

export interface FormTicket<V = unknown> extends RegistryTicket<V> {
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
  namespace?: string
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
    return hasFields ? true : null
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
    const model = shallowRef(registration.value == null ? '' : toValue(registration.value))
    const rules = registration.rules || []
    const errors = shallowRef<string[]>([])
    const isValidating = shallowRef(false)
    const initialValue = model.value
    const triggers = registration.validateOn || validateOn

    const isPristine = shallowRef(true)
    const isValid = shallowRef<boolean | null>(null)

    function _validatesOn (event: 'submit' | 'change'): boolean {
      return parse(triggers).includes(event)
    }

    function _reset () {
      model.value = initialValue
      errors.value = []
      isPristine.value = true
      isValid.value = null
    }

    async function validate (silent = false): Promise<boolean> {
      if (rules.length === 0) return isValid.value = true

      isValidating.value = true
      try {
        const results = await Promise.all(rules.map(rule => rule(model.value)))
        const errorMessages = results.filter(result => isString(result)) as string[]

        if (!silent) {
          errors.value = errorMessages
          isValid.value = errorMessages.length === 0
          isPristine.value = toValue(model) === initialValue
        }

        return errorMessages.length === 0
      } finally {
        isValidating.value = false
      }
    }

    const item: Partial<Z> = {
      ...registration,
      rules,
      errors,
      disabled: registration.disabled || false,
      validateOn: triggers,
      isValidating,
      isPristine,
      isValid,
      reset: _reset,
      validate,
    }

    const ticket = registry.register(item)

    Object.defineProperty(ticket, 'value', {
      get () {
        return model.value
      },
      set (val) {
        model.value = val
        isPristine.value = val === initialValue
        isValid.value = null

        if (_validatesOn('change')) validate()
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
 * // With default namespace 'v0:form'
 * export const [useMyForm, provideMyForm, myForm] = createFormContext({ validateOn: 'change' })
 *
 * // Or with custom namespace
 * export const [useMyForm, provideMyForm, myForm] = createFormContext({
 *   namespace: 'my-form',
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
> (_options: FormContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:form', ...options } = _options
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
