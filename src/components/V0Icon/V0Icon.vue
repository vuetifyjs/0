<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import type { V0IconProps } from './types'

  const {
    as = 'i',
    ...props
  } = defineProps<V0IconProps>()

  const { colorStyles } = useColor(props)

  const classes = {
    'v0-icon': true,
    [`${props.icon}`]: true,
  }

  const styles = toRef(() => ({
    ['--v0-icon-font-size']: props.fontSize,
    ['--v0-icon-opacity']: props.opacity,

    ...colorStyles.value,
  }))
</script>

<template>
  <V0Atom
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  />
</template>

<style lang="scss">
  @use './variables' as *;

  @layer v0-components {
    .v0-icon {
      background-color: #{$v0-icon-background-color};
      color: #{$v0-icon-color};
      display: inline-flex;
      font-size: #{$v0-icon-font-size};
      opacity: #{$v0-icon-opacity};
    }
  }
</style>
