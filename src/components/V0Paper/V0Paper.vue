<template>
  <tag :class="classes" :style="styles">
    <slot></slot>
  </tag>
</template>

<script setup lang="ts">
  import { useColor, type ColorProps } from '@/composables/color'

  export interface V0PaperProps extends ColorProps {
    borderRadius?: string
    borderColor?: string
    borderStyle?: string
    borderWidth?: string
    fontSize?: string
    fontWeight?: string
    padding?: string

    tag?: string
  }

  const { tag = 'div', ...props } = defineProps<V0PaperProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)
  const borderColor = useColor(props.borderColor ?? color?.value)

  const classes = {
    'v0-paper': true,
  }

  const styles = {
    ['--v0-paper-bg-color']: bgColor?.value,
    ['--v0-paper-border-radius']: props.borderRadius,
    ['--v0-paper-border-color']: borderColor?.value,
    ['--v0-paper-border-style']: props.borderStyle,
    ['--v0-paper-border-width']: props.borderWidth,
    ['--v0-paper-color']: color?.value,
    ['--v0-paper-font-size']: props.fontSize,
    ['--v0-paper-font-weight']: props.fontWeight,
    ['--v0-paper-padding']: props.padding,
  }
</script>

<style lang="scss">
  @import './V0Paper.scss';
</style>
