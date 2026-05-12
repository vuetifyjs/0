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
import { clamp } from '#v0/utilities'
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

  // Placeholders — fleshed out in subsequent tasks.
  void logger
  void clamp
  void watch
  void onComplete
  void pattern

  const isComplete = shallowRef(false)

  function accepts (_char: string): boolean {
    return false
  }
  function setAt (_index: number, _char: string): void {}
  function paste (_text: string, _index = 0): number {
    return 0
  }
  function clear (): void {}
  function fill (_text: string): void {}

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
