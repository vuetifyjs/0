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
 * Generic object with string keys and any values
 *
 * @remarks
 * Use sparingly - prefer `UnknownObject` for better type safety.
 */
export type GenericObject = Record<string, any>

/**
 * Object with string keys and unknown values
 *
 * @remarks
 * Safer alternative to `GenericObject` that requires type narrowing.
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
