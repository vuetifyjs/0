<template>
  <i :class="classes" :style="styles"></i>
</template>

<script setup lang="ts">
  import { useColor, type ColorProps } from '@/composables/color'

  export interface V0IconProps extends ColorProps {
    icon?: string
    fontSize?: string
  }

  const props = defineProps<V0IconProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)

  const classes = {
    'v0-icon': true,
    [`${props.icon}`]: true,
  }

  const styles = {
    ['--v0-icon-bg-color']: bgColor?.value,
    ['--v0-icon-color']: color?.value,
    ['--v0-icon-font-size']: props.fontSize,
  }
</script>

<style lang="scss">
  @import './V0Icon.scss';
</style>
