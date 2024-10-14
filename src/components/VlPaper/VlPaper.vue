<template>
  <tag :class="classes" :style="styles">
    <slot></slot>
  </tag>
</template>

<script setup lang="ts">
  import { useColor, type ColorProps } from '@/composables/color'

  export interface VlPaperProps extends ColorProps {
    borderRadius?: string
    borderColor?: string
    borderStyle?: string
    borderWidth?: string
    fontSize?: string
    fontWeight?: string
    padding?: string

    tag?: string
  }

  const { tag = 'div', ...props } = defineProps<VlPaperProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)
  const borderColor = useColor(props.borderColor ?? color?.value)

  const classes = {
    'vl-paper': true,
  }

  const styles = {
    ['--vl-paper-bg-color']: bgColor?.value,
    ['--vl-paper-border-radius']: props.borderRadius,
    ['--vl-paper-border-color']: borderColor?.value,
    ['--vl-paper-border-style']: props.borderStyle,
    ['--vl-paper-border-width']: props.borderWidth,
    ['--vl-paper-color']: color?.value,
    ['--vl-paper-font-size']: props.fontSize,
    ['--vl-paper-font-weight']: props.fontWeight,
    ['--vl-paper-padding']: props.padding,
  }
</script>

<style lang="scss">
  @import './VlPaper.scss';
</style>
