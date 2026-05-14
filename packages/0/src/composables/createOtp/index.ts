/**
 * @module createOtp
 *
 * @see https://0.vuetifyjs.com/composables/forms/create-otp
 *
 * @remarks
 * Headless state for a fixed-length one-time-password / verification-code value.
 * Owns the joined string, per-character pattern matching, length contract,
 * completion edge detection with a decisional async `onComplete` hook, and
 * validation through `createInput`. Rendering, focus, and per-element event
 * wiring are the consumer's responsibility.
 *
 * @example
 * ```ts
 * import { createOtp } from '@vuetify/v0'
 *
 * const otp = createOtp({
 *   length: 6,
 *   pattern: 'numeric',
 *   onComplete: async value => {
 *     const ok = await verify(value)
 *     return ok
 *   },
 * })
 *
 * otp.put(0, '4')
 * otp.distribute('12345', 1) // returns 5; value becomes '412345'
 * otp.isComplete.value  // true
 * ```
 */

// Composables
import { createInput } from '#v0/composables/createInput'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { clamp, isString, isThenable } from '#v0/utilities'
import { shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { InputContext, InputOptions } from '#v0/composables/createInput'
import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * Pattern presets — string literals compile to internal RegExps; arbitrary
 * RegExp values are applied per character.
 *
 * @example
 * ```ts
 * const otp = createOtp({ pattern: 'numeric' })
 * const hex = createOtp({ pattern: /^[0-9a-fA-F]$/ })
 * ```
 */
export type OtpPattern = 'numeric' | 'alphanumeric' | 'alphabetic' | RegExp

const PRESETS: Record<Exclude<OtpPattern, RegExp>, RegExp> = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
  alphabetic: /^[a-zA-Z]$/,
}

const warned = /* @__PURE__ */ new WeakSet<RegExp>()

function extractMessage (error: unknown): string {
  if (error instanceof Error) return error.message
  if (isString(error)) return error
  return String(error)
}

/**
 * Options accepted by `createOtp`.
 *
 * @example
 * ```ts
 * const otp = createOtp({
 *   length: 6,
 *   pattern: 'numeric',
 *   disabled: false,
 *   onComplete: async value => {
 *     const ok = await verify(value)
 *     return ok
 *   },
 * })
 * ```
 */
export interface OtpOptions extends Omit<InputOptions<string>, 'value' | 'error' | 'errorMessages'> {
  /** Number of characters. @default 6 */
  length?: MaybeRefOrGetter<number>
  /** Joined value source. @default shallowRef('') */
  value?: Ref<string>
  /**
   * Per-character pattern. String presets compile to internal RegExps;
   * custom RegExp must match a single character.
   * @default 'numeric'
   */
  pattern?: MaybeRefOrGetter<OtpPattern>
  /**
   * Fire when the joined value first reaches `length`. Decisional —
   * return / resolve `false` to reject (clears value, sets error).
   */
  onComplete?: (value: string) => boolean | void | PromiseLike<boolean | void>
}

/**
 * Reactive context returned by `createOtp`. Consumers index into `value`
 * for per-character rendering and call the mutation helpers to drive state.
 *
 * @example
 * ```ts
 * const otp = createOtp({ length: 6 })
 *
 * otp.put(0, '4')
 * otp.distribute('12345', 1) // returns 5
 * otp.isComplete.value  // true
 * otp.clear()
 * ```
 */
export interface OtpContext {
  /**
   * The joined OTP string. Use the mutation helpers (`put`, `distribute`,
   * `fill`, `clear`) to update. Writing through this ref directly is
   * intentionally prevented to preserve pattern, length, and lock invariants.
   */
  value: Readonly<Ref<string>>
  length: Readonly<Ref<number>>
  /**
   * The underlying `createInput` context — exposes ARIA IDs, validation
   * state, focus/touched, and the `validate` / `reset` methods.
   *
   * Note: `input.value` aliases `OtpContext.value` and is also readonly on
   * the public surface. Use the mutation helpers (`put`, `distribute`,
   * `fill`, `clear`) to update.
   */
  input: Omit<InputContext<string>, 'value'> & { value: Readonly<Ref<string>> }
  isComplete: Readonly<Ref<boolean>>
  put: (index: number, char: string) => void
  distribute: (text: string, index?: number) => number
  clear: () => void
  fill: (text: string) => void
  accepts: (char: string) => boolean
}

export function createOtp (options: OtpOptions = {}): OtpContext {
  const {
    value = shallowRef(''),
    length = 6,
    pattern = 'numeric',
    disabled = false,
    readonly: _readonly = false,
    onComplete,
    ...inputOptions
  } = options

  const logger = useLogger()

  const errorRef = shallowRef(false)
  const errorMessagesRef = shallowRef<string[] | undefined>(undefined)

  const input = createInput<string>({
    ...inputOptions,
    value,
    disabled,
    readonly: _readonly,
    error: errorRef,
    errorMessages: errorMessagesRef,
  })

  const lengthRef = toRef(() => toValue(length))

  // Track the last value that triggered onComplete to detect repeated completion edges.
  // Watching isComplete directly misses cycles where value clears then refills within
  // the same flush tick (old === new === true, Vue skips the callback).
  let lastCompleted = ''

  function compile (resolved: OtpPattern): RegExp {
    if (isString(resolved)) return PRESETS[resolved]
    if (__DEV__ && !warned.has(resolved) && (resolved.test('aa') || resolved.test('00'))) {
      warned.add(resolved)
      logger.warn('createOtp: pattern matches multi-character input; per-character matching may behave unexpectedly')
    }
    return resolved
  }

  function accepts (char: string): boolean {
    if (char.length !== 1) return false
    return compile(toValue(pattern)).test(char)
  }

  function filterAccepted (text: string): string {
    let out = ''
    for (const ch of text) {
      if (accepts(ch)) out += ch
    }
    return out
  }

  // While an async onComplete is pending, mutation helpers no-op via `isLocked()`.
  // The spec also wants `input.isValidating` to reflect this state; today
  // createInput doesn't accept an external isValidating source. Tracked as a
  // follow-up — wire `isValidating: isPending` once createInput supports it.
  const isPending = shallowRef(false)

  function isLocked (): boolean {
    return toValue(disabled) || toValue(_readonly) || isPending.value
  }

  function clearRejection (): void {
    if (errorRef.value || errorMessagesRef.value) {
      errorRef.value = false
      errorMessagesRef.value = undefined
    }
  }

  function put (index: number, char: string): void {
    if (isLocked()) return
    const max = toValue(lengthRef)
    if (index < 0 || index >= max) return
    if (char === '') {
      clearRejection()
      value.value = value.value.slice(0, index)
      return
    }
    const first = char[0]
    if (!accepts(first)) return
    clearRejection()
    const current = value.value
    const head = current.slice(0, index)
    const tail = current.slice(index + 1)
    value.value = (head + first + tail).slice(0, max)
  }

  function distribute (text: string, index = 0): number {
    if (isLocked()) return 0
    const max = toValue(lengthRef)
    const start = clamp(index, 0, max)
    const filtered = filterAccepted(text)
    if (filtered.length === 0) return 0
    clearRejection()
    const head = value.value.slice(0, start)
    const next = (head + filtered).slice(0, max)
    value.value = next
    return next.length - head.length
  }

  function clear (): void {
    if (isLocked()) return
    clearRejection()
    lastCompleted = ''
    value.value = ''
  }

  function fill (text: string): void {
    if (isLocked()) return
    const max = toValue(lengthRef)
    const filtered = filterAccepted(text).slice(0, max)
    // Clear rejection on deliberate empty (fill('')) or any accepted input.
    // Skip clearing if user provided non-empty input that was entirely rejected
    // — preserves the rejection signal until the user enters a valid character.
    if (text.length === 0 || filtered.length > 0) clearRejection()
    value.value = filtered
  }

  function reject (): void {
    errorRef.value = true
    errorMessagesRef.value = ['v0.otp.rejected']
    lastCompleted = ''
    value.value = ''
  }

  const isComplete = toRef(() => {
    const max = toValue(lengthRef)
    const v = value.value
    if (v.length !== max) return false
    const re = compile(toValue(pattern))
    for (const ch of v) {
      if (!re.test(ch)) return false
    }
    return true
  })

  watch(value, next => {
    if (!isComplete.value) {
      lastCompleted = ''
      return
    }
    if (!onComplete) return
    if (isLocked()) return
    if (next === lastCompleted) return
    lastCompleted = next
    let result: ReturnType<NonNullable<OtpOptions['onComplete']>>
    try {
      result = onComplete(next)
    } catch (error) {
      logger.warn(`createOtp: onComplete threw — ${extractMessage(error)}`)
      reject()
      return
    }
    if (isThenable(result)) {
      isPending.value = true
      result.then(
        ok => {
          isPending.value = false
          if (ok === false) reject()
        },
        error => {
          isPending.value = false
          logger.warn(`createOtp: onComplete rejected — ${extractMessage(error)}`)
          reject()
        },
      )
      return
    }
    if (result === false) reject()
  })

  const inputContext: InputContext<string> = {
    ...input,
    reset () {
      clearRejection()
      lastCompleted = ''
      input.reset()
    },
  }

  return {
    value,
    length: lengthRef,
    input: inputContext,
    isComplete,
    put,
    distribute,
    clear,
    fill,
    accepts,
  }
}
