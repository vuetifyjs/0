<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AffixKey } from './types'
  import type { V0AffixRootProps, V0AffixProvide } from './types'

  defineOptions({ name: 'V0AffixRoot' })

  const props = defineProps<V0AffixRootProps>()

  const { spacingStyles } = useSpacing(props)

  const styles = toRef(() => ({
    '--v0-affix-root-gap': props.gap,

    ...spacingStyles.value,
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
    class="v0-affix-root"
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
      gap: #{$v0-affix-root-gap};
      margin: #{$v0-affix-root-margin};
      padding: #{$v0-affix-root-padding};
      vertical-align: middle;
    }
  }
</style>
