// Types
import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import type { V0AtomProps } from '@/components/V0Atom'

export interface V0AffixProps extends V0AtomProps {
  avatar?: string
  icon?: string
  gap?: number | string
  loading?: boolean
  start?: boolean
  end?: boolean
}

export interface V0AffixContentProps extends V0AtomProps {
  avatar?: string
  icon?: string
}

export interface V0AffixLoadingProps extends V0AtomProps {
  loading?: boolean
}

export interface V0AffixInstance {
  avatar: V0AffixProps['avatar']
  icon: V0AffixProps['icon']
  loading: V0AffixProps['loading']
}

export type V0AffixProvide = MaybeRefOrGetter<V0AffixInstance>
export const V0AffixKey: InjectionKey<V0AffixProvide> = Symbol('v0-affix')
