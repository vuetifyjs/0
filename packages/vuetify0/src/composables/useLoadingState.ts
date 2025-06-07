import { readonly, ref, type Ref } from 'vue'

/**
 * Composable for managing loading states with type safety
 * @param initialState - The initial state value
 * @returns Object with readonly state and setState function
 */
export function useLoadingState<T extends string> (initialState: T) {
  const state = ref<T>(initialState)

  const setState = (newState: T) => {
    state.value = newState
  }

  return {
    state: readonly(state) as Readonly<Ref<T>>,
    setState,
  }
}

/**
 * Specific composable for image loading states
 */
export function useImageLoadingState () {
  return useLoadingState<'loading' | 'loaded' | 'error'>('loading')
}
