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
 * otp.setAt(0, '4')
 * otp.paste('12345', 1) // returns 5; value becomes '412345'
 * otp.isComplete.value  // true
 * ```
 */

// Composables
import { createInput } from '#v0/composables/createInput'
import { useLogger } from '#v0/composables/useLogger'

// Utilities
import { clamp, isString } from '#v0/utilities'
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
export interface OtpOptions extends Omit<InputOptions<string>, 'value'> {
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
  /** Disabled state — mutation helpers no-op. @default false */
  disabled?: MaybeRefOrGetter<boolean>
  /** Readonly state — mutation helpers no-op. @default false */
  readonly?: MaybeRefOrGetter<boolean>
  /**
   * Fire when the joined value first reaches `length`. Decisional —
   * return / resolve `false` to reject (clears value, sets error).
   */
  onComplete?: (value: string) => boolean | void | Promise<boolean | void>
}

/**
 * Reactive context returned by `createOtp`. Consumers index into `value`
 * for per-character rendering and call the mutation helpers to drive state.
 *
 * @example
 * ```ts
 * const otp = createOtp({ length: 6 })
 *
 * otp.setAt(0, '4')
 * otp.paste('12345', 1) // returns 5
 * otp.isComplete.value  // true
 * otp.clear()
 * ```
 */
export interface OtpContext {
  value: Ref<string>
  length: Readonly<Ref<number>>
  input: InputContext<string>
  isComplete: Readonly<Ref<boolean>>
  setAt: (index: number, char: string) => void
  paste: (text: string, index?: number) => number
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

  const PRESETS: Record<Exclude<OtpPattern, RegExp>, RegExp> = {
    numeric: /^[0-9]$/,
    alphanumeric: /^[a-zA-Z0-9]$/,
    alphabetic: /^[a-zA-Z]$/,
  }

  const warned = new WeakSet<RegExp>()

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

  function isLocked (): boolean {
    return toValue(disabled) || toValue(_readonly)
  }

  function setAt (index: number, char: string): void {
    if (isLocked()) return
    const max = toValue(lengthRef)
    if (index < 0 || index >= max) return
    if (char === '') {
      value.value = value.value.slice(0, index)
      return
    }
    const first = char[0]
    if (!accepts(first)) return
    const current = value.value
    const head = current.slice(0, index)
    const tail = current.slice(index + 1)
    value.value = (head + first + tail).slice(0, max)
  }

  function paste (text: string, index = 0): number {
    if (isLocked()) return 0
    const max = toValue(lengthRef)
    const start = clamp(index, 0, max)
    const filtered = filterAccepted(text)
    if (filtered.length === 0) return 0
    const head = value.value.slice(0, start)
    const next = (head + filtered).slice(0, max)
    value.value = next
    return next.length - head.length
  }

  function clear (): void {
    if (isLocked()) return
    value.value = ''
  }

  function fill (text: string): void {
    if (isLocked()) return
    const max = toValue(lengthRef)
    value.value = filterAccepted(text).slice(0, max)
  }

  // Placeholders — fleshed out in subsequent tasks.
  void watch
  void onComplete

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

  return {
    value,
    length: lengthRef,
    input,
    isComplete,
    setAt,
    paste,
    clear,
    fill,
    accepts,
  }
}
