/**
 * @module types
 *
 * @remarks
 * Shared type definitions used throughout @vuetify/v0.
 */

import type { h } from 'vue'

/**
 * Valid element types for Vue's `h()` render function
 *
 * @remarks
 * Includes HTML tag names, component definitions, and functional components.
 * Used by the `Atom` component for polymorphic rendering.
 */
export type DOMElement = Parameters<typeof h>[0]

/**
 * Object with string keys and unknown values
 *
 * @remarks
 * Object with string keys and unknown values for generic record handling.
 */
export type UnknownObject = Record<string, unknown>

/**
 * Identifier type used throughout the registry system
 *
 * @remarks
 * All tickets, items, and registrable entities use this type for their `id` property.
 *
 * @example
 * ```ts
 * const id: ID = 'item-1'     // string
 * const id: ID = 42           // number
 * ```
 */
export type ID = string | number

/**
 * Recursively makes all properties of T optional
 *
 * @template T The object type to make deeply partial
 *
 * @remarks
 * Used by `mergeDeep` to type partial source objects.
 *
 * @example
 * ```ts
 * type User = { name: string; address: { city: string } }
 * type PartialUser = DeepPartial<User>
 * // { name?: string; address?: { city?: string } }
 * ```
 */
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T

/**
 * Union type that accepts either a single value or an array
 *
 * @template T The base type
 *
 * @remarks
 * Used for APIs that accept both single items and arrays.
 *
 * @example
 * ```ts
 * function process(input: MaybeArray<string>) { ... }
 * process('single')        // OK
 * process(['a', 'b', 'c']) // OK
 * ```
 */
export type MaybeArray<T> = T | T[]

/**
 * Preserves string literal autocomplete while allowing arbitrary strings
 *
 * @template T The string literal union to preserve
 *
 * @remarks
 * TypeScript normally collapses `'a' | 'b' | string` into just `string`,
 * losing IDE autocomplete for the known values. This type uses the
 * `string & {}` trick to prevent that collapse.
 *
 * Use for extensible APIs where you want autocomplete for known values
 * but still accept custom strings: event names, theme tokens, CSS classes, etc.
 *
 * @example
 * ```ts
 * type Color = 'red' | 'blue' | 'green'
 *
 * // WITHOUT Extensible - autocomplete lost
 * type BadColor = Color | string  // collapses to just `string`
 *
 * // WITH Extensible - autocomplete preserved
 * type GoodColor = Extensible<Color>
 *
 * function setColor(c: GoodColor) {}
 * setColor('red')      // autocomplete suggests 'red' | 'blue' | 'green'
 * setColor('purple')   // also OK - custom value accepted
 * ```
 *
 * @example
 * ```ts
 * // Event system with typed + custom events
 * type KnownEvent = 'click' | 'hover' | 'focus'
 *
 * function on<K extends Extensible<KnownEvent>>(event: K, cb: Callback<K>) {}
 *
 * on('click', ...)     // autocomplete works
 * on('custom', ...)    // custom events allowed
 * ```
 */
export type Extensible<T extends string> = T | (string & {})

/**
 * Keyboard activation mode for navigable components
 *
 * @remarks
 * Controls when selection occurs during keyboard navigation:
 * - `automatic` (default): Selection follows focus (arrow keys select).
 *   This is the WAI-ARIA standard for radio groups.
 * - `manual`: Arrow keys move focus only; Enter/Space required to select.
 *   Use for toolbar contexts or when deliberate selection is preferred.
 *
 * @example
 * ```vue
 * <template>
 *   <Radio.Group v-model="selected" activation="manual">
 *     <Radio.Root value="a">Option A</Radio.Root>
 *   </Radio.Group>
 * </template>
 * ```
 */
export type Activation = 'automatic' | 'manual'

/**
 * Discriminated union of structured details attached to every v0-thrown error
 *
 * @remarks
 * Each arm pairs a stable `code` discriminant with the domain context for that
 * code. Consumed by the `V0Error` constructor in `#v0/utilities` — the union
 * is the source of truth for both what codes exist and what payload each code
 * carries.
 *
 * Prefer `isV0Error(err, code)` over manual narrowing — see
 * `V0Error` and `isV0Error` in `#v0/utilities` for the consumer-facing API
 * and worked examples.
 *
 * Inspiration: tRPC's `TRPCError.code`, Node's `error.code` registry.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
 * @see https://nodejs.org/api/errors.html#nodejs-error-codes
 * @see https://trpc.io/docs/server/error-handling
 *
 * @example
 * ```ts
 * const details: V0ErrorDetails = { code: 'V0_CONTEXT_MISSING', key: 'theme' }
 * ```
 */
export type V0ErrorDetails =
  | { code: 'V0_CONTEXT_MISSING', key: string | symbol }
  | { code: 'V0_PLUGIN_MISSING', plugin: string }

/**
 * Union of every error code thrown by v0
 *
 * @remarks
 * Convenience alias for the discriminant field of {@link V0ErrorDetails}.
 *
 * @example
 * ```ts
 * function describe (code: V0ErrorCode): string {
 *   switch (code) {
 *     case 'V0_CONTEXT_MISSING': return 'missing provider'
 *     case 'V0_PLUGIN_MISSING': return 'plugin not installed'
 *   }
 * }
 * ```
 */
export type V0ErrorCode = V0ErrorDetails['code']
