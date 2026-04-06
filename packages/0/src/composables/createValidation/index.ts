/**
 * @module createValidation
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-validation
 *
 * @remarks
 * Per-input validation composable built on createGroup.
 *
 * Key features:
 * - Each ticket is a rule — enable/disable via select/unselect
 * - Auto-register with parent form via useForm() injection
 * - Async rule support with generation-based race safety
 * - Standard Schema support (Zod, Valibot, ArkType, etc.)
 * - Silent validation mode
 * - Tri-state isValid (null/true/false)
 *
 * Uses useRules() to resolve alias strings via shared context.
 */

// Composables
import { useForm } from '#v0/composables/createForm'
import { createGroup } from '#v0/composables/createGroup'
import { isStandardSchema, useRules } from '#v0/composables/useRules'

// Utilities
import { isFunction, isString } from '#v0/utilities'
import { onScopeDispose, shallowRef, toValue } from 'vue'

// Types
import type { FormValidationRule } from '#v0/composables/createForm'
import type { GroupContext, GroupOptions, GroupTicket, GroupTicketInput } from '#v0/composables/createGroup'
import type { RuleInput } from '#v0/composables/useRules'
import type { MaybeRefOrGetter, ShallowRef } from 'vue'

export type { FormValidationRule } from '#v0/composables/createForm'

/**
 * Input type for validation tickets.
 * Each ticket represents a single validation rule.
 */
export interface ValidationTicketInput extends GroupTicketInput<FormValidationRule> {}

/**
 * Output type for validation tickets.
 * Includes selection methods from GroupTicket for enabling/disabling rules.
 */
export type ValidationTicket<Z extends ValidationTicketInput = ValidationTicketInput> = GroupTicket<Z>

/**
 * Context for managing validation rules for a single input.
 *
 * @template Z The input ticket type.
 * @template E The output ticket type.
 */
export interface ValidationContext<
  Z extends ValidationTicketInput = ValidationTicketInput,
  E extends ValidationTicket<Z> = ValidationTicket<Z>,
> extends Omit<GroupContext<Z, E>, 'register' | 'onboard' | 'reset'> {
  register: (rule: RuleInput | Partial<Z>) => E
  onboard: (rules: (RuleInput | Partial<Z>)[]) => E[]
  /** Run validation against all active (selected) rules. */
  validate: (value?: unknown, silent?: boolean) => Promise<boolean>
  /** Reset errors and validation state. Does not affect rule selection. */
  reset: () => void
  /** Current validation error messages. */
  errors: ShallowRef<string[]>
  /** Tri-state: null (not validated), true (valid), false (invalid). */
  isValid: ShallowRef<boolean | null>
  /** Whether async validation is in progress. */
  isValidating: ShallowRef<boolean>
}

export interface ValidationOptions extends GroupOptions {
  /** Initial rules to register. */
  rules?: RuleInput[]
  /** Value source for validate() when called without arguments. */
  value?: MaybeRefOrGetter<unknown>
}

const UNSET = Symbol('unset')

/**
 * Creates a per-input validation instance.
 *
 * Built on `createGroup` — each registered rule becomes a ticket that can be
 * enabled/disabled via selection methods (`select`, `unselect`, `toggle`).
 * Only selected (active) rules run during validation.
 *
 * @param options The options for the validation instance.
 * @returns A new validation context.
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-validation
 *
 * @example
 * ```ts
 * import { createValidation } from '@vuetify/v0'
 *
 * const validation = createValidation({
 *   rules: [
 *     v => !!v || 'Required',
 *     v => /^.+@\S+\.\S+$/.test(String(v)) || 'Invalid email',
 *   ],
 * })
 *
 * await validation.validate('')
 *
 * console.log(validation.errors.value) // ['Required', 'Invalid email']
 *
 * validation.reset()
 * ```
 */
export function createValidation (_options: ValidationOptions = {}): ValidationContext {
  const { rules: initialRules = [], value: valueSource, enroll = true, ...options } = _options
  const group = createGroup({ ...options, enroll, multiple: true })
  const rulesContext = useRules()

  const errors = shallowRef<string[]>([])
  const isValid = shallowRef<boolean | null>(null)
  const isValidating = shallowRef(false)
  let generation = 0

  function register (input: RuleInput | Partial<ValidationTicketInput>): ValidationTicket {
    if (isFunction(input) || isString(input) || isStandardSchema(input)) {
      const resolved = rulesContext.resolve([input as RuleInput])
      return group.register({ value: resolved[0] ?? (() => true) } as Partial<ValidationTicketInput>)
    }
    return group.register(input as Partial<ValidationTicketInput>)
  }

  function onboard (rules: (RuleInput | Partial<ValidationTicketInput>)[]): ValidationTicket[] {
    return group.batch(() => rules.map(r => register(r)))
  }

  async function validate (_value: unknown = UNSET, silent = false): Promise<boolean> {
    const val = _value === UNSET ? toValue(valueSource) : _value
    const activeRules: FormValidationRule[] = []

    for (const ticket of group.selectedItems.value) {
      activeRules.push(ticket.value as FormValidationRule)
    }

    if (activeRules.length === 0) {
      if (!silent) isValid.value = true
      return true
    }

    const gen = ++generation
    if (!silent) isValidating.value = true

    try {
      const results = await Promise.all(activeRules.map(rule => rule(val)))
      if (gen !== generation) return isValid.value ?? false

      const errorMessages = results
        .filter(result => isString(result) || result === false)
        .map(result => result === false ? 'Validation failed' : result as string)

      if (!silent) {
        errors.value = errorMessages
        isValid.value = errorMessages.length === 0
      }

      return errorMessages.length === 0
    } finally {
      if (gen === generation && !silent) {
        isValidating.value = false
      }
    }
  }

  function reset () {
    errors.value = []
    isValid.value = null
    isValidating.value = false
    generation++
  }

  // Register initial rules
  if (initialRules.length > 0) onboard(initialRules)

  const context = {
    ...group,
    register,
    onboard,
    validate,
    reset,
    errors,
    isValid,
    isValidating,
    get size () {
      return group.size
    },
  } as ValidationContext

  // Auto-register with parent form
  const form = useForm()
  const ticket = form?.register({ value: context as unknown as ValidationContext })

  onScopeDispose(() => {
    if (!ticket || !form) return
    form.unregister(ticket.id)
  }, true)

  return context
}
