<template>
  <V0Atom
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  />
</template>

<script setup lang="ts">
  import { V0Atom } from '@/components/V0Atom'
  import type { ColorProps } from '@/composables/color'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0IconProps extends V0AtomProps, ColorProps {
    fontSize?: string
    icon?: string
    opacity?: number | string
  }

  const {
    as = 'i',
    ...props
  } = defineProps<V0IconProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)

  const classes = {
    'v0-icon': true,
    [`${props.icon}`]: true,
  }

  const styles = toRef(() => ({
    ['--v0-icon-background-color']: bgColor?.value,
    ['--v0-icon-color']: color?.value,
    ['--v0-icon-font-size']: props.fontSize,
    ['--v0-icon-opacity']: props.opacity,
  }))
</script>

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
