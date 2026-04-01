/**
 * @module usePresence
 *
 * @see https://0.vuetifyjs.com/composables/system/use-presence
 *
 * @remarks
 * Animation-agnostic mount lifecycle composable.
 *
 * Manages the full DOM presence lifecycle: lazy mount, enter, exit delay, unmount.
 * Consumers control exit timing via a `done()` callback, making it compatible
 * with CSS transitions, Web Animations API, GSAP, or no animation at all.
 *
 * Key features:
 * - State machine: unmounted → mounted → present → leaving → unmounted
 * - Lazy mounting: defer first mount until first activation
 * - Re-entry during leave: cancels exit, stays mounted
 * - Immediate mode: auto-unmounts if done() not called (fast path)
 * - SSR-safe: starts unmounted
 */

// Utilities
import { nextTick, onScopeDispose, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export type PresenceState = 'unmounted' | 'mounted' | 'present' | 'leaving'

export interface UsePresenceOptions {
  /** Drive visibility. */
  present: MaybeRefOrGetter<boolean>
  /** Delay first mount until present is first true. @default false */
  lazy?: boolean
  /** Auto-resolve LEAVING state next tick if done() not called. @default true */
  immediate?: boolean
}

export interface UsePresenceReturn {
  /** Current lifecycle state. */
  readonly state: Readonly<ShallowRef<PresenceState>>
  /** Should the element be in the DOM? */
  readonly isMounted: Readonly<Ref<boolean>>
  /** Is it logically present? */
  readonly isPresent: Readonly<Ref<boolean>>
  /** Is an exit in progress? */
  readonly isLeaving: Readonly<Ref<boolean>>
  /** Call when exit animation finishes. */
  done: () => void
}

/**
 * Animation-agnostic mount lifecycle management.
 *
 * @param options Configuration for presence behavior
 * @returns Reactive state refs and a `done` callback for exit animation control
 *
 * @see https://0.vuetifyjs.com/composables/system/use-presence
 *
 * @example
 * Basic usage:
 * ```ts
 * import { ref } from 'vue'
 * import { usePresence } from '@vuetify/v0'
 *
 * const isOpen = ref(false)
 * const { isMounted, state, done } = usePresence({ present: isOpen })
 *
 * // In template:
 * // <div v-if="isMounted" :data-state="state" @animationend="done">
 * //   Content
 * // </div>
 * ```
 *
 * @example
 * Lazy mount (defer until first activation):
 * ```ts
 * const { isMounted } = usePresence({ present: isOpen, lazy: true })
 * // isMounted stays false until isOpen is first true
 * ```
 *
 * @example
 * Manual exit control (for JS-driven animations):
 * ```ts
 * const { isLeaving, done } = usePresence({
 *   present: isOpen,
 *   immediate: false,
 * })
 * // Stays in 'leaving' state until done() is called
 * ```
 */
export function usePresence (options: UsePresenceOptions): UsePresenceReturn {
  const { lazy = false, immediate = true } = options

  const state = shallowRef<PresenceState>('unmounted')
  const isMounted = toRef(() => state.value !== 'unmounted')
  const isPresent = toRef(() => state.value === 'present')
  const isLeaving = toRef(() => state.value === 'leaving')

  let booted = !lazy

  function done () {
    if (state.value !== 'leaving') return

    // In lazy mode, stay mounted after leave (keep in DOM)
    state.value = lazy ? 'mounted' : 'unmounted'
  }

  function enter () {
    state.value = 'mounted'
    nextTick(() => {
      // Guard: present may have gone false during the tick
      if (state.value === 'mounted') {
        state.value = 'present'
      }
    })
  }

  function leave () {
    if (state.value !== 'present' && state.value !== 'mounted') return

    state.value = 'leaving'

    if (immediate) {
      nextTick(() => {
        // Auto-resolve if still leaving (consumer didn't call done)
        if (state.value === 'leaving') {
          done()
        }
      })
    }
  }

  const stop = watch(
    () => toValue(options.present),
    value => {
      if (value) {
        if (!booted) booted = true

        switch (state.value) {
          case 'leaving': {
          // Re-entry during leave
            state.value = 'present'

            break
          }
          case 'mounted': {
          // Re-activation of lazy-kept content
            state.value = 'present'

            break
          }
          case 'unmounted': {
            enter()

            break
          }
        // No default
        }
      } else if (booted) {
        leave()
      }
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    stop()
    state.value = 'unmounted'
  }, true)

  return {
    state: shallowReadonly(state),
    isMounted: shallowReadonly(isMounted),
    isPresent: shallowReadonly(isPresent),
    isLeaving: shallowReadonly(isLeaving),
    done,
  }
}
