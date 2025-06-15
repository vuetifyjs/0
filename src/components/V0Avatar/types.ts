// Types
import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import type { V0PaperProps } from '@/components/V0Paper'
import type { V0AtomProps } from '@/components/V0Atom'
import type { V0IconProps } from '@/components/V0Icon'

interface V0AvatarPropsBase {
  src?: string
  icon?: string
  text?: string
  loading?: boolean
}

export interface V0AvatarRootProps extends V0AtomProps, V0AvatarPropsBase {
  size?: string
}

export interface V0AvatarProps extends V0AvatarRootProps, V0PaperProps {}

export interface V0AvatarImageProps extends V0AtomProps, V0AvatarPropsBase {}
export interface V0AvatarImageEmits {
  load: [e: Event]
  error: [e: Event]
}

export interface V0AvatarIconProps extends V0IconProps {}

export interface V0AvatarLoadingProps extends V0AtomProps {
  loading?: V0AvatarPropsBase['loading']
}

export interface V0AvatarFallbackProps extends V0AtomProps {
  text?: V0AvatarPropsBase['text']
}

export interface V0AvatarInstance extends V0AvatarPropsBase {
  status: 'loaded' | 'error' | 'loading'
  setStatus: (status: V0AvatarInstance['status']) => void
}
export type V0AvatarProvide = MaybeRefOrGetter<V0AvatarInstance>
export const V0AvatarKey: InjectionKey<V0AvatarProvide> = Symbol('v0-avatar')
