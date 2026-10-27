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
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { toElement } from '@vuetify/v0'
 *
 * const el = shallowRef<HTMLElement | null>(null)
 * const resolved = toElement(el) // HTMLElement | undefined
 * ```
 */

// Utilities
import { isArray, isElement, isFunction, isObject } from '#v0/utilities'

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
  if (!target) return undefined
  // Raw element passes through first — Element shapes with their own `value`
  // property (e.g. <li>, <button>, <input>) would otherwise be misread as a
  // ref-like { value } and have their attribute value extracted instead.
  if (isElement(target)) return target
  const raw = isFunction(target)
    ? target()
    : (isObject(target) && 'value' in target
        ? target.value
        : target)
  if (!raw) return undefined
  if (isElement(raw)) return raw
  // ComponentPublicInstance — extract $el
  if (isObject(raw) && '$el' in raw) return raw.$el as Element | undefined
  if (isVaporInstance(raw)) return fromBlock(raw.block)
  return undefined
}

/**
 * Detects a Vue 3.6 Vapor component instance by shape. A template ref to a
 * Vapor component is the raw instance: it has no `$el`, and its DOM lives in
 * `block`. Structural only, since the Vapor runtime is not a dependency, and
 * it reads an undocumented internal while Vue 3.6 is pre-release.
 */
function isVaporInstance (value: unknown): value is { block: unknown } {
  return isObject(value) && value.vapor === true && 'block' in value
}

/**
 * Walks a Vapor block depth-first in document order and returns its first
 * Element. A block is a Node, an array of blocks, a nested Vapor instance
 * (`block`), or a fragment (`nodes`). Text, comment and anchor nodes are
 * skipped.
 */
function fromBlock (block: unknown): Element | undefined {
  if (isElement(block)) return block
  if (isArray(block)) {
    for (const child of block) {
      const el = fromBlock(child)
      if (el) return el
    }
    return undefined
  }
  if (isVaporInstance(block)) return fromBlock(block.block)
  if (isObject(block) && 'nodes' in block) return fromBlock(block.nodes)
  return undefined
}
