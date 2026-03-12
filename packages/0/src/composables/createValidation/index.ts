/**
 * @module createValidation
 *
 * @remarks
 * Per-field validation lifecycle composable.
 *
 * Key features:
 * - Standalone validation (no form required)
 * - Auto-register with parent form via useForm() injection
 * - Async rule support with generation-based race safety
 * - Silent validation mode
 * - Tri-state isValid (null/true/false)
 * - isPristine tracking
 * - Trinity pattern for DI
 *
 * Uses useRules() to resolve alias strings via shared context.
 */

// Foundational
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { createRegistry } from '#v0/composables/createRegistry'

// Adapters
import { isStandardSchema, toRule } from '#v0/composables/useRules/adapters/standard'

// Utilities
import { instanceExists, isFunction, isNull, isNullOrUndefined, isString } from '#v0/utilities'
import { computed, getCurrentScope, onScopeDispose, shallowRef, toValue } from 'vue'

// Types
import type { FormContext, FormValidationRule } from '#v0/composables/createForm'
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { RuleAlias, RuleInput, RulesContext, StandardSchemaV1 } from '#v0/composables/useRules'
import type { App, ComputedRef, ShallowRef } from 'vue'

export type { FormValidationRule } from '#v0/composables/createForm'

/**
 * Input type for validation tickets - what users provide to register().
 *
 * @template V The type of the field value.
 */
export interface ValidationTicketInput<V = unknown> extends RegistryTicketInput<V> {
  /** Validation rules: functions, alias strings, or Standard Schema objects. */
  rules?: (FormValidationRule | RuleAlias | StandardSchemaV1)[]
  /** Whether this field is disabled. */
  disabled?: boolean
}

/**
 * Output type for validation tickets - the full validation state for a field.
 *
 * @template Z The input ticket type.
 */
export type ValidationTicket<Z extends ValidationTicketInput = ValidationTicketInput> = RegistryTicket & Z & {
  /** Run validation. Pass silent=true to check without updating state. */
  validate: (silent?: boolean) => Promise<boolean>
  /** Reset value, errors, and validation state. */
  reset: () => void
  /** Whether this field is disabled. */
  disabled: boolean
  /** Current validation error messages. */
  errors: ShallowRef<string[]>
  /** Resolved validation rules (FormValidationRule[]). */
  rules: FormValidationRule[]
  /** Whether the field value has not been modified since registration or last reset. */
  isPristine: ShallowRef<boolean>
  /** Tri-state: null (not validated), true (valid), false (invalid). */
  isValid: ShallowRef<boolean | null>
  /** Whether async validation is in progress. */
  isValidating: ShallowRef<boolean>
}

/**
 * Context for managing a collection of validation tickets.
 *
 * @template Z The input ticket type.
 * @template E The output ticket type.
 */
export interface ValidationContext<
  Z extends ValidationTicketInput = ValidationTicketInput,
  E extends ValidationTicket<Z> = ValidationTicket<Z>,
> extends Omit<RegistryContext<E>, 'register' | 'onboard'> {
  register: (registration?: Partial<Z>) => E
  onboard: (registrations: Partial<Z>[]) => E[]
  /** Aggregate: true if all tickets valid, false if any invalid, null if any unvalidated. */
  isValid: ComputedRef<boolean | null>
  /** Aggregate: true if any ticket is validating. */
  isValidating: ComputedRef<boolean>
  /** Optional rules context used for alias resolution. */
  rules?: RulesContext
}

export interface ValidationOptions extends RegistryOptions {
  /** Rules context for alias resolution. Falls back to useRules() if available. */
  rules?: RulesContext
  /** Skip auto-registration with parent form. Defaults to false. */
  standalone?: boolean
}

export interface ValidationContextOptions extends ValidationOptions {
  namespace?: string
}

export interface ValidationPluginOptions extends ValidationContextOptions {}

/**
 * Resolves raw rule inputs to FormValidationRule[].
 * Uses the provided RulesContext if available, otherwise handles
 * functions and Standard Schema objects directly.
 */
function resolveRules (
  raw: RuleInput[],
  rulesContext?: RulesContext,
): FormValidationRule[] {
  if (rulesContext) {
    return rulesContext.resolve(raw)
  }

  return raw
    .filter(r => isFunction(r) || isStandardSchema(r))
    .map(r => isStandardSchema(r) ? toRule(r) : r as FormValidationRule)
}

/**
 * Creates a new validation instance.
 *
 * @param options The options for the validation instance.
 * @returns A new validation context with register(), aggregate state, etc.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-validation
 *
 * @example
 * ```ts
 * import { createValidation } from '@vuetify/v0'
 *
 * const validation = createValidation()
 *
 * const field = validation.register({
 *   id: 'email',
 *   value: '',
 *   rules: [(v) => !!v || 'Required'],
 * })
 *
 * await field.validate()
 *
 * console.log(field.errors.value) // ['Required']
 *
 * field.reset()
 * ```
 */
export function createValidation<
  Z extends ValidationTicketInput = ValidationTicketInput,
  E extends ValidationTicket<Z> = ValidationTicket<Z>,
  R extends ValidationContext<Z, E> = ValidationContext<Z, E>,
> (options?: ValidationOptions): R {
  const registry = createRegistry<E>(options)
  const rulesContext = options?.rules
  const standalone = options?.standalone ?? false

  const isValidating = computed(() => {
    for (const ticket of registry.values()) {
      if (ticket.isValidating.value) return true
    }
    return false
  })

  const isValid = computed(() => {
    let hasNull = false
    let hasFields = false
    for (const ticket of registry.values()) {
      hasFields = true
      if (ticket.isValid.value === false) return false
      if (isNull(ticket.isValid.value)) hasNull = true
    }
    if (!hasFields) return null
    return hasNull ? null : true
  })

  function register (registration: Partial<Z> = {} as Partial<Z>): E {
    const model = shallowRef(isNullOrUndefined(registration.value) ? '' : toValue(registration.value))
    const raw = (registration as ValidationTicketInput).rules || []
    const rules = resolveRules(raw, rulesContext)
    const errors = shallowRef<string[]>([])
    const fieldIsValidating = shallowRef(false)
    const initialValue = model.value

    const isPristine = shallowRef(true)
    const fieldIsValid = shallowRef<boolean | null>(null)

    function reset () {
      model.value = initialValue
      errors.value = []
      isPristine.value = true
      fieldIsValid.value = null
      fieldIsValidating.value = false
      validationGeneration++
    }

    let validationGeneration = 0

    async function validate (silent = false): Promise<boolean> {
      if (rules.length === 0) return fieldIsValid.value = true

      const generation = ++validationGeneration
      fieldIsValidating.value = true
      try {
        const results = await Promise.all(rules.map(rule => rule(model.value)))
        if (generation !== validationGeneration) return fieldIsValid.value ?? false

        const errorMessages = results
          .filter(result => isString(result) || result === false)
          .map(result => result === false ? 'Validation failed' : result as string)

        if (!silent) {
          errors.value = errorMessages
          fieldIsValid.value = errorMessages.length === 0
          isPristine.value = model.value === initialValue
        }

        return errorMessages.length === 0
      } finally {
        if (generation === validationGeneration) {
          fieldIsValidating.value = false
        }
      }
    }

    const item = {
      ...registration,
      rules,
      errors,
      disabled: (registration as ValidationTicketInput).disabled || false,
      isValidating: fieldIsValidating,
      isPristine,
      isValid: fieldIsValid,
      reset,
      validate,
    }

    const ticket = registry.register(item as unknown as Partial<E>) as E

    Object.defineProperty(ticket, 'value', {
      get () {
        return model.value
      },
      set (val) {
        model.value = val
        isPristine.value = val === initialValue
        fieldIsValid.value = null
      },
      enumerable: true,
      configurable: true,
    })

    return ticket
  }

  function onboard (registrations: Partial<Z>[]): E[] {
    return registry.batch(() => registrations.map(r => register(r)))
  }

  const context = {
    ...registry,
    register,
    onboard,
    isValid,
    isValidating,
    rules: rulesContext,
    get size () {
      return registry.size
    },
  } as R

  // Auto-register with parent form (like CheckboxRoot → CheckboxGroup)
  if (!standalone && instanceExists()) {
    try {
      const form = useContext<FormContext>('v0:form')

      if (form) {
        const ticket = form.register(context as unknown as ValidationContext)

        if (getCurrentScope()) {
          onScopeDispose(() => form.unregister(ticket.id))
        }
      }
    } catch {
      // No parent form, standalone mode
    }
  }

  return context
}

/**
 * Creates a new validation context using the Trinity pattern.
 *
 * @param options The options for the validation context.
 * @returns A Trinity tuple: [useValidationContext, provideValidationContext, validationContext]
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-validation
 *
 * @example
 * ```ts
 * import { createValidationContext } from '@vuetify/v0'
 *
 * export const [useFieldValidation, provideFieldValidation, fieldValidation] =
 *   createValidationContext()
 * ```
 */
export function createValidationContext<
  Z extends ValidationTicketInput = ValidationTicketInput,
  E extends ValidationTicket<Z> = ValidationTicket<Z>,
  R extends ValidationContext<Z, E> = ValidationContext<Z, E>,
> (_options: ValidationContextOptions = {}): ContextTrinity<R> {
  const { namespace = 'v0:validation', ...options } = _options
  const [useValidationContext, _provideValidationContext] = createContext<R>(namespace)

  const context = createValidation<Z, E, R>(options)

  function provideValidationContext (_context: R = context, app?: App): R {
    return _provideValidationContext(_context, app)
  }

  return createTrinity<R>(useValidationContext, provideValidationContext, context)
}

/**
 * Creates a Vue plugin that provides a validation context to the entire app.
 *
 * @param options The options for the validation plugin.
 * @returns A Vue plugin.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-validation
 *
 * @example
 * ```ts
 * import { createValidationPlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createValidationPlugin())
 * ```
 */
export function createValidationPlugin (_options: ValidationPluginOptions = {}) {
  const { namespace = 'v0:validation', ...options } = _options
  const [, _provideValidationContext] = createContext<ValidationContext>(namespace)

  return createPlugin({
    namespace,
    provide: (app: App) => {
      const context = createValidation(options)
      _provideValidationContext(context, app)
    },
  })
}

/**
 * Returns the current validation context.
 *
 * @param namespace The namespace for the validation context. Defaults to `'v0:validation'`.
 * @returns The current validation context, or undefined if not provided.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-validation
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useValidation } from '@vuetify/v0'
 *
 *   const validation = useValidation()
 * </script>
 * ```
 */
export function useValidation<
  Z extends ValidationTicketInput = ValidationTicketInput,
  E extends ValidationTicket<Z> = ValidationTicket<Z>,
  R extends ValidationContext<Z, E> = ValidationContext<Z, E>,
> (namespace = 'v0:validation'): R | undefined {
  try {
    return useContext<R>(namespace)
  } catch {
    return undefined
  }
}
