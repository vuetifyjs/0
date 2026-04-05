/**
 * @module toElement
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-element
 *
 * @remarks
 * Resolves various element reference types to a DOM Element.
 *
 * Accepts refs, getters, raw DOM elements, or Vue component instances
 * and normalizes them to a plain Element. Uses structural typing to
 * avoid cross-version Vue Ref incompatibilities.
 */

// Utilities
import { isElement, isFunction, isObject } from '#v0/utilities'

// Types
import type { ComponentPublicInstance } from 'vue'

type MaybeElementValue = HTMLElement | SVGElement | ComponentPublicInstance | Element | null | undefined

/**
 * A flexible element ref type that accepts refs, getters, or raw values
 * containing DOM elements or Vue component instances.
 *
 * @remarks
 * Defined structurally (using `{ readonly value: T }`) instead of Vue's
 * nominal `Ref<T>` to avoid type mismatches when consumers use a
 * different Vue version than the library.
 * Use {@link toElement} to resolve the actual DOM element.
 */
export type MaybeElementRef =
  | { readonly value: MaybeElementValue }
  | (() => MaybeElementValue)
  | MaybeElementValue

/**
 * Resolves a {@link MaybeElementRef} to a DOM Element or undefined.
 *
 * Handles:
 * - `Ref<Element>`, `ShallowRef<HTMLElement>`, getter functions
 * - Vue component instances (extracts `$el`)
 * - Raw DOM elements (pass-through)
 * - null/undefined (returns undefined)
 *
 * @param target The element ref, getter, or raw value to resolve
 * @returns The resolved DOM Element, or undefined if not available
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-element
 *
 * @example
 * ```ts
 * import { toElement } from '@vuetify/v0'
 *
 * const el = shallowRef<HTMLElement | null>(null)
 * toElement(el) // HTMLElement | undefined
 *
 * const component = ref<ComponentPublicInstance>()
 * toElement(component) // Element | undefined (from $el)
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function toElement (target: MaybeElementRef): Element | undefined {
  const raw = isFunction(target)
    ? target()
    : (target && isObject(target) && 'value' in target
        ? target.value
        : target)
  if (!raw) return undefined
  if (isElement(raw)) return raw
  // ComponentPublicInstance — extract $el
  if ('$el' in raw) return raw.$el as Element | undefined
  return undefined
}
