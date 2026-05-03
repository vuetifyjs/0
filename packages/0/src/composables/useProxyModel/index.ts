/**
 * @module useProxyModel
 *
 * @see https://0.vuetifyjs.com/composables/reactivity/use-proxy-model
 *
 * @remarks
 * Proxy composable for bidirectional sync between a model context and v-model.
 *
 * Key features:
 * - Bidirectional synchronization
 * - `multiple` option controls array vs single-value mode (must be explicit — not inferred)
 * - `MaybeRefOrGetter` support for the `multiple` option
 * - Automatic cleanup on scope disposal
 * - Works with any ModelContext (Selection, Slider, etc.)
 *
 * Bridges the gap between model composables and Vue's v-model.
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { createSelection, useProxyModel } from '@vuetify/v0'
 *
 * const selection = createSelection({ events: true })
 * const model = shallowRef<string[]>([])
 * useProxyModel(selection, model, { multiple: true })
 * ```
 */

// Transformers
import { toArray } from '#v0/composables/toArray'

// Utilities
import { isArray, isFunction } from '#v0/utilities'
import { onScopeDispose, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

export interface ProxyModelOptions {
  multiple?: MaybeRefOrGetter<boolean>
  transformIn?: (val: unknown) => unknown
  transformOut?: (val: unknown) => unknown
}

/**
 * Minimal interface for useProxyModel's context parameter.
 * Both ModelContext (Set-based) and SliderContext (Array-based) satisfy this.
 */
export interface ProxyModelTarget {
  selectedValues: { readonly value: Iterable<unknown> }
  apply: (values: unknown[], options?: { multiple?: boolean }) => void
  select?: (id: string | number) => void
  multiple?: MaybeRefOrGetter<boolean>
  on?: (event: string, cb: (data: unknown) => void) => void
  off?: (event: string, cb: (data: unknown) => void) => void
}

/**
 * Syncs a ref with a model context bidirectionally.
 *
 * @param context The model context to bind to.
 * @param model The ref to sync.
 * @param options The options for the proxy model.
 * @returns A function to stop the sync.
 *
 * @see https://0.vuetifyjs.com/composables/reactivity/use-proxy-model
 *
 * @example
 * ```ts
 * import { createSelection, useProxyModel } from '@vuetify/v0'
 *
 * const model = ref()
 * const registry = createSelection({ events: true })
 * registry.onboard([
 *   { id: 'item-1', value: 'Item 1' },
 *   { id: 'item-2', value: 'Item 2' },
 * ])
 *
 * const stop = useProxyModel(registry, model)
 * ```
 */
export function useProxyModel (
  context: ProxyModelTarget,
  model: Ref<unknown>,
  options?: ProxyModelOptions,
) {
  const multiple = options?.multiple ?? context.multiple ?? false
  const _transformIn = options?.transformIn
  const _transformOut = options?.transformOut

  function transformIn (val: unknown): unknown[] {
    const value = toValue(val)
    return toArray(isFunction(_transformIn) ? _transformIn(value) : value)
  }

  function transformOut (val: unknown[]) {
    if (isFunction(_transformOut)) return _transformOut(val)
    return toValue(multiple) ? val : val[0]
  }

  const applyOptions = toValue(multiple) === toValue(context.multiple ?? false)
    ? undefined
    : { multiple: toValue(multiple) as boolean }

  // Initialize: apply current model value, track unresolved values
  const modelAsArray = transformIn(model)
  const pending = new Set(modelAsArray)

  context.apply(modelAsArray, applyOptions)

  const selected = new Set(context.selectedValues.value)
  for (const value of modelAsArray) {
    if (selected.has(value)) {
      pending.delete(value)
    }
  }

  let syncing = false

  function shallowEqual (a: unknown, b: unknown): boolean {
    if (a === b) return true
    if (!isArray(a) || !isArray(b) || a.length !== b.length) return false
    return a.every((v, index) => v === b[index])
  }

  const contextWatch = watch(context.selectedValues as Ref, val => {
    if (syncing) return

    modelWatch.pause()
    model.value = transformOut(Array.from(toValue(val)))
    modelWatch.resume()
  }, { flush: 'sync' })

  const modelWatch = watch(model, val => {
    if (syncing) return

    syncing = true
    contextWatch.pause()
    context.apply(transformIn(val), applyOptions)
    // Sync model back to actual selection state (apply may have rejected due to disabled/mandatory)
    const actual = transformOut(Array.from(context.selectedValues.value))
    if (!shallowEqual(val, actual)) model.value = actual
    contextWatch.resume()
    syncing = false
  }, { flush: 'sync', deep: toValue(multiple) })

  function onRegister (data: unknown) {
    const ticket = data as { id: string | number, value: unknown, disabled?: unknown }
    if (!pending.has(ticket.value) || toValue(ticket.disabled)) return

    contextWatch.pause()
    modelWatch.pause()

    context.select?.(ticket.id)
    pending.delete(ticket.value)

    modelWatch.resume()
    contextWatch.resume()
  }

  context.on?.('register:ticket', onRegister)

  function stop () {
    contextWatch()
    modelWatch()
    context.off?.('register:ticket', onRegister)
  }

  onScopeDispose(stop, true)

  return stop
}
