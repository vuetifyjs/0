<script lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import type { V0AtomProps } from '@/components/V0Atom'
  import type { InjectionKey, MaybeRefOrGetter } from 'vue'

  export type V0AffixInstance = {
    avatar: V0AffixProps['avatar']
    icon: V0AffixProps['icon']
    loading: V0AffixProps['loading']
  }

  export type V0AffixProvide = MaybeRefOrGetter<V0AffixInstance>

  export interface V0AffixProps extends V0AtomProps {
    avatar?: string
    icon?: string
    gap?: number | string
    loading?: boolean
    start?: boolean
    end?: boolean
  }

  export const V0AffixKey: InjectionKey<V0AffixProvide> = Symbol('v0-affix')
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0AffixRoot' })

  const props = defineProps<V0AffixProps>()

  const classes = toRef(() => ({
    'v0-affix': true,
    'v0-affix-start': props.start,
    'v0-affix-end': props.end,
  }))

  const styles = toRef(() => ({
    '--v0-affix-gap': props.gap,
  }))

  const provides: V0AffixProvide = toRef(() => ({
    avatar: props.avatar,
    icon: props.icon,
    loading: props.loading,
  }))

  provide(V0AffixKey, provides)
</script>

<template>
  <V0Atom
    :class="classes"
    :style="styles"
  >
    <slot />
  </V0Atom>
</template>

<style lang="scss">
  @import './V0Affix.scss';
</style>
