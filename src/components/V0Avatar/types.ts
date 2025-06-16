// Types
import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import type { V0PaperProps } from '@/components/V0Paper'
import type { V0AtomProps } from '@/components/V0Atom'
import type { V0ImgProps } from '@/components/V0Img'

export interface V0AvatarProps extends V0AvatarRootProps, V0PaperProps {
  src?: string
  icon?: string
  text?: string
  loading?: boolean
}

export interface V0AvatarRootProps extends V0AtomProps, Pick<V0AvatarImageProps, 'size'> {}

export interface V0AvatarImageProps extends V0ImgProps {
  size?: string
}

export interface V0AvatarImageEmits {
  load: [e: Event]
  error: [e: Event]
}

export interface V0AvatarFallbackProps extends V0AtomProps {}

export interface V0AvatarContext extends
  Pick<V0AvatarImageProps, 'size'> {
  src?: string
  status: 'loaded' | 'error' | 'loading'
  setStatus: (status: V0AvatarContext['status']) => void
}

export type V0AvatarProvide = MaybeRefOrGetter<V0AvatarContext>
export const V0AvatarKey: InjectionKey<V0AvatarProvide> = Symbol('v0-avatar')
