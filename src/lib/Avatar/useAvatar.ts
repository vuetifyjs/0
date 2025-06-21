import type { InjectionKey, ShallowRef } from 'vue'

export interface AvatarContext {
  status: ShallowRef<'idle' | 'loaded' | 'error' | 'loading'>
}

export const AvatarSymbol: InjectionKey<AvatarContext> = Symbol('V0Avatar')

export function useAvatar () {
  return {
    status: shallowRef('idle' as const),
  }
}
