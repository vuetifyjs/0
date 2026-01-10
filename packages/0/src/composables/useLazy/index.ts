/**
 * @module useLazy
 *
 * @see https://0.vuetifyjs.com/composables/system/use-lazy
 *
 * @remarks
 * Deferred content rendering composable for performance optimization.
 *
 * Key features:
 * - Content only renders after first activation (unless eager)
 * - Optional reset on deactivation for memory savings
 * - Readonly state refs for template binding
 * - Manual reset control
 * - SSR-safe
 *
 * Perfect for dialogs, menus, tooltips, and any component with
 * conditionally rendered content.
 */

// Utilities
import { onScopeDispose, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRef, Ref, ShallowRef } from 'vue'

export interface LazyOptions {
  /**
   * When true, content renders immediately without waiting for activation.
   * @default false
   */
  eager?: MaybeRef<boolean>
}

export interface LazyContext {
  /**
   * Whether the lazy content has been activated at least once.
   */
  readonly isBooted: Readonly<ShallowRef<boolean>>
  /**
   * Whether content should be rendered.
   * True when: isBooted OR eager OR active
   */
  readonly hasContent: Readonly<Ref<boolean>>
  /**
   * Reset booted state. Call on leave transition if not eager.
   */
  reset: () => void
  /**
   * Transition callback for after-leave. Resets if not eager.
   */
  onAfterLeave: () => void
}

/**
 * Deferred content rendering for performance optimization.
 *
 * @param active Reactive boolean controlling activation state
 * @param options Configuration options
 * @returns Lazy context with state refs and control functions
 *
 * @see https://0.vuetifyjs.com/composables/system/use-lazy
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useLazy } from '@vuetify/v0'
 *
 * const isOpen = ref(false)
 * const { hasContent, onAfterLeave } = useLazy(isOpen)
 *
 * // In template:
 * // <Transition @after-leave="onAfterLeave">
 * //   <div v-if="isOpen">
 * //     <template v-if="hasContent">
 * //       <!-- Heavy content here -->
 * //     </template>
 * //   </div>
 * // </Transition>
 * ```
 *
 * @example
 * Eager mode (render immediately):
 * ```ts
 * const { hasContent } = useLazy(isOpen, { eager: true })
 * // hasContent.value is always true
 * ```
 *
 * @example
 * With reactive eager prop:
 * ```ts
 * const props = defineProps<{ eager: boolean }>()
 * const { hasContent } = useLazy(isOpen, { eager: toRef(() => props.eager) })
 * ```
 */
export function useLazy (
  active: MaybeRef<boolean>,
  options: LazyOptions = {},
): LazyContext {
  const { eager = false } = options

  const isBooted = shallowRef(false)
  const hasContent = toRef(() => isBooted.value || toValue(eager) || toValue(active))

  const stop = watch(
    () => toValue(active),
    value => {
      if (value) isBooted.value = true
    },
    { immediate: true },
  )

  function reset () {
    isBooted.value = false
  }

  function onAfterLeave () {
    if (!toValue(eager)) reset()
  }

  onScopeDispose(stop)

  return {
    isBooted: shallowReadonly(isBooted),
    hasContent: shallowReadonly(hasContent),
    reset,
    onAfterLeave,
  }
}
