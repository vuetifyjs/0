<template>
  <V0Atom
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  >
    <slot />
  </V0Atom>
</template>

<script setup lang="ts">
  import { V0Atom } from '@/components/V0Atom'
  import type { V0AtomProps } from '@/components/V0Atom'
  import type { ColorProps } from '@/composables/color'
  import type { DimensionProps } from '@/composables/dimensions'

  export interface V0PaperProps extends V0AtomProps, ColorProps, DimensionProps {
    borderRadius?: string
    borderColor?: string
    borderStyle?: string
    borderWidth?: string
    elevation?: string
    fontSize?: string
    fontWeight?: string | number
    margin?: string
    opacity?: string | number
    padding?: string

    tag?: keyof HTMLElementTagNameMap
  }

  const props = defineProps<V0PaperProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)
  const borderColor = useColor(props.borderColor ?? color?.value)
  const { dimensionStyles } = useDimensions(props, 'paper')
  const { getElevation } = useElevation()

  const elevation = computed(() => getElevation(props.elevation))

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
    ['--v0-paper-elevation']: elevation.value,
    ...dimensionStyles.value,
  }
</script>

<style lang="scss">
  @import './V0Paper.scss';
</style>
