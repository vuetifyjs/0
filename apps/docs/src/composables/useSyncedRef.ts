// Utilities
import { type Ref, type ShallowRef, shallowRef, watch } from 'vue'

/**
 * Creates a local ref that initializes from a global ref and stays
 * in sync when the global value changes. The local ref can still be
 * independently modified per-instance (e.g. per-component toggle).
 */
export function useSyncedRef<T> (source: Ref<T> | ShallowRef<T>): ShallowRef<T> {
  const local = shallowRef(source.value) as ShallowRef<T>

  watch(source, val => {
    local.value = val
  })

  return local
}
