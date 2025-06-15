<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AffixKey } from './types'
  import type { V0AffixProps, V0AffixProvide } from './types'

  defineOptions({ name: 'V0AffixRoot' })

  const props = defineProps<V0AffixProps>()

  const classes = toRef(() => ({
    'v0-affix-root': true,
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
  @use './_variables' as *;

  @layer v0-components {
    .v0-affix-root {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: #{$v0-affix-gap};
      vertical-align: middle;
    }
  }
</style>
