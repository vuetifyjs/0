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
 * - Trinity pattern: createFormContext returns [useForm, provideForm, form]
 *
 * Children use the useForm function from the trinity to register fields.
 */

// Factories
import { createContext } from '#v0/composables/createContext'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { computed, inject, onUnmounted, shallowRef, toValue } from 'vue'
import { isString } from '#v0/utilities'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ComputedRef, InjectionKey, Ref, ShallowRef, App } from 'vue'
import type { ID } from '#v0/types'

/**
 * Return type for createFormContext.
 * Different from ContextTrinity because useForm returns field ticket, not form context.
 */
export type FormContextTrinity<Z extends FormTicket, E extends FormContext<Z>> = readonly [
  (fieldOptions?: FormFieldOptions) => Z,
  (form?: E, app?: App) => E,
  E
]

export type FormValidationResult = string | true | Promise<string | true>

export type FormValidationRule = (value: any) => FormValidationResult

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

export interface FormContext<Z extends FormTicket = FormTicket> extends Omit<RegistryContext<Z>, 'register'> {
  register: (options: FormFieldOptions) => Z
  submit: (id?: ID | ID[]) => Promise<boolean>
  reset: () => void
  validateOn: 'submit' | 'change' | string
  isValid: ComputedRef<boolean | null>
  isValidating: ComputedRef<boolean>
}

export interface FormOptions extends RegistryOptions {
  validateOn?: 'submit' | 'change' | string
}

export interface FormContextOptions extends FormOptions {
  namespace?: string
}

export interface FormFieldOptions {
  id?: ID
  value?: any
  rules?: FormValidationRule[]
  validateOn?: 'submit' | 'change' | string
  disabled?: boolean
}

/**
 * Injection key for form registration context.
 */
export const FORM_CONTEXT_KEY: InjectionKey<FormContext> = Symbol('v0:form-context')

// Generate unique IDs for form tickets
let formFieldId = 0
function generateId (): ID {
  return `form-field-${++formFieldId}`
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
  const registry = useRegistry<Z>(options)
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

  function register (registration: FormFieldOptions): Z {
    const id = registration.id ?? generateId()
    const model = shallowRef(registration.value == null ? '' : toValue(registration.value))
    const rules = registration.rules || []
    const errors = shallowRef<string[]>([])
    const fieldIsValidating = shallowRef(false)
    const initialValue = model.value
    const fieldValidateOn = registration.validateOn || validateOn
    const disabled = registration.disabled || false

    const isPristine = shallowRef(true)
    const fieldIsValid = shallowRef<boolean | null>(null)

    function fieldValidatesOn (event: 'submit' | 'change'): boolean {
      return parse(fieldValidateOn).includes(event)
    }

    function fieldReset () {
      model.value = initialValue
      errors.value = []
      isPristine.value = true
      fieldIsValid.value = null
    }

    async function fieldValidate (silent = false): Promise<boolean> {
      if (rules.length === 0) {
        fieldIsValid.value = true
        return true
      }

      fieldIsValidating.value = true
      try {
        const results = await Promise.all(rules.map(rule => rule(model.value)))
        const errorMessages = results.filter(result => isString(result)) as string[]

        if (!silent) {
          errors.value = errorMessages
          fieldIsValid.value = errorMessages.length === 0
          isPristine.value = model.value === initialValue
        }

        return errorMessages.length === 0
      } finally {
        fieldIsValidating.value = false
      }
    }

    const item = {
      id,
      rules,
      errors,
      disabled,
      validateOn: fieldValidateOn,
      isValidating: fieldIsValidating,
      isPristine,
      isValid: fieldIsValid,
      reset: fieldReset,
      validate: fieldValidate,
    } as Partial<Z>

    const ticket = registry.register(item) as Z

    // Add value getter/setter to the ticket
    Object.defineProperty(ticket, 'value', {
      get () {
        return model.value
      },
      set (val) {
        model.value = val
        isPristine.value = val === initialValue
        fieldIsValid.value = null

        if (fieldValidatesOn('change')) {
          fieldValidate()
        }
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
 * Creates a form context with trinity pattern.
 *
 * @param options The options for the form context including namespace.
 * @template Z The type of the form ticket.
 * @template E The type of the form context.
 * @returns A trinity: [useForm, provideForm, form]
 *
 * @remarks
 * Returns a trinity where:
 * - `useForm(options)` - Called by children to inject context and register a field
 * - `provideForm()` - Called by parent to provide the form context
 * - `form` - The default form instance
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-form
 *
 * @example
 * ```ts
 * import { createFormContext } from '@vuetify/v0'
 *
 * // Create form context
 * export const [useMyForm, provideMyForm, myForm] = createFormContext({
 *   namespace: 'my-form',
 *   validateOn: 'change',
 * })
 *
 * // Parent component
 * provideMyForm()
 *
 * // Child component - useForm injects and registers
 * const field = useMyForm({
 *   id: 'email',
 *   value: ref(''),
 *   rules: [v => /@/.test(v) || 'Invalid email']
 * })
 *
 * // Access field state
 * field.errors.value
 * field.isValid.value
 * ```
 */
export function createFormContext<
  Z extends FormTicket = FormTicket,
  E extends FormContext<Z> = FormContext<Z>,
> (
  options?: FormContextOptions,
): FormContextTrinity<Z, E> {
  const namespace = options?.namespace || 'v0:form'
  const [_useFormContext, _provideFormContext] = createContext<E>(namespace)

  const form = createForm<Z, E>(options)

  /**
   * Provide the form context to children.
   */
  function provideForm (_form: E = form, app?: App): E {
    return _provideFormContext(_form, app)
  }

  /**
   * Inject form context and register a field.
   * Called by child components to register with the parent form.
   */
  function useForm (fieldOptions?: FormFieldOptions): Z {
    const formContext = inject<E>(namespace, form)

    const ticket = formContext.register(fieldOptions || {})

    // Unregister on component unmount
    onUnmounted(() => {
      formContext.unregister(ticket.id)
    })

    return ticket
  }

  return [useForm, provideForm, form] as const
}

// Default form context
const [_useForm, _provideForm, _defaultForm] = createFormContext<FormTicket, FormContext>({
  namespace: 'v0:form',
})

/**
 * Use the default form context and register a field.
 *
 * @param options Field options for registration.
 * @returns The registered form ticket.
 *
 * @see https://0.vuetifyjs.com/composables/forms/use-form
 *
 * @example
 * ```ts
 * // Parent component
 * import { provideForm } from '@vuetify/v0'
 * provideForm()
 *
 * // Child component
 * import { useForm } from '@vuetify/v0'
 * const field = useForm({
 *   value: '',
 *   rules: [v => v.length > 0 || 'Required']
 * })
 * ```
 */
export const useForm = _useForm

/**
 * Provide the default form context.
 */
export const provideForm = _provideForm

/**
 * The default form instance.
 */
export const defaultForm = _defaultForm
