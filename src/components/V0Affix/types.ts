// Types
import type { InjectionKey, MaybeRefOrGetter } from 'vue'
import type { V0AtomProps } from '@/components/V0Atom'
import type { SpacingProps } from '@/composables/spacing'

export interface V0AffixPropsRoot {
  avatar?: string
  icon?: string
  gap?: string
  loading?: boolean
}

export interface V0AffixProps extends
  V0AffixPropsRoot,
  V0AtomProps,
  SpacingProps {}

export interface V0AffixContentProps extends V0AtomProps {
  avatar?: V0AffixPropsRoot['avatar']
  icon?: V0AffixPropsRoot['icon']
}

export interface V0AffixLoadingProps extends V0AtomProps {
  loading?: V0AffixPropsRoot['loading']
}

export interface V0AffixInstance {
  avatar: V0AffixPropsRoot['avatar']
  icon: V0AffixPropsRoot['icon']
  loading: V0AffixPropsRoot['loading']
}

export type V0AffixProvide = MaybeRefOrGetter<V0AffixInstance>
export const V0AffixKey: InjectionKey<V0AffixProvide> = Symbol('v0-affix')
