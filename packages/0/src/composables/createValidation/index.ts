/**
 * @module createValidation
 *
 * @remarks
 * Per-field validation lifecycle composable.
 *
 * Key features:
 * - Auto-register with parent form via useForm() injection
 * - Async rule support with generation-based race safety
 * - Silent validation mode
 * - Tri-state isValid (null/true/false)
 * - isPristine tracking
 *
 * Uses useRules() to resolve alias strings via shared context.
 */

// Composables
import { useForm } from '#v0/composables/createForm'
import { createRegistry } from '#v0/composables/createRegistry'
import { useRules } from '#v0/composables/useRules'

// Adapters
import { isStandardSchema, toRule } from '#v0/composables/useRules/adapters/standard'

// Utilities
import { isFunction, isNull, isNullOrUndefined, isString } from '#v0/utilities'
import { computed, onScopeDispose, shallowRef, toValue } from 'vue'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { FormValidationRule, RuleAlias, RuleInput, RulesContext, StandardSchemaV1 } from '#v0/composables/useRules'
import type { ComputedRef, ShallowRef } from 'vue'

export type { FormValidationRule } from '#v0/composables/useRules'

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
}

export interface ValidationOptions extends RegistryOptions {}

/**
 * Resolves raw rule inputs to FormValidationRule[].
 * Uses the provided RulesContext if available, otherwise handles
 * functions and Standard Schema objects directly.
 */
function resolveRules (
  raw: RuleInput[],
  context?: RulesContext,
): FormValidationRule[] {
  if (context) {
    return context.resolve(raw)
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
> (options: ValidationOptions = {}): R {
  const registry = createRegistry<E>(options)
  const rules = useRules()

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
    const resolved = resolveRules(raw, rules)
    const errors = shallowRef<string[]>([])
    const isFieldValidating = shallowRef(false)
    const initialValue = model.value

    const isPristine = shallowRef(true)
    const isFieldValid = shallowRef<boolean | null>(null)

    function reset () {
      model.value = initialValue
      errors.value = []
      isPristine.value = true
      isFieldValid.value = null
      isFieldValidating.value = false
      validationGeneration++
    }

    let validationGeneration = 0

    async function validate (silent = false): Promise<boolean> {
      if (resolved.length === 0) return isFieldValid.value = true

      const generation = ++validationGeneration
      isFieldValidating.value = true
      try {
        const results = await Promise.all(resolved.map(rule => rule(model.value)))
        if (generation !== validationGeneration) return isFieldValid.value ?? false

        const errorMessages = results
          .filter(result => isString(result) || result === false)
          .map(result => result === false ? 'Validation failed' : result as string)

        if (!silent) {
          errors.value = errorMessages
          isFieldValid.value = errorMessages.length === 0
          isPristine.value = model.value === initialValue
        }

        return errorMessages.length === 0
      } finally {
        if (generation === validationGeneration) {
          isFieldValidating.value = false
        }
      }
    }

    const item = {
      ...registration,
      rules: resolved,
      errors,
      disabled: (registration as ValidationTicketInput).disabled || false,
      isValidating: isFieldValidating,
      isPristine,
      isValid: isFieldValid,
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
        isFieldValid.value = null
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
    get size () {
      return registry.size
    },
  } as R

  const form = useForm()
  const ticket = form?.register({ value: context as unknown as ValidationContext })

  onScopeDispose(() => {
    if (!ticket || !form) return
    form.unregister(ticket.id)
  }, true)

  return context
}
