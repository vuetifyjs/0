/**
 * @module useToggleScope
 *
 * @remarks
 * Conditionally manages an effect scope based on a reactive boolean condition.
 * When the source becomes true, creates and runs an effect scope. When false, stops the scope.
 * All reactive effects created within the scoped function are automatically cleaned up on deactivation.
 *
 * Key features:
 * - Uses Vue's effectScope for efficient reactive effect lifecycle management
 * - Automatic cleanup when condition becomes false
 * - Supports optional reset callback for scope restart capability
 * - Handles rapid toggling and parent scope disposal safely
 * - SSR-safe (effectScope is part of Vue core)
 *
 * Perfect for conditional side effects, feature flags, and performance optimization
 * by only running reactive effects when needed.
 */

// Types
import type { EffectScope, Ref, WatchSource } from 'vue'

// Composables
import { effectScope, onScopeDispose, shallowReadonly, shallowRef, toRef, watch } from 'vue'

export interface ToggleScopeControls {
  /**
   * Whether the scope is currently active (created and running)
   */
  readonly isActive: Readonly<Ref<boolean>>
  /**
   * Stop the scope (destroys and cleans up all effects)
   */
  stop: () => void
  /**
   * Start the scope (creates and runs effects)
   */
  start: () => void
  /**
   * Reset the scope (stops and immediately restarts)
   */
  reset: () => void
}

/**
 * Conditionally manages an effect scope based on a reactive boolean source.
 *
 * @param source A reactive boolean value or getter that controls the scope lifecycle
 * @param fn The function to run within the effect scope. Can optionally receive controls for manual scope management.
 * @returns Controls object with isActive state and start/stop/reset methods
 *
 * @see https://vuejs.org/api/reactivity-advanced.html#effectscope
 * @see https://0.vuetifyjs.com/composables/system/use-toggle-scope
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useToggleScope } from '@vuetify/v0'
 *
 * const isEnabled = ref(false)
 *
 * const { isActive } = useToggleScope(isEnabled, () => {
 *   // This code runs when isEnabled becomes true
 *   const unwatch = watch(someRef, () => {
 *     console.log('Watching...')
 *   })
 *
 *   // Cleanup happens automatically when isEnabled becomes false
 * })
 *
 * // Toggle the scope on/off
 * isEnabled.value = true  // Starts the scope
 * console.log(isActive.value) // true
 * isEnabled.value = false // Stops and cleans up
 * console.log(isActive.value) // false
 * ```
 *
 * @example
 * With manual controls:
 * ```ts
 * const isEnabled = ref(true)
 *
 * useToggleScope(isEnabled, (controls) => {
 *   // Access controls inside the scope
 *   console.log('Active:', controls.isActive.value)
 *
 *   // Manually reset the scope if needed
 *   someEvent.on('reset', () => controls.reset())
 * })
 * ```
 */
export function useToggleScope (
  source: WatchSource<boolean>,
  fn: (() => void) | ((controls: ToggleScopeControls) => void),
): ToggleScopeControls {
  const scope = shallowRef<EffectScope>()
  const isActive = toRef(() => !!scope.value)

  function start () {
    if (scope.value) return // Already active

    scope.value = effectScope()
    scope.value.run(() =>
      fn.length > 0
        ? (fn as (controls: ToggleScopeControls) => void)(controls)
        : (fn as () => void)(),
    )
  }

  function stop () {
    scope.value?.stop()
    scope.value = undefined
  }

  function reset () {
    stop()
    start()
  }

  const controls: ToggleScopeControls = {
    isActive: shallowReadonly(isActive),
    start,
    stop,
    reset,
  }

  watch(source, active => {
    if (active && !scope.value) {
      start()
    } else if (!active) {
      stop()
    }
  }, { immediate: true })

  onScopeDispose(() => {
    stop()
  })

  return controls
}
