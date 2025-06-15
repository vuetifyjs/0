// Types
import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import type { V0AtomProps } from '@/components/V0Atom'
import type { SpacingProps } from '@/composables/spacing'

export interface V0AffixPropsBase {
  avatar?: string
  icon?: string
  gap?: string
  loading?: boolean
}

export interface V0AffixRootProps extends
  V0AffixPropsBase,
  V0AtomProps,
  SpacingProps {}

export interface V0AffixContentProps extends V0AtomProps {
  avatar?: V0AffixPropsBase['avatar']
  icon?: V0AffixPropsBase['icon']
}

export interface V0AffixLoadingProps extends V0AtomProps {
  loading?: V0AffixPropsBase['loading']
}

export interface V0AffixInstance {
  avatar: V0AffixPropsBase['avatar']
  icon: V0AffixPropsBase['icon']
  loading: V0AffixPropsBase['loading']
}

export type V0AffixProvide = MaybeRefOrGetter<V0AffixInstance>
export const V0AffixKey: InjectionKey<V0AffixProvide> = Symbol('v0-affix')
