<template>
  <tag :class="classes" :style="styles">
    <slot />
  </tag>
</template>

<script setup lang="ts">
  import { useColor, type ColorProps } from '@/composables/color'
  import { useDimensions, type DimensionProps } from '@/composables/dimensions'
  import { computed } from 'vue'

  export interface V0PaperProps extends ColorProps, DimensionProps {
    borderRadius?: string
    borderColor?: string
    borderStyle?: string
    borderWidth?: string
    fontSize?: string
    fontWeight?: string | number
    margin?: string | number
    opacity?: string | number
    padding?: string | number
    gradient?: string

    tag?: string
  }

  const { tag = 'div', ...props } = defineProps<V0PaperProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)
  const borderColor = useColor(props.borderColor ?? color?.value)
  const { dimensionStyles } = useDimensions(props, 'paper')

  const gradient = computed(() => {
    if (!props.gradient) return null
    // gradient="linear-gradient(to right, #000000, #ffffff)"
    if (props.gradient.includes('gradient(')) return props.gradient

    const parts = props.gradient.split(' ')
    // gradient="radial #ff0000 #00ff00"
    const isRadial = parts.includes('radial')
    // gradient="45deg #ff0000 #00ff00 #0000ff"
    const direction = parts.find(p => p.includes('deg')) || (isRadial ? '' : 'to right')
    const colors = parts.filter(p => p !== 'radial' && !p.includes('deg')).join(', ')

    return isRadial ? `radial-gradient(${colors})` : `linear-gradient(${direction}, ${colors})`
  })

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
    ['--v0-paper-opacity']: props.opacity,
    ['--v0-paper-margin']: props.margin,
    ['--v0-paper-gradient']: gradient.value,

    ...dimensionStyles.value,
  }
</script>

<style lang="scss">
  @import './V0Paper.scss';
</style>
